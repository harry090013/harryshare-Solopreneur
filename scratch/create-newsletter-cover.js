const sharp = require('sharp');

const svgBanner = `
<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad)"/>
  
  <!-- Subtle decorative grid -->
  <g stroke="#334155" stroke-width="1" opacity="0.2">
    <line x1="0" y1="135" x2="1200" y2="135"/>
    <line x1="0" y1="270" x2="1200" y2="270"/>
    <line x1="0" y1="405" x2="1200" y2="405"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
    <line x1="200" y1="0" x2="200" y2="675"/>
    <line x1="400" y1="0" x2="400" y2="675"/>
    <line x1="600" y1="0" x2="600" y2="675"/>
    <line x1="800" y1="0" x2="800" y2="675"/>
    <line x1="1000" y1="0" x2="1000" y2="675"/>
  </g>

  <!-- Glow effect -->
  <circle cx="600" cy="337" r="320" fill="#38bdf8" opacity="0.07"/>
  <circle cx="950" cy="200" r="220" fill="#818cf8" opacity="0.08"/>

  <!-- Main Newsletter Card -->
  <rect x="240" y="95" width="720" height="485" rx="24" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5"/>

  <!-- Card Top Window Bar -->
  <rect x="240" y="95" width="720" height="52" rx="24" fill="#0b1120"/>
  <rect x="240" y="125" width="720" height="22" fill="#0b1120"/>
  <line x1="240" y1="147" x2="960" y2="147" stroke="#1e293b" stroke-width="1"/>

  <!-- Window dots -->
  <circle cx="280" cy="121" r="7" fill="#ef4444" opacity="0.8"/>
  <circle cx="304" cy="121" r="7" fill="#f59e0b" opacity="0.8"/>
  <circle cx="328" cy="121" r="7" fill="#10b981" opacity="0.8"/>
  <text x="600" y="127" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="500" text-anchor="middle">harryshare.vn / newsletter</text>

  <!-- Inside Card Content -->
  <!-- Tag Badge -->
  <rect x="290" y="180" width="220" height="34" rx="17" fill="#0369a1" fill-opacity="0.25" stroke="#0284c7" stroke-width="1"/>
  <text x="400" y="202" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="600" text-anchor="middle">PERSONAL NEWSLETTER</text>

  <!-- Title inside card -->
  <text x="290" y="260" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="30" font-weight="700">Kênh kết nối bền vững</text>
  <text x="290" y="306" fill="url(#accentGrad)" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="30" font-weight="700">Không phụ thuộc thuật toán</text>

  <!-- Content teaser lines -->
  <rect x="290" y="348" width="620" height="10" rx="5" fill="#334155" opacity="0.6"/>
  <rect x="290" y="372" width="540" height="10" rx="5" fill="#334155" opacity="0.45"/>
  <rect x="290" y="396" width="420" height="10" rx="5" fill="#334155" opacity="0.3"/>

  <!-- Card Footer -->
  <line x1="290" y1="445" x2="910" y2="445" stroke="#1e293b" stroke-width="1.5"/>

  <!-- Left Footer Info -->
  <text x="290" y="495" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="500">Tài sản số độc lập của Solopreneur</text>
  <text x="290" y="522" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13">Gửi trực tiếp đến hòm thư • Giữ trọn sự tin cậy</text>

  <!-- Send Action Button -->
  <rect x="740" y="475" width="170" height="46" rx="23" fill="url(#badgeGrad)"/>
  <text x="825" y="504" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" text-anchor="middle">Đọc Bản Tin ➔</text>
</svg>
`;

async function main() {
  await sharp(Buffer.from(svgBanner))
    .webp({ quality: 90 })
    .toFile('public/images/ban-tin-email-newsletter-ca-nhan-kenh-ket-noi-ben-vung.webp');
  
  console.log('✓ Successfully created banner: ban-tin-email-newsletter-ca-nhan-kenh-ket-noi-ben-vung.webp');
}

main().catch(console.error);
