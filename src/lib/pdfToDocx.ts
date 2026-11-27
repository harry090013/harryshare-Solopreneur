import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  PageBreak,
  ShadingType,
} from 'docx';

export type PdfToWordMode = 'editable' | 'exact-layout';

export interface PdfToDocxOptions {
  mode?: PdfToWordMode;
  onProgress?: (msg: string) => void;
  /** Optional custom renderer for scanned/exact-layout pages (browser only) */
  renderPageToPng?: (pageNumber: number, scale: number) => Promise<{
    bytes: Uint8Array;
    widthPx: number;
    heightPx: number;
  } | null>;
}

export interface PdfToDocxResult {
  blob: Blob;
  totalPages: number;
  previewText: string;
  stats: {
    headings: number;
    paragraphs: number;
    tables: number;
    scannedPages: number;
  };
}

interface PdfTextItemRaw {
  str?: string;
  transform?: number[];
  width?: number;
  height?: number;
  fontName?: string;
}

interface PdfTextStyleRaw {
  fontFamily?: string;
}

interface StyledSpan {
  x: number;
  right: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  text: string;
}

interface VisualLine {
  y: number;
  left: number;
  right: number;
  fontSize: number;
  boldRatio: number;
  spans: StyledSpan[];
  text: string;
  columns: StyledSpan[][];
}

const BULLET_REGEX = /^([•●▪◦‣\-–—*]|\d{1,3}[.)]|[a-zA-Z][.)])\s+/;

function inferFontMeta(fontName: string, styleFamily?: string, realFontName?: string) {
  const combined = `${fontName} ${styleFamily || ''} ${realFontName || ''}`;
  const bold = /bold|black|heavy|semibold|demibold|extrabold|\bbd\b|700|800|900/i.test(combined);
  const italic = /italic|oblique|slant|\bit\b/i.test(combined);

  let fontFamily = 'Arial';
  if (/courier|mono|consolas|code/i.test(combined)) {
    fontFamily = 'Consolas';
  } else if (/times|georgia|cambria|garamond|palatino|merriweather|serif/i.test(combined) && !/sans-serif/i.test(combined)) {
    fontFamily = 'Times New Roman';
  }

  return { bold, italic, fontFamily };
}

function buildTextRunsFromSpans(spans: StyledSpan[], forceBold = false): TextRun[] {
  if (spans.length === 0) return [];
  const sorted = [...spans].sort((a, b) => a.x - b.x);

  const merged: {
    text: string;
    bold: boolean;
    italic: boolean;
    fontSize: number;
    fontFamily: string;
  }[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i];
    const prev = i > 0 ? sorted[i - 1] : null;
    let piece = cur.text;

    if (prev) {
      const gap = cur.x - prev.right;
      const needsSpace =
        gap > cur.fontSize * 0.16 &&
        !prev.text.endsWith(' ') &&
        !piece.startsWith(' ') &&
        !/^[,.;:!?)\]}]/.test(piece);
      if (needsSpace) {
        piece = ` ${piece}`;
      }
    }

    const bold = forceBold || cur.bold;
    const roundedSize = Math.round(cur.fontSize * 2); // half-points
    const last = merged[merged.length - 1];

    if (
      last &&
      last.bold === bold &&
      last.italic === cur.italic &&
      Math.abs(last.fontSize - roundedSize) <= 1 &&
      last.fontFamily === cur.fontFamily
    ) {
      last.text += piece;
    } else {
      merged.push({
        text: piece,
        bold,
        italic: cur.italic,
        fontSize: roundedSize,
        fontFamily: cur.fontFamily,
      });
    }
  }

  return merged.map(
    (m) =>
      new TextRun({
        text: m.text,
        bold: m.bold,
        italics: m.italic,
        size: Math.max(14, Math.min(96, m.fontSize)),
        font: m.fontFamily,
      })
  );
}

function splitLineIntoColumns(spans: StyledSpan[], avgFontSize: number): StyledSpan[][] {
  if (spans.length === 0) return [];
  const sorted = [...spans].sort((a, b) => a.x - b.x);
  const cols: StyledSpan[][] = [[sorted[0]]];
  const colGapThreshold = Math.max(20, avgFontSize * 2.0);

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const gap = cur.x - prev.right;
    if (gap >= colGapThreshold) {
      cols.push([cur]);
    } else {
      cols[cols.length - 1].push(cur);
    }
  }
  return cols;
}

function spansToPlainText(spans: StyledSpan[]): string {
  const sorted = [...spans].sort((a, b) => a.x - b.x);
  let out = '';
  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i];
    const prev = i > 0 ? sorted[i - 1] : null;
    if (prev) {
      const gap = cur.x - prev.right;
      if (
        gap > cur.fontSize * 0.16 &&
        !prev.text.endsWith(' ') &&
        !cur.text.startsWith(' ') &&
        !/^[,.;:!?)\]}]/.test(cur.text)
      ) {
        out += ' ';
      }
    }
    out += cur.text;
  }
  return out.replace(/\s+/g, ' ').trim();
}

function computeMedianBodyFontSize(allLines: VisualLine[]): number {
  const sizes: number[] = [];
  for (const line of allLines) {
    const weight = Math.min(40, Math.max(1, Math.round(line.text.length / 4)));
    for (let i = 0; i < weight; i++) sizes.push(Math.round(line.fontSize * 2) / 2);
  }
  if (sizes.length === 0) return 11;
  sizes.sort((a, b) => a - b);
  return sizes[Math.floor(sizes.length / 2)];
}

function detectAlignment(
  line: VisualLine,
  contentLeft: number,
  contentRight: number,
  pageWidthPt: number
): (typeof AlignmentType)[keyof typeof AlignmentType] {
  const contentWidth = Math.max(100, contentRight - contentLeft);
  const lineWidth = line.right - line.left;
  const leftOffset = line.left - contentLeft;
  const rightOffset = contentRight - line.right;
  const lineCenterX = (line.left + line.right) / 2;
  const pageCenterX = pageWidthPt / 2;

  // Check centered against true page center OR against content bounds
  const centeredOnPage =
    lineWidth < pageWidthPt * 0.82 &&
    leftOffset > 20 &&
    Math.abs(lineCenterX - pageCenterX) < 22;

  const centeredInContent =
    lineWidth < contentWidth * 0.85 &&
    leftOffset > 22 &&
    rightOffset > 22 &&
    Math.abs(leftOffset - rightOffset) < 26;

  if (centeredOnPage || centeredInContent) {
    return AlignmentType.CENTER;
  }

  if (lineWidth < contentWidth * 0.65 && rightOffset < 18 && leftOffset > contentWidth * 0.35) {
    return AlignmentType.RIGHT;
  }

  return AlignmentType.LEFT;
}

function buildTableBlock(rows: VisualLine[]): Table {
  const maxCols = Math.max(...rows.map((r) => r.columns.length));
  const colWidthPct = Math.floor(100 / maxCols);

  const subtleBorder = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: 'D6D3D1',
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, rowIdx) => {
      const isHeader = rowIdx === 0 && row.boldRatio >= 0.5;
      const cells: TableCell[] = [];
      for (let c = 0; c < maxCols; c++) {
        const colSpans = row.columns[c] || [];
        cells.push(
          new TableCell({
            width: { size: colWidthPct, type: WidthType.PERCENTAGE },
            shading: isHeader
              ? { fill: 'F5F5F4', type: ShadingType.CLEAR, color: 'auto' }
              : undefined,
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            borders: {
              top: subtleBorder,
              bottom: subtleBorder,
              left: subtleBorder,
              right: subtleBorder,
            },
            children: [
              new Paragraph({
                spacing: { before: 20, after: 20 },
                children:
                  colSpans.length > 0
                    ? buildTextRunsFromSpans(colSpans, isHeader)
                    : [new TextRun({ text: '' })],
              }),
            ],
          })
        );
      }
      return new TableRow({ children: cells });
    }),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function convertPdfDocumentToDocx(pdf: any, options: PdfToDocxOptions = {}): Promise<PdfToDocxResult> {
  const mode: PdfToWordMode = options.mode || 'editable';
  const totalPages: number = pdf.numPages;

  let firstPageWidthPt = 595.28;
  let firstPageHeightPt = 841.89;

  const stats = {
    headings: 0,
    paragraphs: 0,
    tables: 0,
    scannedPages: 0,
  };

  // Mode 2: Exact visual layout preservation (100% identical to original PDF pages)
  if (mode === 'exact-layout' && options.renderPageToPng) {
    const children: Paragraph[] = [];
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      options.onProgress?.(`Đang dựng trang bố cục chuẩn ${pageNum}/${totalPages}...`);
      const page = await pdf.getPage(pageNum);
      const vp = page.getViewport({ scale: 1 });
      if (pageNum === 1) {
        firstPageWidthPt = vp.width;
        firstPageHeightPt = vp.height;
      }

      const rendered = await options.renderPageToPng(pageNum, 2.2);
      if (rendered) {
        // Fit image cleanly to page dimensions (96dpi px = pt * 96 / 72)
        const targetW = Math.round((vp.width * 96) / 72);
        const targetH = Math.round((vp.height * 96) / 72);
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 0 },
            children: [
              new ImageRun({
                data: rendered.bytes,
                type: 'png',
                transformation: { width: targetW, height: targetH },
              }),
            ],
          })
        );
        stats.scannedPages += 1;
      }
      if (pageNum < totalPages) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: Math.round(firstPageWidthPt * 20),
                height: Math.round(firstPageHeightPt * 20),
              },
              margin: { top: 0, bottom: 0, left: 0, right: 0 },
            },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    return {
      blob,
      totalPages,
      previewText: `[Chế độ Giữ nguyên 100% bố cục: đã xuất ${totalPages} trang nét cao vào file Word]`,
      stats,
    };
  }

  // Mode 1: Smart Editable Formatting Preservation
  const pageExtracted: {
    pageNum: number;
    widthPt: number;
    heightPt: number;
    lines: VisualLine[];
  }[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    options.onProgress?.(`Đang phân tích cấu trúc & định dạng trang ${pageNum}/${totalPages}...`);
    const page = await pdf.getPage(pageNum);
    const vp = page.getViewport({ scale: 1 });
    if (pageNum === 1) {
      firstPageWidthPt = vp.width;
      firstPageHeightPt = vp.height;
    }

    const textContent = await page.getTextContent();
    const styles: Record<string, PdfTextStyleRaw> = textContent.styles || {};

    // Collect raw styled spans
    const rawSpans: StyledSpan[] = [];
    for (const rawItem of textContent.items) {
      const item = rawItem as PdfTextItemRaw;
      if (!item.str || !item.transform) continue;
      if (item.str.trim() === '' && item.str.length === 0) continue;

      const t = item.transform;
      const fontSize = Math.max(6, Math.min(72, Math.hypot(t[0], t[1]) || Math.abs(t[3]) || 11));
      const x = t[4];
      const y = t[5];
      const width = typeof item.width === 'number' && item.width > 0 ? item.width : item.str.length * fontSize * 0.45;

      let realFontName = '';
      try {
        if (item.fontName && page.commonObjs?.has?.(item.fontName)) {
          const obj = page.commonObjs.get(item.fontName);
          if (obj?.name) realFontName = String(obj.name);
        }
      } catch {
        // Ignore font lookup errors on non-standard PDFs
      }

      const styleFamily = item.fontName ? styles[item.fontName]?.fontFamily : undefined;
      const { bold, italic, fontFamily } = inferFontMeta(item.fontName || '', styleFamily, realFontName);

      rawSpans.push({
        x,
        right: x + width,
        y,
        fontSize,
        fontFamily,
        bold,
        italic,
        text: item.str,
      });
    }

    // Group spans into visual lines by Y proximity (within 35% of font size)
    rawSpans.sort((a, b) => b.y - a.y || a.x - b.x);
    const lines: VisualLine[] = [];

    for (const span of rawSpans) {
      if (span.text.trim() === '') continue;
      const match = lines.find((l) => Math.abs(l.y - span.y) <= Math.max(3, Math.min(l.fontSize, span.fontSize) * 0.42));
      if (match) {
        match.spans.push(span);
        match.left = Math.min(match.left, span.x);
        match.right = Math.max(match.right, span.right);
      } else {
        lines.push({
          y: span.y,
          left: span.x,
          right: span.right,
          fontSize: span.fontSize,
          boldRatio: 0,
          spans: [span],
          text: '',
          columns: [],
        });
      }
    }

    // Finalize line stats
    lines.sort((a, b) => b.y - a.y);
    for (const line of lines) {
      const totalChars = line.spans.reduce((acc, s) => acc + s.text.trim().length, 0) || 1;
      const weightedFontSize =
        line.spans.reduce((acc, s) => acc + s.fontSize * s.text.trim().length, 0) / totalChars;
      const boldChars = line.spans.reduce((acc, s) => acc + (s.bold ? s.text.trim().length : 0), 0);
      line.fontSize = weightedFontSize;
      line.boldRatio = boldChars / totalChars;
      line.text = spansToPlainText(line.spans);
      line.columns = splitLineIntoColumns(line.spans, weightedFontSize);
    }

    pageExtracted.push({
      pageNum,
      widthPt: vp.width,
      heightPt: vp.height,
      lines: lines.filter((l) => l.text.length > 0),
    });
  }

  const allLines = pageExtracted.flatMap((p) => p.lines);
  const bodyFontSize = computeMedianBodyFontSize(allLines);

  // Infer document left/right content bounds
  const leftEdges = allLines.map((l) => l.left).sort((a, b) => a - b);
  const rightEdges = allLines.map((l) => l.right).sort((a, b) => b - a);
  const contentLeft = leftEdges.length > 0 ? leftEdges[Math.floor(leftEdges.length * 0.1)] : 54;
  const contentRight = rightEdges.length > 0 ? rightEdges[Math.floor(rightEdges.length * 0.1)] : firstPageWidthPt - 54;
  const contentWidth = Math.max(200, contentRight - contentLeft);

  const docChildren: (Paragraph | Table)[] = [];
  const previewChunks: string[] = [];

  for (const pageData of pageExtracted) {
    const { pageNum, lines, widthPt, heightPt } = pageData;

    // Fallback for scanned/image-only pages
    if (lines.length === 0) {
      if (options.renderPageToPng) {
        options.onProgress?.(`Trang ${pageNum} là trang scan — đang nhúng ảnh nét cao vào Word...`);
        const rendered = await options.renderPageToPng(pageNum, 2.0);
        if (rendered) {
          const usableW = Math.round(((widthPt - 96) * 96) / 72);
          const usableH = Math.round((usableW * rendered.heightPx) / rendered.widthPx);
          const maxH = Math.round(((heightPt - 96) * 96) / 72);
          const finalH = Math.min(usableH, maxH);
          const finalW = Math.round((finalH * rendered.widthPx) / rendered.heightPx);
          docChildren.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: rendered.bytes,
                  type: 'png',
                  transformation: { width: finalW, height: finalH },
                }),
              ],
            })
          );
          stats.scannedPages += 1;
        }
      } else {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[Trang ${pageNum}: Không tìm thấy lớp chữ — trang ảnh scan]`,
                italics: true,
                color: '78716C',
              }),
            ],
          })
        );
      }

      if (pageNum < totalPages) {
        docChildren.push(new Paragraph({ children: [new PageBreak()] }));
      }
      continue;
    }

    if (previewChunks.length < 3) {
      previewChunks.push(`--- Trang ${pageNum} ---\n${lines.slice(0, 14).map((l) => l.text).join('\n')}`);
    }

    let i = 0;
    while (i < lines.length) {
      const cur = lines[i];

      // 1. Check if consecutive lines form a multi-column table
      if (cur.columns.length >= 2) {
        const tableRows: VisualLine[] = [cur];
        let j = i + 1;
        while (j < lines.length) {
          const next = lines[j];
          const dy = tableRows[tableRows.length - 1].y - next.y;
          if (next.columns.length >= 2 && dy > 0 && dy <= Math.max(cur.fontSize, next.fontSize) * 3.0) {
            tableRows.push(next);
            j++;
          } else {
            break;
          }
        }

        if (tableRows.length >= 2) {
          docChildren.push(buildTableBlock(tableRows));
          docChildren.push(new Paragraph({ spacing: { before: 40, after: 80 }, children: [] }));
          stats.tables += 1;
          i = j;
          continue;
        }
      }

      // 2. Detect heading level (and merge consecutive wrapped lines of the same heading)
      const alignment = detectAlignment(cur, contentLeft, contentRight, widthPt);
      const getHeadingLevel = (line: VisualLine): 1 | 2 | 3 | 0 => {
        if (line.fontSize >= bodyFontSize * 1.5) return 1;
        if (line.fontSize >= bodyFontSize * 1.25) return 2;
        if (line.fontSize >= bodyFontSize * 1.1 && line.boldRatio >= 0.7) return 3;
        return 0;
      };

      const headingLvl = getHeadingLevel(cur);
      if (headingLvl > 0) {
        const headingLines: VisualLine[] = [cur];
        let j = i + 1;
        while (j < lines.length) {
          const prev = headingLines[headingLines.length - 1];
          const next = lines[j];
          const dy = prev.y - next.y;
          const nextAlign = detectAlignment(next, contentLeft, contentRight, widthPt);
          if (
            getHeadingLevel(next) === headingLvl &&
            nextAlign === alignment &&
            next.columns.length < 2 &&
            dy > 0 &&
            dy <= prev.fontSize * 1.6
          ) {
            headingLines.push(next);
            j++;
          } else {
            break;
          }
        }

        const headingRuns: TextRun[] = [];
        headingLines.forEach((hLine, idx) => {
          if (idx > 0) {
            headingRuns.push(
              new TextRun({
                text: ' ',
                bold: headingLvl === 1 || headingLvl === 2,
                size: Math.round(hLine.fontSize * 2),
              })
            );
          }
          headingRuns.push(...buildTextRunsFromSpans(hLine.spans, headingLvl === 1 || headingLvl === 2));
        });

        docChildren.push(
          new Paragraph({
            heading:
              headingLvl === 1
                ? HeadingLevel.HEADING_1
                : headingLvl === 2
                  ? HeadingLevel.HEADING_2
                  : HeadingLevel.HEADING_3,
            alignment,
            spacing: { before: headingLvl === 1 ? 240 : 180, after: 100 },
            children: headingRuns,
          })
        );
        stats.headings += 1;
        i = j;
        continue;
      }

      // 3. Smart paragraph merging for normal body lines
      const paraLines: VisualLine[] = [cur];
      const isBullet = BULLET_REGEX.test(cur.text);

      let j = i + 1;
      while (j < lines.length) {
        const prev = paraLines[paraLines.length - 1];
        const next = lines[j];
        const dy = prev.y - next.y;
        const nextAlign = detectAlignment(next, contentLeft, contentRight, widthPt);
        const prevWidthRatio = (prev.right - prev.left) / contentWidth;

        const sameStyle =
          alignment === AlignmentType.LEFT &&
          nextAlign === AlignmentType.LEFT &&
          Math.abs(next.fontSize - prev.fontSize) <= 1.2 &&
          next.columns.length < 2 &&
          !BULLET_REGEX.test(next.text) &&
          next.fontSize < bodyFontSize * 1.2;

        const normalLineGap = dy > 0 && dy <= prev.fontSize * 1.75;
        const wrappedLine = prevWidthRatio >= 0.72 || (isBullet && next.left > cur.left + 4);

        if (sameStyle && normalLineGap && wrappedLine) {
          paraLines.push(next);
          j++;
        } else {
          break;
        }
      }

      // Combine runs across merged lines with a single space between lines
      const combinedRuns: TextRun[] = [];
      paraLines.forEach((pLine, idx) => {
        if (idx > 0) {
          combinedRuns.push(new TextRun({ text: ' ', size: Math.round(pLine.fontSize * 2) }));
        }
        combinedRuns.push(...buildTextRunsFromSpans(pLine.spans));
      });

      const indentLeftPt = alignment === AlignmentType.LEFT ? Math.max(0, cur.left - contentLeft) : 0;
      const nextLine = lines[j];
      const gapAfterPt = nextLine ? Math.max(4, Math.min(20, (paraLines[paraLines.length - 1].y - nextLine.y) - cur.fontSize)) : 8;

      docChildren.push(
        new Paragraph({
          alignment,
          indent:
            indentLeftPt > 14
              ? { left: Math.round(indentLeftPt * 20) }
              : isBullet
                ? { left: 360, hanging: 180 }
                : undefined,
          spacing: {
            after: Math.round(Math.max(80, gapAfterPt * 14)),
            line: 276, // 1.15x clean line spacing
          },
          children: combinedRuns,
        })
      );

      stats.paragraphs += 1;
      i = j;
    }

    if (pageNum < totalPages) {
      docChildren.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  options.onProgress?.('Đang đóng gói file Word (.docx) giữ nguyên định dạng...');
  const marginLeftTwips = Math.round(Math.max(36, Math.min(84, contentLeft)) * 20);
  const marginRightTwips = Math.round(Math.max(36, Math.min(84, firstPageWidthPt - contentRight)) * 20);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: Math.round(firstPageWidthPt * 20),
              height: Math.round(firstPageHeightPt * 20),
            },
            margin: {
              top: 1080,
              bottom: 1080,
              left: marginLeftTwips,
              right: marginRightTwips,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return {
    blob,
    totalPages,
    previewText: previewChunks.join('\n\n'),
    stats,
  };
}
