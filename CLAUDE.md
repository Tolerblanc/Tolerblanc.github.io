# Tolerblanc's Technical Blog - AI Assistant Guide

> **Last Updated**: 2025-11-15
> **Astro Version**: 5.14.4
> **Migration Status**: ✅ Production Ready (Jekyll → Astro completed 2025-11-09)

---

## 📋 Quick Reference

**Critical Information for AI Assistants:**
- ⚠️ **Content collection name**: `blog` (NOT `posts`)
- 📁 **Blog posts location**: `src/content/blog/{category}/`
- 🎨 **UI Components**: 19 shadcn/ui components in `src/components/ui/`
- 🔧 **Package manager**: pnpm (NOT npm)
- 🌙 **Theme toggle**: Implemented in Header.astro (NOT separate ThemeToggle component)
- 🔍 **Search**: Pagefind (only works in production builds)

---

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Actual Project Structure](#actual-project-structure)
4. [Key Conventions](#key-conventions)
5. [Development Workflows](#development-workflows)
6. [Component Architecture](#component-architecture)
7. [Content Management](#content-management)
8. [Styling System](#styling-system)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)
10. [Common Tasks & Recipes](#common-tasks--recipes)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What This Is

A high-performance Korean technical blog built with Astro 5, successfully migrated from Jekyll + Minimal Mistakes theme in November 2025.

**Key Metrics**:
- 📄 **56 blog posts** (MDX format)
- ⚡ **4.37s build time** (85% faster than Jekyll)
- 🎨 **19 shadcn/ui components**
- 🔍 **17,623 words indexed** (Pagefind search)
- ✅ **0 TypeScript errors** (strict mode)
- 🌙 **FOUC-free dark mode**
- 📦 **132 pages generated**

### Project Goals

1. **Performance**: Minimal JavaScript, maximum static generation
2. **Type Safety**: TypeScript strict mode throughout
3. **Modern UI**: shadcn/ui design system with Lucide React icons
4. **SEO**: Structured data, sitemap, RSS feed
5. **DX**: Fast builds, hot reload, comprehensive documentation

---

## Technology Stack

```yaml
Core:
  Framework: Astro 5.14.4
  Runtime: Node >= 18.0.0
  Package Manager: pnpm >= 8.0.0

UI:
  React: 18.3.1 (islands only)
  shadcn/ui: Component library
  Lucide React: Icon system

Styling:
  Tailwind CSS: 3.4.1
  Plugins:
    - @tailwindcss/typography
    - tailwindcss-animate
  Custom: design-tokens.css

Content:
  Format: MDX (Markdown + JSX)
  Collections: Astro Content Collections
  Math: KaTeX 0.16.25
  Syntax: Shiki (github-light/dark themes)

Features:
  Search: Pagefind 1.4.0
  Comments: Giscus (GitHub Discussions)
  Analytics: Google Analytics (G-JWJT3DQR8G)
  Transitions: Astro View Transitions

Development:
  TypeScript: 5.9.3 (strict mode)
  Testing: Playwright 1.56.1
  CI/CD: GitHub Actions
```

---

## Actual Project Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Auto-deploy to GitHub Pages
│
├── docs/                           # Documentation (not in build)
│   ├── MIGRATION_COMPLETED.md      # Migration history
│   ├── COMPONENTS.md               # Component usage guide
│   └── SHADCN_UI_STATUS.md         # UI component inventory
│
├── public/                         # Static assets
│   ├── robots.txt
│   ├── ads.txt
│   ├── *.png                       # Favicons
│   └── *.html                      # Search console verification
│
├── src/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui (19 components)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── blog-post-card.tsx  # Custom blog card
│   │   │   ├── blog-pagination.tsx
│   │   │   ├── blog-sidebar.tsx    # (deprecated, use Sidebar.astro)
│   │   │   └── ...
│   │   ├── CodeCopyButton.astro
│   │   ├── GiscusComments.astro
│   │   ├── Header.astro            # Navbar + theme toggle
│   │   ├── Notice.astro            # Alert boxes
│   │   ├── ReadingProgress.astro   # Progress bar
│   │   ├── ScrollToTop.astro       # Scroll button
│   │   ├── Search.tsx              # Pagefind UI (React)
│   │   ├── Sidebar.astro           # Category navigation
│   │   └── TableOfContents.astro   # TOC with scroll spy
│   │
│   ├── content/
│   │   ├── blog/                   # ⚠️ Named 'blog' not 'posts'
│   │   │   ├── 9oormthon_challenge/
│   │   │   ├── algorithm/
│   │   │   ├── boj/
│   │   │   ├── cpp/
│   │   │   ├── dl/
│   │   │   ├── docker/
│   │   │   ├── javascript/
│   │   │   ├── leetcode/
│   │   │   ├── os/
│   │   │   ├── programmers/
│   │   │   ├── python/
│   │   │   ├── retrospective/
│   │   │   ├── review/
│   │   │   └── web_fundamentals/
│   │   └── content.config.ts       # Schema definition
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro        # Root layout
│   │   └── PostLayout.astro        # Blog post template
│   │
│   ├── pages/                      # File-based routing
│   │   ├── index.astro             # Homepage
│   │   ├── [...slug].astro         # Blog post pages
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── tags.astro
│   │   ├── rss.xml.ts
│   │   ├── category/
│   │   │   └── [category].astro
│   │   ├── posts/
│   │   │   └── [...page].astro     # Paginated list
│   │   └── tags/
│   │       └── [tag].astro
│   │
│   ├── styles/
│   │   ├── design-tokens.css       # CSS variables (colors, spacing)
│   │   └── global.css              # Base styles + Tailwind
│   │
│   ├── utils/
│   │   ├── formatDate.ts           # Korean date formatting
│   │   ├── navigation.ts           # Prev/next post logic
│   │   └── readingTime.ts          # KO: 300chars/min, EN: 200words/min
│   │
│   ├── lib/
│   │   └── utils.ts                # cn() helper (clsx + tw-merge)
│   │
│   ├── constants.ts                # Site config, categories
│   ├── content.config.ts           # ⚠️ Defines 'blog' collection
│   └── env.d.ts
│
├── tests/
│   └── seo-verification.spec.ts
│
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── components.json                 # shadcn/ui config
├── package.json
└── pnpm-lock.yaml
```

### Key Differences from Initial Plan

❌ **Not implemented / Changed:**
- No `src/components/layout/` directory (components are flat)
- No `src/components/post/` directory
- No separate `ThemeToggle.tsx` (integrated in Header.astro)
- No `Footer.astro` component
- Collection is named `blog` not `posts`
- Content uses `categories` (array) not `subject` (string)

✅ **Actually implemented:**
- Collapsible sidebar with GitHub avatar
- Reading progress bar
- Scroll-to-top button
- Pagefind search (production only)
- Giscus comments
- Category grouping system

---

## Key Conventions

### 1. Content Collection: Always Use `blog`

```typescript
// ✅ CORRECT
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');

// ❌ WRONG
const posts = await getCollection('posts'); // Will error!
```

**Schema** (from `src/content.config.ts`):
```typescript
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1).max(100),
    excerpt: z.string().min(10).max(200),
    date: z.coerce.date(),
    categories: z.array(z.string()).min(1),  // ⚠️ Array, not string
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    toc: z.boolean().default(true),
    // ... more fields
  }),
});

export const collections = { blog }; // ← Name is 'blog'
```

### 2. Category System

**Categories are folder names**:
```
src/content/blog/
├── algorithm/
├── boj/
├── docker/
└── javascript/
```

**Label mapping** (`src/constants.ts`):
```typescript
export const CATEGORY_LABELS: Record<string, string> = {
  'algorithm': 'Algorithm',
  'boj': 'BOJ',
  'cpp': 'C++',
  'docker': 'Docker',
  'javascript': 'JavaScript',
  // ...
};
```

**Grouping** (optional):
```typescript
export const CATEGORY_GROUPS: Record<string, string[]> = {
  'programming': ['cpp', 'python', 'javascript'],
  'algorithm': ['algorithm', 'boj', 'leetcode', 'programmers'],
  // ...
};
```

### 3. Routing Patterns

| URL | File | Description |
|-----|------|-------------|
| `/` | `pages/index.astro` | Homepage (6 recent posts) |
| `/posts` | `pages/posts/[...page].astro` | All posts (paginated) |
| `/docker/my-post` | `pages/[...slug].astro` | Individual post |
| `/category/docker` | `pages/category/[category].astro` | Category archive |
| `/tags/typescript` | `pages/tags/[tag].astro` | Tag archive |
| `/tags` | `pages/tags.astro` | All tags list |
| `/about` | `pages/about.astro` | About page |

### 4. Import Alias

```typescript
// ✅ Always use @ alias
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/constants';
import BaseLayout from '@/layouts/BaseLayout.astro';

// ❌ Avoid relative imports
import { Button } from '../../../components/ui/button';
```

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 5. Client Directives

**Rule**: Only hydrate interactive components.

```astro
<!-- ✅ Needs interactivity -->
<Search client:load />

<!-- ✅ Can wait -->
<GiscusComments client:idle />

<!-- ✅ Conditional hydration -->
<TableOfContents client:media="(min-width: 1024px)" />

<!-- ❌ Unnecessary (static) -->
<Header client:load />  <!-- Header is static! -->
```

---

## Development Workflows

### Daily Commands

```bash
# Install dependencies
pnpm install

# Dev server (http://localhost:4321)
pnpm dev

# Type check
pnpm type-check  # or: astro check

# Production build
pnpm build
# → Runs: astro check && astro build && pagefind --site dist

# Preview build
pnpm preview
```

### Creating a Blog Post

1. **Choose category folder** (or create new):
```bash
# Use existing
src/content/blog/docker/

# Or create new
mkdir src/content/blog/kubernetes
```

2. **Create MDX file**:
```mdx
---
# src/content/blog/docker/docker-basics.mdx
title: 'Docker 기초 완벽 가이드'
excerpt: 'Docker 컨테이너의 기본 개념과 사용법'
date: 2025-11-15
categories: ['docker']
tags: ['docker', 'devops', 'container']
draft: false
toc: true
---

## 소개

Docker는 컨테이너 기반 가상화 플랫폼입니다...

```javascript
// Dockerfile example
FROM node:18-alpine
WORKDIR /app
```
```

3. **Test locally**:
```bash
pnpm dev
# Visit: http://localhost:4321/docker/docker-basics
```

4. **Build** (includes Pagefind indexing):
```bash
pnpm build
```

### Adding shadcn/ui Components

```bash
# List available components
npx shadcn@latest add

# Add specific component
npx shadcn@latest add dialog
# Creates: src/components/ui/dialog.tsx

# Use in Astro
---
import { Dialog, DialogContent } from '@/components/ui/dialog';
---

<Dialog client:load>
  <DialogContent>Hello</DialogContent>
</Dialog>
```

### Deployment

**Automatic** (via GitHub Actions):
1. Push to `main` branch
2. `.github/workflows/deploy.yml` triggers
3. Runs `pnpm build`
4. Deploys to GitHub Pages

**Manual**:
```bash
pnpm build
# Upload dist/ to server
```

---

## Component Architecture

### Layout Hierarchy

```
BaseLayout.astro
├── <head> (FOUC prevention, fonts, analytics)
├── Sidebar.astro (fixed left, 256px width)
└── <div class="main-wrapper">
    ├── Header.astro (fixed top, 64px height)
    └── <main class="content">
        └── <slot /> (page content)
            ├── PostLayout.astro (for blog posts)
            │   ├── ReadingProgress.astro
            │   ├── <article> (MDX content)
            │   ├── TableOfContents.astro
            │   ├── GiscusComments.astro
            │   └── ScrollToTop.astro
            └── Other pages
```

### Core Components

#### Header.astro

**Purpose**: Site navigation + theme toggle + search
**Location**: `src/components/Header.astro`

**Features**:
- Logo/title
- Navigation links (Home, Blog, Tags, About)
- Search button (opens `<Search />`)
- Inline theme toggle (NOT separate component)

**Theme Toggle Implementation**:
```astro
<button id="theme-toggle" class="theme-toggle">
  <svg class="theme-icon theme-icon-light">...</svg>
  <svg class="theme-icon theme-icon-dark">...</svg>
</button>

<script is:inline>
  // Theme toggle logic (runs every page navigation)
  const button = document.getElementById('theme-toggle');
  // ...
</script>
```

#### Sidebar.astro

**Purpose**: Category navigation + recent posts
**Location**: `src/components/Sidebar.astro`

**Sections**:
1. Profile (GitHub avatar, bio, link)
2. Recent Posts (5 latest)
3. Categories (grouped, collapsible)

**Key Data**:
```astro
---
import { getCollection } from 'astro:content';
import { CATEGORY_LABELS } from '@/constants';

const allPosts = await getCollection('blog', ({ data }) => !data.draft);
const recentPosts = allPosts
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 5);
---
```

#### Search.tsx

**Purpose**: Pagefind search UI
**Location**: `src/components/Search.tsx`
**Type**: React component (client-side)

**Important**: Only works in production builds!

```tsx
export const Search = () => {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    new window.PagefindUI({
      element: searchRef.current,
      showSubResults: true,
    });
  }, []);

  return <div ref={searchRef} />;
};
```

**Usage**:
```astro
<Search client:load />
```

#### TableOfContents.astro

**Purpose**: Sticky TOC with scroll spy
**Location**: `src/components/TableOfContents.astro`

**Features**:
- Auto-generated from MDX headings
- Highlights current section (Intersection Observer)
- Smooth scroll

**Note**: Uses Astro component, NOT React (different from initial plan).

#### ReadingProgress.astro

**Purpose**: Reading progress bar at top
**Location**: `src/components/ReadingProgress.astro`

**Positioning**:
- Respects sidebar width (`left: var(--layout-sidebar-width)`)
- Fixed at top (`top: 0`)
- Updates on scroll

---

## Content Management

### Frontmatter Fields

**Required**:
```yaml
title: string                # 1-100 chars
excerpt: string              # 10-200 chars (meta description)
date: YYYY-MM-DD            # Publication date
categories: [string]         # ⚠️ Array (e.g., ['docker'])
tags: [string]              # Optional
```

**Optional**:
```yaml
draft: boolean              # Default: false
toc: boolean                # Default: true
tocDepth: 1-6              # Default: 3
featured: boolean           # Default: false
updatedDate: YYYY-MM-DD    # For updated posts
description: string         # SEO (max 160 chars)
ogImage: URL               # Open Graph image
lang: 'ko' | 'en'          # Default: 'ko'
author: string              # Default: 'Tolerblanc'
series:                     # For multi-part series
  name: string
  order: number
```

### Reading Time Calculation

**Auto-calculated** from `post.body`:

```typescript
// src/utils/readingTime.ts
export function calculateReadingTime(content: string): string {
  const koreanChars = (content.match(/[가-힣]/g) || []).length;
  const englishWords = (content.match(/\b[a-zA-Z]+\b/g) || []).length;

  const koreanMinutes = koreanChars / 300;  // 300 chars/min
  const englishMinutes = englishWords / 200; // 200 words/min

  const totalMinutes = Math.ceil(koreanMinutes + englishMinutes);
  return `${totalMinutes}분`;
}
```

**Usage**:
```astro
---
import { calculateReadingTime } from '@/utils/readingTime';

const posts = allPosts.map(post => ({
  ...post,
  readingTime: calculateReadingTime(post.body), // ← Pass body!
}));
---
```

### Filter Drafts

```typescript
// ✅ Always filter drafts in production
const publishedPosts = await getCollection('blog', ({ data }) => !data.draft);

// ❌ Don't expose drafts
const allPosts = await getCollection('blog'); // Includes drafts!
```

---

## Styling System

### Design Tokens

**File**: `src/styles/design-tokens.css`

**Structure**:
```css
:root {
  /* Colors */
  --color-bg-primary: #ffffff;
  --color-text-primary: #191f28;
  --color-accent-primary: #3182f6;

  /* Typography */
  --font-family-base: 'Pretendard Variable', ...;
  --font-size-base: 1rem;
  --line-height-normal: 1.5;

  /* Spacing (4px scale) */
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-12: 3rem;     /* 48px */

  /* Layout */
  --layout-sidebar-width: 256px;
  --layout-header-height: 64px;
  --layout-content-width: 800px;
}

.dark {
  --color-bg-primary: #191f28;
  --color-text-primary: #f8f9fa;
  /* ... */
}
```

### Tailwind + shadcn/ui

**Dual system**: Custom tokens + shadcn HSL colors

```javascript
// tailwind.config.mjs
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // shadcn/ui (HSL)
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ...
      },
      maxWidth: {
        content: '42rem',  // 672px (actual: 800px in tokens)
        wide: '64rem',
        full: '80rem',
      },
    },
  },
};
```

### Dark Mode Implementation

**1. FOUC Prevention** (`BaseLayout.astro`):
```html
<script is:inline>
  (function() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

**2. Toggle** (`Header.astro`):
```javascript
const button = document.getElementById('theme-toggle');
button?.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
```

**3. Smooth Transition**:
```css
html.theme-transitioning * {
  transition: background-color 0.2s ease,
              color 0.2s ease !important;
}
```

---

## AI Assistant Guidelines

### ✅ DO

1. **Use correct collection name**:
   ```typescript
   const posts = await getCollection('blog'); // ✅
   ```

2. **Filter drafts**:
   ```typescript
   const posts = await getCollection('blog', ({ data }) => !data.draft); // ✅
   ```

3. **Use categories as array**:
   ```typescript
   const category = post.data.categories[0]; // ✅
   ```

4. **Respect file structure**:
   - Blog posts: `src/content/blog/{category}/`
   - Components: `src/components/` (flat, no subdirs)
   - Layouts: `src/layouts/`

5. **Use pnpm**:
   ```bash
   pnpm install  # ✅
   npm install   # ❌
   ```

6. **Use design tokens**:
   ```css
   padding: var(--spacing-4);  # ✅
   padding: 1rem;              # ❌ (hard-coded)
   ```

7. **Minimize client JS**:
   - Only add `client:*` when absolutely necessary
   - Prefer Astro components

8. **Run type checks**:
   ```bash
   pnpm type-check
   ```

### ❌ DON'T

1. **Don't use `posts` collection**:
   ```typescript
   const posts = await getCollection('posts'); // ❌ Error!
   ```

2. **Don't use `subject` field**:
   ```typescript
   const cat = post.data.subject; // ❌ Doesn't exist
   ```

3. **Don't expect theme toggle component**:
   ```astro
   <ThemeToggle client:load />  # ❌ Doesn't exist
   ```

4. **Don't test search in dev mode**:
   - Pagefind only works after `pnpm build`

5. **Don't add inline styles**:
   ```html
   <div style="padding: 1rem">  # ❌ Use Tailwind/tokens
   ```

6. **Don't ignore sidebar width**:
   - Always account for 256px sidebar on desktop

### Common Mistakes

#### Mistake 1: Wrong Collection Name
```typescript
// ❌ Error: Collection 'posts' does not exist
const posts = await getCollection('posts');

// ✅ Correct
const posts = await getCollection('blog');
```

#### Mistake 2: Using `subject` Instead of `categories`
```typescript
// ❌ Field doesn't exist
const category = post.data.subject;

// ✅ Correct
const category = post.data.categories[0];
```

#### Mistake 3: Forgetting to Filter Drafts
```typescript
// ❌ Shows drafts to users
const posts = await getCollection('blog');

// ✅ Only published
const posts = await getCollection('blog', ({ data }) => !data.draft);
```

#### Mistake 4: Missing Post Body for Reading Time
```typescript
// ❌ Will show "1분" for all posts
const readingTime = calculateReadingTime('');

// ✅ Pass actual content
const readingTime = calculateReadingTime(post.body);
```

---

## Common Tasks & Recipes

### 1. Add New Category

```bash
# 1. Create folder
mkdir src/content/blog/new-category

# 2. Add label to constants.ts
```
```typescript
// src/constants.ts
export const CATEGORY_LABELS = {
  // ...existing
  'new-category': 'New Category',
};
```

```bash
# 3. Create first post
touch src/content/blog/new-category/first-post.mdx
```

### 2. Change Posts Per Page

```typescript
// src/constants.ts
export const PAGE_CONFIG = {
  POSTS_PER_PAGE: 20,  // Change from 10
};
```

### 3. Customize Theme Colors

```css
/* src/styles/design-tokens.css */
:root {
  --color-accent-primary: #ff6b6b;  /* New brand color */
}

.dark {
  --color-accent-primary: #ff8787;  /* Dark mode version */
}
```

### 4. Add New Page

```astro
<!-- src/pages/resources.astro -->
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="Resources">
  <h1>Learning Resources</h1>
  <!-- Content -->
</BaseLayout>
```

```astro
<!-- Add to Header.astro navigation -->
---
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Blog' },
  { href: '/tags', label: 'Tags' },
  { href: '/resources', label: 'Resources' },  // ← Add here
  { href: '/about', label: 'About' },
];
---
```

### 5. Embed React Component in MDX

```mdx
---
title: 'Interactive Demo'
---

import { Button } from '@/components/ui/button';

## Try It

<Button client:load onClick={() => alert('Clicked!')}>
  Click Me
</Button>
```

---

## Troubleshooting

### Issue: "Collection 'posts' does not exist"

**Cause**: Using wrong collection name.
**Fix**: Change to `'blog'`:
```typescript
const posts = await getCollection('blog');
```

### Issue: Pagefind 404 in Dev Mode

**Cause**: Pagefind index only generated during build.
**Fix**: Run production preview:
```bash
pnpm build
pnpm preview
```

### Issue: Dark Mode Doesn't Persist

**Cause**: FOUC script missing or not inline.
**Fix**: Ensure `BaseLayout.astro` has:
```html
<script is:inline>
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
</script>
```

### Issue: TypeScript Errors

**Cause**: Missing type definitions.
**Fix**:
```bash
pnpm type-check
```

Check `src/env.d.ts` exists:
```typescript
/// <reference types="astro/client" />
```

### Issue: Reading Time Shows "1분" for All Posts

**Cause**: Not passing `post.body`.
**Fix**:
```typescript
const posts = allPosts.map(post => ({
  ...post,
  readingTime: calculateReadingTime(post.body),  // ← Pass body
}));
```

### Issue: Build Fails with pnpm Error

**Cause**: Using npm instead of pnpm.
**Fix**: Always use pnpm:
```bash
pnpm install
pnpm build
```

---

## Performance Checklist

- [ ] **Build Time**: <5s for 56 posts (currently 4.37s ✅)
- [ ] **TypeScript**: 0 errors (✅)
- [ ] **Image Optimization**: Use `<Image>` from `astro:assets`
- [ ] **JavaScript Bundle**: <50KB main bundle
- [ ] **Pagefind Index**: Auto-generated
- [ ] **Dark Mode**: FOUC-free (✅)
- [ ] **Lighthouse**: Target 95+ (all categories)

---

## Additional Resources

### Project Documentation

- **Migration Report**: `docs/MIGRATION_COMPLETED.md`
- **Component Guide**: `docs/COMPONENTS.md`
- **shadcn/ui Status**: `docs/SHADCN_UI_STATUS.md`

### External Resources

- [Astro Docs](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [Pagefind](https://pagefind.app/)

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-15 | 3.0 | Comprehensive AI guide with accurate structure |
| 2025-11-09 | 2.0 | Migration completed from Jekyll |
| 2025-11-01 | 1.0 | Migration started |

---

**End of CLAUDE.md**

*This document is specifically designed to help AI assistants work effectively with this codebase. For human-readable migration history, see `docs/MIGRATION_COMPLETED.md`.*
