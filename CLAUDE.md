# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean tech blog built with Astro 5, React 18, Tailwind CSS, and MDX. Uses islands architecture for minimal JavaScript with selective React hydration. Deployed to GitHub Pages via GitHub Actions.

## Commands

```bash
pnpm dev          # Start dev server (localhost:4321)
pnpm build        # TypeScript check + Astro build + Pagefind indexing
pnpm type-check   # Run astro check for TypeScript validation
pnpm preview      # Preview production build locally
```

Testing with Playwright:
```bash
pnpm exec playwright test                    # Run all tests
pnpm exec playwright test tests/seo-verification.spec.ts  # Run specific test
```

## Architecture

### Content System
- **Content Collections**: MDX files in `src/content/blog/[category]/[slug].mdx`
- **Schema**: Defined in `src/content.config.ts` with Zod validation
- **Reading Time**: Korean (300 chars/min) and English (200 words/min) calculated separately in `src/utils/readingTime.ts`

### Component Patterns
- **Astro components** (`.astro`): Static content, layouts, server-rendered features
- **React components** (`.tsx`): Interactive features requiring client-side JS, hydrated with `client:load`
- **MDX components**: Auto-imported in posts (Notice, Toggle, FileTree, Tabs, Steps, Figure, LinkCard)

### Key Files
- `src/constants.ts`: Site config, GA ID, Giscus settings, category definitions
- `src/styles/design-tokens.css`: CSS variables for theming (colors, typography, spacing)
- `src/lib/utils.ts`: shadcn/ui utility (`cn()` for Tailwind class merging)

### Styling
- Tailwind CSS with CSS variables from design-tokens.css
- Dark mode: class-based strategy (add `dark` class to `<html>`)
- shadcn/ui components in `src/components/ui/`

### Path Aliases (tsconfig.json)
```
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@utils/*      → src/utils/*
@content/*    → src/content/*
```

## Blog Post Frontmatter

Required fields:
```yaml
---
title: string (max 100 chars)
excerpt: string (10-200 chars)
date: YYYY-MM-DDTHH:mm:ss.000Z
categories: [string]  # Must have at least one
---
```

Optional fields: `tags`, `description` (max 160), `draft`, `toc`, `tocDepth`, `lang` (ko/en), `series: { name, order }`

## Category Structure

Categories organized in groups (defined in `src/constants.ts`):
- **programming**: cpp, python, javascript
- **algorithm**: algorithm, boj, leetcode, programmers
- **web**: web_fundamentals, graphics
- **learning**: 9oormthon_challenge, 혼공학습단, retrospective, review
- **ai**: dl
- **system**: os, unix, docker

## Key Integrations

- **Pagefind**: Static search indexed at build time
- **Giscus**: GitHub Discussions-powered comments (config in constants.ts)
- **KaTeX**: Math rendering via remark-math + rehype-katex
- **Shiki**: Code highlighting with github-light/github-dark themes
