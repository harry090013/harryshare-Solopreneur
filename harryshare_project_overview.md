# HarryShare - Project Architecture & Context Overview

This document provides a comprehensive guide for any AI agent assisting with the development of the **HarryShare** website.

---

## 1. Project Identity & Vision

*   **Official Domain**: `harryshare.vn`
*   **Public Website**: `https://www.harryshare.vn/`
*   **GitHub Repository**: `https://github.com/harry090013/brand-web-harryshare.vn` (cloned locally as `harryshare-Solopreneur`)
*   **Purpose**: HarryShare is a personal online journal published to the community. It logs Harry's journey in work, software, AI, digital marketing, product design, and personal brand building. It serves as a value-first platform with zero aggressive sales.
*   **Branding & Aesthetics**: 
    *   Muted, rustic, yet modern digital aesthetic.
    *   **Color Palette**: Sand, Cream (`bg-cream`), Olive Green (`text-olive`, `bg-olive`), Dark Slate (`text-stone-850`).
    *   **Design Accents**: Soft dotted grids (`bg-dot-pattern`), glassmorphism cards (`bg-cream/70 backdrop-blur-md`), elegant serif headings (`font-serif`), clean sans-serif content body (`font-sans`).
    *   **Tone of Voice**: Humble, positive, highly structured, logical, and growth-oriented.

---

## 2. Technical Stack

*   **Framework**: Next.js 15 (App Router convention, Server Actions, Client Components)
*   **Language**: TypeScript (`.ts`, `.tsx`)
*   **Database & ORM**: Prisma Client connected to a PostgreSQL database (hosted on Supabase)
*   **Styling**: Tailwind CSS (with utility classes)
*   **Deployment**: Vercel
*   **Caching & Optimization**: Incremental Static Regeneration (ISR) with configured revalidation times (`revalidate = 30` or `revalidate = 0` for pages that require real-time updates).

---

## 3. Directory Structure & Key Routes

```md
f:/Dev/harryshare-code/
├── prisma/
│   ├── schema.prisma       # Database models for Admin, Post, Category, Product, ProjectResource, etc.
│   └── seed.ts             # Default mock and seed data structure
├── public/
│   ├── amthanhsaotruc2.MP3 # Relaxing flute music background
│   └── ...                 # Image assets, banners, avatars
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root HTML wrapper, metadataBase, Google Font declarations
│   │   ├── page.tsx        # Homepage (Hero section, Featured items, etc.)
│   │   ├── globals.css     # CSS globals, tailwind utilities, dot patterns
│   │   ├── robots.ts       # robots.txt rule generator
│   │   ├── ve-harry/       # Timeline story page about Harry
│   │   ├── lien-he/        # Contact page (stores contact form queries in DB)
│   │   ├── chia-se/        # Posts / Blog section (displays markdown articles)
│   │   │   ├── [slug]/     # Individual article page
│   │   │   └── page.tsx    # List of all posts with search & category filters
│   │   ├── du-an-tai-nguyen/ # "Projects & Resources" directory
│   │   │   ├── page.tsx
│   │   │   └── ProjectsClient.tsx
│   │   ├── san-pham/       # "Products & Store" directory
│   │   │   ├── page.tsx
│   │   │   ├── ProductsClient.tsx
│   │   │   └── [slug]/     # Individual product review or store page
│   │   └── quan-tri-harry/ # Admin Panel (authenticated via JWT cookies)
│   │       ├── login/      # Admin login page
│   │       ├── page.tsx    # Dashboard statistics
│   │       └── posts/      # Posts management with client-side 10-item pagination
│   ├── components/
│   │   ├── Navbar.tsx      # Top navigation header
│   │   ├── Footer.tsx      # Bottom copyright and links
│   │   └── MusicPlayer.tsx # Audio player on the top navigation for relaxing flute music
│   └── lib/
│       └── db.ts           # Prisma Client instantiation instance
```

---

## 4. Database Schema (Prisma)

The main models used in the system are:

*   **Category**: Categorizes posts, resources, and products. Holds a `type` field ("post", "resource", "product") to enforce separation.
*   **Post**: The core blog post model. Contains Markdown content in `content`, status (`published`), and statistics (`views`, `likes`, `shares`).
*   **ProjectResource**: Items in the "Dự án & Tài nguyên" page. Has a `type` ("tool" for recommended tools, "freebie" for free downloads).
*   **Product**: Items in the "Cửa hàng" page. Has a `type` ("affiliate" for referral links, "main" for direct items).
*   **Comment**: Comments submitted for posts (requires admin approval `approved`).
*   **Contact**: Messages submitted via the contact form.
*   **Subscriber**: Newsletter email subscribers list.

---

## 5. Development Principles & Instructions

1.  **Strict Brand Consistency**: Always preserve the Sand, Cream, and Olive palette. Maintain a clean, premium typography using the custom fonts (`--font-inter`, `--font-merriweather`).
2.  **No Unrequested Redesigns**: The core page layout is finalized. Enhance details (shadows, transitions, spacing, typography, grid alignments) but do not change the core paths or database logic unless instructed.
3.  **SEO & Metadata**: Always ensure clean semantic markup (`<main>`, `<article>`, proper `<h1>` hierarchy) and include a fallback canonical meta setup. Next.js `metadataBase` is set to `https://harryshare.vn`.
4.  **Google Trends Scanning**: When generating new posts, verify and search current Google Trends to target optimal keywords for target categories before drafting content.
5.  **Flute Background Music**: The site utilizes a global flute background music player loading `/amthanhsaotruc2.MP3`. Keep this component intact and functioning on the navigation bar.
