'use client';

import React, { useEffect, useState } from 'react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const headingElements = article.querySelectorAll('h2, h3');
    const items: HeadingItem[] = [];

    headingElements.forEach((el, index) => {
      const text = el.textContent || '';
      let id = el.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        if (id.startsWith('-')) id = id.substring(1);
        if (id.endsWith('-')) id = id.substring(0, id.length - 1);
        id = `${id}-${index}`;
        el.id = id;
      }
      items.push({
        id,
        text,
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.1 }
    );

    headingElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block xl:absolute xl:left-full xl:ml-12 xl:top-40 w-60 shrink-0 select-none">
      <div className="sticky top-28 bg-cream/70 backdrop-blur-md border border-olive/10 p-5 rounded-2xl shadow-xs">
        <h4 className="font-serif text-sm font-bold text-stone-850 border-b border-olive/10 pb-2 mb-3 uppercase tracking-wider">
          Mục lục
        </h4>
        <ul className="flex flex-col gap-2.5">
          {headings.map((h) => (
            <li
              key={h.id}
              className="list-none"
              style={{ paddingLeft: h.level === 3 ? '12px' : '0px' }}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-xs block leading-normal transition-colors cursor-pointer ${
                  activeId === h.id
                    ? 'text-olive font-extrabold border-l-2 border-olive pl-1.5 -ml-2'
                    : 'text-stone-500 hover:text-olive pl-0'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
