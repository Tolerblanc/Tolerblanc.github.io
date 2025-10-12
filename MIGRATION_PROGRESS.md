# Jekyll → Astro 마이그레이션 진행 상황

> **최종 업데이트**: 2025-10-12
> **현재 브랜치**: `astro-experimental`
> **Phase**: 1 완료 (Astro 5.14.4 업그레이드 포함), Phase 2 준비 중
> **Astro 버전**: 5.14.4 (Content Layer, Vite 6 포함)

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [마이그레이션 전략](#마이그레이션-전략)
3. [완료된 작업 (Phase 1)](#완료된-작업-phase-1)
4. [다음 작업 계획 (Phase 2-5)](#다음-작업-계획-phase-2-5)
5. [기술 스택 비교](#기술-스택-비교)
6. [핵심 요구사항](#핵심-요구사항)
7. [파일 구조 매핑](#파일-구조-매핑)
8. [배포 전략](#배포-전략)

---

## 프로젝트 개요

### 현재 상태
- **사이트**: https://tolerblanc.github.io
- **포스트 수**: 75개 이상의 한국어 기술 문서
- **테마**: minimal-mistakes-jekyll v4.24.0
- **빌드 도구**: Jekyll (Ruby 기반)
- **트래픽**: 상당량의 유기적 트래픽 (SEO 유지 필수)

### 마이그레이션 목표
1. **Ruby 의존성 제거** - JavaScript/TypeScript 생태계로 전환
2. **개발 경험 개선** - 더 빠른 빌드, 핫 리로드, 타입 안정성
3. **확장성 강화** - MDX로 커스텀 컴포넌트 구현
4. **SEO 100% 보존** - URL, 메타데이터, Analytics 유지
5. **실험적 접근** - 별도 브랜치에서 검증 후 점진적 전환

---

## 마이그레이션 전략

### 원칙
- **안전성 우선**: 메인 사이트는 계속 운영하며 실험 브랜치에서 작업
- **SEO 보존**: 모든 URL, 메타데이터, Analytics 설정 유지
- **점진적 전환**: `/experimental` 경로로 배포하여 A/B 테스트
- **독립적 커밋**: 각 기능은 별도 커밋으로 관리하여 롤백 가능

### 단계별 계획

#### Phase 1: 기초 인프라 구축 ✅ **완료**
- [x] Astro 프로젝트 초기화
- [x] TypeScript 및 린터 설정
- [x] 디렉토리 구조 생성
- [x] GitHub Actions 워크플로우 설정
- [x] **Astro 5.14.4 업그레이드** (2025-10-12 추가)
  - Astro 4.16.0 → 5.14.4
  - @astrojs/mdx 3.0.0 → 4.3.7
  - @astrojs/react 3.0.0 → 4.4.0
  - Content Layer API 적용
  - Vite 6.0 적용

#### Phase 2: 콘텐츠 마이그레이션 도구 🔄 **다음 단계**
- [ ] Jekyll → MDX 변환 스크립트 작성
- [ ] frontmatter 매핑 유틸리티
- [ ] 샘플 포스트 변환 및 검증
- [ ] 이미지 경로 변환 로직

#### Phase 3: 핵심 기능 구현
- [ ] 레이아웃 컴포넌트 (BaseLayout, PostLayout)
- [ ] SEO 메타데이터 시스템
- [ ] Google Analytics 통합 (G-JWJT3DQR8G)
- [ ] Giscus 댓글 통합
- [ ] RSS/Sitemap 생성

#### Phase 4: UI 컴포넌트 및 디자인
- [ ] Notice 컴포넌트 (info, warning, danger)
- [ ] 코드 하이라이팅 (Shiki/Prism)
- [ ] TOC (목차) 컴포넌트
- [ ] 카테고리/태그 네비게이션
- [ ] 다크 테마 구현
- [ ] 검색 기능 (Algolia/Fuse.js)

#### Phase 5: 최적화 및 검증
- [ ] 이미지 최적화 (@astrojs/image)
- [ ] 한글 폰트 최적화 (subset, preload)
- [ ] 성능 테스트 및 벤치마크
- [ ] SEO 검증 (Lighthouse, 메타태그)
- [ ] 링크 무결성 검사
- [ ] 접근성 테스트 (WCAG)

---

## 완료된 작업 (Phase 1)

### 1. 브랜치 및 프로젝트 초기화

**생성된 브랜치**: `astro-experimental`

```bash
git checkout -b astro-experimental
```

### 2. 패키지 관리 및 의존성

**파일**: `package.json`

```json
{
  "name": "tolerblanc-blog",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "type-check": "astro check",
    "jekyll:dev": "bundle exec jekyll serve",
    "jekyll:build": "bundle exec jekyll build"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.0",
    "@astrojs/mdx": "^3.0.0",
    "@astrojs/react": "^3.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "astro": "^4.16.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "sharp": "^0.33.0"
  }
}
```

**주요 특징**:
- pnpm 사용 (더 빠른 의존성 관리)
- Jekyll 명령어 보존 (하위 호환성)
- ESM 모듈 시스템 사용

### 3. TypeScript 설정

**파일**: `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    ".astro",
    "_site",
    "_posts",
    "assets",
    "banner.js"
  ],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"],
      "@content/*": ["src/content/*"]
    }
  }
}
```

**주요 특징**:
- Strict 모드 활성화
- Path aliases 설정 (import 경로 단축)
- Jekyll 파일 제외 (타입 체크 충돌 방지)

### 4. Astro 설정

**파일**: `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tolerblanc.github.io',
  base: '/experimental',
  integrations: [
    mdx(),
    react(),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true
    }
  },
  vite: {
    optimizeDeps: {
      exclude: ['sharp']
    }
  }
});
```

**주요 특징**:
- `/experimental` base path (메인 사이트와 격리)
- MDX, React, Sitemap 통합
- Shiki 코드 하이라이팅 (dark-plus 테마)

### 5. 디렉토리 구조

```
src/
├── components/       # 재사용 가능한 React/Astro 컴포넌트
├── layouts/          # 페이지 레이아웃 템플릿
├── pages/            # 파일 기반 라우팅
│   └── index.astro   # 랜딩 페이지
├── content/
│   └── blog/         # 블로그 포스트 (MDX)
├── styles/           # 글로벌 스타일
└── utils/            # 유틸리티 함수
```

### 6. GitHub Actions 워크플로우

**파일**: `.github/workflows/deploy-experimental.yml`

```yaml
name: Deploy Experimental Astro Site

on:
  push:
    branches: [astro-experimental]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: astro-dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: main
      - uses: actions/download-artifact@v4
        with:
          name: astro-dist
          path: experimental/
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./experimental
          destination_dir: experimental
```

**주요 특징**:
- 자동 배포 (`astro-experimental` 브랜치 푸시 시)
- pnpm 캐싱으로 빌드 속도 향상
- Artifact 기반 빌드/배포 분리
- `/experimental` 경로로 격리 배포

### 7. 초기 랜딩 페이지

**파일**: `src/pages/index.astro`

마이그레이션 진행 상황을 보여주는 간단한 페이지:
- 프로젝트 소개
- 진행 상황 체크리스트
- 메인 사이트 링크

### 8. 커밋 히스토리

```
311197f chore: Add GitHub Actions workflow for experimental deployment
527cfdb feat: Initialize Astro project for experimental migration
```

---

## 다음 작업 계획 (Phase 2-5)

### Phase 2: 콘텐츠 마이그레이션 도구 (우선순위 높음)

#### 2.1 Jekyll → MDX 변환 스크립트

**목적**: 75개 이상의 포스트를 자동 변환

**변환 로직**:
```javascript
// src/utils/jekyll-to-mdx.js (예정)
// 1. frontmatter 파싱 및 변환
//    - date, title, categories, tags, excerpt 추출
//    - Astro Content Collection 형식으로 변환
// 2. 본문 변환
//    - Liquid 구문 제거/변환
//    - 이미지 경로 수정
//    - Notice 블록 → MDX 컴포넌트
// 3. 파일명 변환
//    - YYYY-MM-DD-title.md → title.mdx
//    - 카테고리 기반 디렉토리 구조 유지
```

**입력 예시** (`_posts/Web/NestJS/2025-03-15-nestjs-dematerializer-4.md`):
```markdown
---
title: "NestJS 해체분석기 4편"
excerpt: "NestJS 실행 파이프라인 심층 분석"
categories:
  - Web
  - NestJS
tags:
  - TypeScript
  - Backend
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그입니다.
</div>

## 개요
NestJS의 실행 파이프라인을 분석합니다...
```

**출력 예시** (`src/content/blog/web/nestjs/nestjs-dematerializer-4.mdx`):
```mdx
---
title: "NestJS 해체분석기 4편"
description: "NestJS 실행 파이프라인 심층 분석"
pubDate: 2025-03-15
categories: ["Web", "NestJS"]
tags: ["TypeScript", "Backend"]
---

import Notice from '@components/Notice.astro';

<Notice type="info">
👨‍💻 개인 공부 기록용 블로그입니다.
</Notice>

## 개요
NestJS의 실행 파이프라인을 분석합니다...
```

#### 2.2 Content Collections 설정

**파일**: `src/content/config.ts` (생성 예정)

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

#### 2.3 샘플 변환 및 검증

1. 대표 포스트 3-5개 수동 변환
2. 변환 스크립트 실행 및 결과 비교
3. 렌더링 테스트 (이미지, 코드블록, 링크)
4. 전체 포스트 배치 변환

---

### Phase 3: 핵심 기능 구현

#### 3.1 레이아웃 시스템

**BaseLayout.astro** (기본 레이아웃):
```astro
---
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-JWJT3DQR8G"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-JWJT3DQR8G');
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

**PostLayout.astro** (포스트 레이아웃):
```astro
---
import BaseLayout from './BaseLayout.astro';
import Giscus from '@components/Giscus.astro';

interface Props {
  frontmatter: {
    title: string;
    description: string;
    pubDate: Date;
    categories: string[];
    tags: string[];
  }
}

const { frontmatter } = Astro.props;
---

<BaseLayout title={frontmatter.title} description={frontmatter.description}>
  <article>
    <header>
      <h1>{frontmatter.title}</h1>
      <time datetime={frontmatter.pubDate.toISOString()}>
        {frontmatter.pubDate.toLocaleDateString('ko-KR')}
      </time>
    </header>

    <div class="content">
      <slot />
    </div>

    <Giscus />
  </article>
</BaseLayout>
```

#### 3.2 Google Analytics 통합

**현재 설정 (유지 필수)**:
- Tracking ID: `G-JWJT3DQR8G`
- 페이지뷰 자동 추적
- 이벤트 추적 (선택적)

**구현 방법**:
1. BaseLayout에 스크립트 추가 (위 예시 참조)
2. 환경 변수로 ID 관리 (`PUBLIC_GA_ID`)
3. 개발 환경에서는 비활성화

#### 3.3 Giscus 댓글 시스템

**현재 설정 (유지 필수)**:
```javascript
{
  repo: "Tolerblanc/Tolerblanc.github.io",
  repoId: "R_kgDOJ01EaQ",
  category: "Announcements",
  categoryId: "DIC_kwDOJ01Eac4Cerab",
  theme: "dark_dimmed",
  lang: "ko"
}
```

**컴포넌트**: `src/components/Giscus.astro` (생성 예정)

```astro
---
// Giscus 설정은 환경 변수나 config에서 가져오기
---

<div class="giscus-wrapper">
  <script
    src="https://giscus.app/client.js"
    data-repo="Tolerblanc/Tolerblanc.github.io"
    data-repo-id="R_kgDOJ01EaQ"
    data-category="Announcements"
    data-category-id="DIC_kwDOJ01Eac4Cerab"
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="bottom"
    data-theme="dark_dimmed"
    data-lang="ko"
    crossorigin="anonymous"
    async>
  </script>
</div>
```

#### 3.4 RSS 및 Sitemap

**RSS 피드** (`src/pages/rss.xml.ts` 생성 예정):
```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: "인생은 B와 D사이 Code다",
    description: "Tolerblanc의 기술 블로그",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

**Sitemap**: `@astrojs/sitemap` 통합으로 자동 생성됨 ✅

---

### Phase 4: UI 컴포넌트 및 디자인

#### 4.1 Notice 컴포넌트

**현재 Jekyll 구문**:
```html
<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그입니다.
</div>
```

**목표 MDX 구문**:
```mdx
<Notice type="info">
👨‍💻 개인 공부 기록용 블로그입니다.
</Notice>
```

**컴포넌트**: `src/components/Notice.astro` (생성 예정)

```astro
---
interface Props {
  type?: 'info' | 'warning' | 'danger' | 'success';
}

const { type = 'info' } = Astro.props;
---

<div class={`notice notice--${type}`}>
  <slot />
</div>

<style>
  .notice {
    padding: 1rem;
    margin: 1.5rem 0;
    border-radius: 4px;
    border-left: 4px solid;
  }

  .notice--info {
    background-color: #e7f3ff;
    border-color: #2196f3;
  }

  .notice--warning {
    background-color: #fff3cd;
    border-color: #ffc107;
  }

  .notice--danger {
    background-color: #f8d7da;
    border-color: #dc3545;
  }

  .notice--success {
    background-color: #d4edda;
    border-color: #28a745;
  }
</style>
```

#### 4.2 코드 하이라이팅

**현재**: Rouge (Ruby 기반)
**목표**: Shiki (이미 설정됨 ✅)

**추가 설정** (astro.config.mjs):
```javascript
markdown: {
  shikiConfig: {
    theme: 'dark-plus',
    wrap: true,
    langs: [
      'javascript', 'typescript', 'python', 'go',
      'rust', 'java', 'bash', 'json', 'yaml'
    ]
  }
}
```

#### 4.3 목차 (TOC) 컴포넌트

**컴포넌트**: `src/components/TableOfContents.astro` (생성 예정)

```astro
---
interface Props {
  headings: Array<{
    depth: number;
    slug: string;
    text: string;
  }>;
}

const { headings } = Astro.props;
---

<nav class="toc">
  <h2>목차</h2>
  <ul>
    {headings.map(heading => (
      <li class={`toc-level-${heading.depth}`}>
        <a href={`#${heading.slug}`}>{heading.text}</a>
      </li>
    ))}
  </ul>
</nav>

<style>
  .toc {
    position: sticky;
    top: 2rem;
    max-width: 250px;
  }

  .toc-level-2 { margin-left: 0; }
  .toc-level-3 { margin-left: 1rem; }
  .toc-level-4 { margin-left: 2rem; }
</style>
```

**사용 예시** (PostLayout.astro):
```astro
---
const { headings } = await Astro.props.frontmatter;
---

<div class="post-container">
  <TableOfContents headings={headings} />
  <article>
    <slot />
  </article>
</div>
```

#### 4.4 카테고리/태그 시스템

**페이지 생성**: `src/pages/categories/[category].astro` (예정)

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const categories = [...new Set(posts.flatMap(post => post.data.categories))];

  return categories.map(category => ({
    params: { category },
    props: {
      posts: posts.filter(post =>
        post.data.categories.includes(category)
      )
    }
  }));
}

const { category } = Astro.params;
const { posts } = Astro.props;
---

<BaseLayout title={`카테고리: ${category}`}>
  <h1>{category}</h1>
  <ul>
    {posts.map(post => (
      <li>
        <a href={`/blog/${post.slug}/`}>{post.data.title}</a>
      </li>
    ))}
  </ul>
</BaseLayout>
```

#### 4.5 검색 기능

**현재**: Lunr.js (Jekyll 플러그인)
**목표**: Algolia 또는 Fuse.js

**Option 1 - Algolia** (추천):
- 빠른 검색 속도
- 한글 형태소 분석 지원
- 무료 플랜 (10K requests/month)

**Option 2 - Fuse.js** (대안):
- 클라이언트 사이드 검색
- 외부 서비스 불필요
- 포스트 수가 많을 경우 성능 저하 가능

---

### Phase 5: 최적화 및 검증

#### 5.1 이미지 최적화

**설치**: `@astrojs/image` 또는 `astro-imagetools`

```bash
pnpm add @astrojs/image
```

**astro.config.mjs 업데이트**:
```javascript
import image from '@astrojs/image';

export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    })
  ]
});
```

**사용 예시**:
```astro
---
import { Image } from '@astrojs/image/components';
---

<Image
  src="/assets/images/hero.png"
  alt="Hero image"
  width={1200}
  height={600}
  format="webp"
  quality={80}
/>
```

#### 5.2 한글 폰트 최적화

**전략**:
1. **Subset 생성**: 사용 빈도 높은 한글 2,350자만 포함
2. **Preload**: 중요 폰트는 `<link rel="preload">`
3. **Font Display**: `font-display: swap` 사용
4. **Variable Fonts**: 가능한 경우 가변 폰트 사용

**구현 예시** (BaseLayout.astro):
```astro
<head>
  <!-- 한글 폰트 preload -->
  <link
    rel="preload"
    href="/fonts/PretendardVariable.subset.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</head>

<style is:global>
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/PretendardVariable.subset.woff2') format('woff2-variations');
    font-display: swap;
    font-weight: 100 900;
  }

  body {
    font-family: 'Pretendard', -apple-system, sans-serif;
  }
</style>
```

#### 5.3 성능 목표 및 벤치마크

**목표 메트릭**:
- **빌드 시간**: <30초 (75개 포스트)
- **핫 리로드**: <3초
- **Lighthouse 점수**: 95+ (모든 카테고리)
- **번들 크기**: <500KB (초기 로드)
- **FCP**: <1.5s
- **LCP**: <2.5s
- **CLS**: <0.1

**측정 도구**:
- Lighthouse CI
- WebPageTest
- Chrome DevTools Performance

#### 5.4 SEO 검증 체크리스트

**URL 구조** (필수):
- [ ] 모든 기존 URL이 동일한 패턴 유지
- [ ] `/:categories/:title/` 형식 보존
- [ ] 리다이렉트 없이 직접 접근 가능

**메타데이터**:
- [ ] `<title>` 태그 (각 페이지 고유)
- [ ] `<meta name="description">`
- [ ] Open Graph 태그 (`og:title`, `og:description`, `og:image`)
- [ ] Twitter Card 태그
- [ ] Canonical URL (`<link rel="canonical">`)

**구조화된 데이터**:
- [ ] BlogPosting Schema.org 마크업
- [ ] BreadcrumbList
- [ ] Article 메타데이터

**기술적 SEO**:
- [ ] Sitemap 생성 및 검증
- [ ] robots.txt 설정
- [ ] RSS 피드 생성
- [ ] 404 페이지

#### 5.5 링크 무결성 검사

**도구**: `linkinator` 또는 `broken-link-checker`

```bash
pnpm add -D linkinator

# package.json
{
  "scripts": {
    "check-links": "linkinator dist/ --recurse --silent --skip '^https?://localhost'"
  }
}
```

**자동화**: GitHub Actions에 추가

```yaml
- name: Check for broken links
  run: |
    pnpm build
    pnpm check-links
```

#### 5.6 접근성 테스트

**도구**:
- axe DevTools
- Lighthouse Accessibility
- WAVE

**체크리스트**:
- [ ] 시맨틱 HTML 사용
- [ ] ARIA 레이블 적절히 사용
- [ ] 키보드 네비게이션 가능
- [ ] 색상 대비 충분 (WCAG AA 이상)
- [ ] 이미지 alt 텍스트
- [ ] 폼 레이블 연결

---

## 기술 스택 비교

| 항목 | Jekyll (현재) | Astro (목표) |
|------|--------------|-------------|
| **언어** | Ruby | JavaScript/TypeScript |
| **템플릿** | Liquid | Astro + JSX |
| **콘텐츠** | Markdown | MDX (Markdown + Components) |
| **스타일** | Sass | CSS + Sass (선택적) |
| **빌드 도구** | Jekyll | Vite |
| **패키지 관리** | Bundler (Gemfile) | pnpm (package.json) |
| **핫 리로드** | 느림 (~10s) | 빠름 (<3s) |
| **타입 안정성** | 없음 | TypeScript |
| **컴포넌트 재사용** | Includes (제한적) | React/Astro 컴포넌트 |
| **코드 하이라이팅** | Rouge | Shiki |
| **검색** | Lunr.js | Algolia/Fuse.js (예정) |

---

## 핵심 요구사항

### 1. SEO 보존 (최우선)

#### URL 구조 유지
```
현재: https://tolerblanc.github.io/web/nestjs/nestjs-dematerializer-4/
유지: https://tolerblanc.github.io/web/nestjs/nestjs-dematerializer-4/
```

**구현 방법**:
- Content Collections의 slug 활용
- 카테고리 기반 디렉토리 구조 유지
- `[...slug].astro` 동적 라우팅

**파일 매핑 예시**:
```
Jekyll: _posts/Web/NestJS/2025-03-15-nestjs-dematerializer-4.md
Astro:  src/content/blog/web/nestjs/nestjs-dematerializer-4.mdx
URL:    /web/nestjs/nestjs-dematerializer-4/
```

#### Google Analytics 연속성
- Tracking ID 동일: `G-JWJT3DQR8G`
- 페이지뷰 추적 형식 동일
- 이벤트 추적 구조 유지 (있는 경우)

#### Giscus 댓글 연속성
- pathname 기반 매핑 사용 중 (변경 불필요)
- 기존 댓글 자동 유지됨

### 2. 콘텐츠 무결성

#### 포스트 메타데이터 보존
- 발행일 (pubDate)
- 카테고리 (계층 구조 유지)
- 태그
- 제목 및 발췌문

#### 이미지 및 미디어
- 경로 변환 (Jekyll → Astro)
- 최적화 적용 (WebP 변환)
- Alt 텍스트 보존

#### 내부 링크
- 상대 경로 → 절대 경로 변환
- 링크 검증 필수

### 3. 성능 개선

**목표**:
- 빌드 시간: 현재 대비 50% 단축
- 페이지 로드: 현재 대비 30% 개선
- Lighthouse 점수: 95+ (현재: 측정 필요)

### 4. 개발자 경험

**개선 사항**:
- 타입 안정성 (TypeScript)
- 빠른 핫 리로드 (<3s)
- 컴포넌트 재사용
- 모던 개발 도구 (ESLint, Prettier)

---

## 파일 구조 매핑

### Jekyll 구조 (현재)
```
.
├── _config.yml                 # 사이트 설정
├── _data/                      # 데이터 파일
├── _includes/                  # 재사용 컴포넌트
├── _layouts/                   # 페이지 템플릿
│   ├── default.html
│   ├── single.html
│   └── archive.html
├── _posts/                     # 블로그 포스트
│   ├── Personal/
│   ├── PL/
│   ├── Web/
│   │   └── NestJS/
│   │       └── 2025-03-15-nestjs-dematerializer-4.md
│   ├── DevOps/
│   ├── CS/
│   └── Algorithm/
├── _sass/                      # 스타일시트
├── assets/                     # 정적 파일
│   ├── images/
│   └── js/
├── Gemfile                     # Ruby 의존성
└── _site/                      # 빌드 출력 (무시)
```

### Astro 구조 (목표)
```
.
├── astro.config.mjs            # Astro 설정
├── tsconfig.json               # TypeScript 설정
├── package.json                # npm 의존성
├── src/
│   ├── components/             # 재사용 컴포넌트
│   │   ├── Notice.astro
│   │   ├── Giscus.astro
│   │   ├── TableOfContents.astro
│   │   └── PostCard.astro
│   ├── layouts/                # 페이지 레이아웃
│   │   ├── BaseLayout.astro
│   │   ├── PostLayout.astro
│   │   └── ArchiveLayout.astro
│   ├── pages/                  # 라우팅
│   │   ├── index.astro
│   │   ├── blog/
│   │   │   └── [...slug].astro # 동적 라우팅
│   │   ├── categories/
│   │   │   └── [category].astro
│   │   ├── tags/
│   │   │   └── [tag].astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   ├── content/                # 콘텐츠 컬렉션
│   │   ├── config.ts
│   │   └── blog/
│   │       ├── personal/
│   │       ├── pl/
│   │       ├── web/
│   │       │   └── nestjs/
│   │       │       └── nestjs-dematerializer-4.mdx
│   │       ├── devops/
│   │       ├── cs/
│   │       └── algorithm/
│   ├── styles/                 # 글로벌 스타일
│   │   ├── global.css
│   │   └── markdown.css
│   └── utils/                  # 유틸리티 함수
│       ├── jekyll-to-mdx.js
│       ├── formatDate.ts
│       └── sortPosts.ts
├── public/                     # 정적 파일 (복사됨)
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── .github/
│   └── workflows/
│       └── deploy-experimental.yml
└── dist/                       # 빌드 출력 (무시)
```

### 파일 변환 매핑

| Jekyll | Astro | 변환 작업 |
|--------|-------|----------|
| `_posts/Web/NestJS/YYYY-MM-DD-title.md` | `src/content/blog/web/nestjs/title.mdx` | frontmatter 변환, Liquid → MDX |
| `_layouts/single.html` | `src/layouts/PostLayout.astro` | Liquid → Astro 구문 |
| `_includes/notice` | `src/components/Notice.astro` | 컴포넌트화 |
| `assets/images/*` | `public/images/*` | 경로 수정, 최적화 |
| `_config.yml` | `astro.config.mjs` | 설정 이전 |

---

## 배포 전략

### 현재 배포 (Jekyll)
```
main 브랜치 → GitHub Pages 자동 배포 → https://tolerblanc.github.io
```

### 실험 배포 (Astro)
```
astro-experimental 브랜치
  → GitHub Actions 빌드
  → gh-pages 브랜치의 /experimental 디렉토리에 배포
  → https://tolerblanc.github.io/experimental
```

### 최종 전환 시나리오

**옵션 1: 점진적 전환 (권장)**
```
1. /experimental에서 충분히 테스트
2. 메인 사이트에 "새 버전 체험하기" 링크 추가
3. 사용자 피드백 수집 (2-4주)
4. 문제 없으면 main 브랜치에 머지
5. Jekyll 파일 아카이브 브랜치로 이동
```

**옵션 2: 일시 전환**
```
1. /experimental 완성도 100% 확인
2. 유지보수 공지 게시
3. astro-experimental → main 병합
4. 즉시 전환
```

### 롤백 계획
- Jekyll 설정 백업 보관
- Gemfile 및 _config.yml 보존
- 문제 발생 시 이전 커밋으로 revert

---

## 환경 변수 관리

### 필요한 환경 변수

**개발 환경** (`.env`):
```env
# Google Analytics (개발 시 비활성화)
PUBLIC_GA_ID=G-JWJT3DQR8G
PUBLIC_GA_ENABLED=false

# Giscus
PUBLIC_GISCUS_REPO=Tolerblanc/Tolerblanc.github.io
PUBLIC_GISCUS_REPO_ID=R_kgDOJ01EaQ
PUBLIC_GISCUS_CATEGORY=Announcements
PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOJ01Eac4Cerab

# Site
PUBLIC_SITE_URL=https://tolerblanc.github.io
PUBLIC_BASE_PATH=/experimental
```

**프로덕션 환경** (GitHub Secrets):
```
GA_ID=G-JWJT3DQR8G
ALGOLIA_API_KEY=... (선택적)
```

---

## 테스트 전략

### 단위 테스트
- 유틸리티 함수 (formatDate, sortPosts)
- 변환 스크립트 (jekyll-to-mdx)

### 통합 테스트
- 페이지 렌더링
- 라우팅 동작
- Content Collections 쿼리

### E2E 테스트
- 주요 사용자 플로우
- 검색 기능
- 댓글 로딩

### 성능 테스트
- Lighthouse CI
- 빌드 시간 측정
- 번들 크기 분석

### SEO 테스트
- 메타태그 검증
- 구조화된 데이터 검증
- 링크 무결성 검사

---

## 리스크 및 대응 방안

### 리스크 1: SEO 영향
**리스크**: URL 구조 변경으로 인한 검색 순위 하락
**대응**:
- URL 구조 완벽히 보존
- 301 리다이렉트 설정 (필요 시)
- Google Search Console 모니터링

### 리스크 2: 댓글 유실
**리스크**: Giscus pathname 매핑 불일치
**대응**:
- pathname 기반 매핑 유지
- 마이그레이션 전 테스트 페이지로 검증

### 리스크 3: 이미지 누락
**리스크**: 이미지 경로 변환 오류
**대응**:
- 자동 변환 스크립트 + 수동 검증
- 깨진 이미지 자동 감지 스크립트

### 리스크 4: 성능 저하
**리스크**: JavaScript 번들 크기 증가
**대응**:
- Astro Islands (부분 hydration)
- 코드 스플리팅
- 번들 분석 및 최적화

### 리스크 5: 빌드 실패
**리스크**: GitHub Actions에서 빌드 실패
**대응**:
- 로컬에서 충분한 테스트
- 의존성 버전 고정
- 빌드 캐싱 전략

---

## 개발 워크플로우

### 로컬 개발
```bash
# Astro 개발 서버 시작
pnpm dev

# Jekyll 개발 서버 (비교용)
pnpm jekyll:dev

# 타입 체크
pnpm type-check

# 빌드
pnpm build

# 빌드 미리보기
pnpm preview
```

### 브랜치 전략
```
main                    # 프로덕션 (Jekyll)
  └── astro-experimental # 실험 (Astro)
        └── feature/*    # 기능 브랜치
```

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

---

## 참고 자료

### Astro 공식 문서
- https://docs.astro.build/
- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/guides/migrate-to-astro/

### 마이그레이션 가이드
- Jekyll to Astro: https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/

### 도구 및 라이브러리
- MDX: https://mdxjs.com/
- Shiki: https://shiki.matsu.io/
- Giscus: https://giscus.app/

---

## 다음 에이전트를 위한 컨텍스트 요약

### 현재 상태
1. **브랜치**: `astro-experimental` 생성 완료
2. **설정**: Astro 프로젝트 초기화 완료 (package.json, tsconfig.json, astro.config.mjs)
3. **인프라**: GitHub Actions 워크플로우 설정 완료
4. **빌드**: 로컬 빌드 성공 확인 (0 errors)

### 즉시 진행 가능한 작업
1. **콘텐츠 마이그레이션 스크립트** (Phase 2.1)
   - `src/utils/jekyll-to-mdx.js` 작성
   - frontmatter 파싱 및 변환 로직
   - Liquid → MDX 변환

2. **Content Collections 설정** (Phase 2.2)
   - `src/content/config.ts` 생성
   - 블로그 스키마 정의

3. **기본 레이아웃 구현** (Phase 3.1)
   - `src/layouts/BaseLayout.astro`
   - `src/layouts/PostLayout.astro`

### 필요한 정보
- 샘플 포스트 경로: `_posts/Web/NestJS/2025-03-15-nestjs-dematerializer-4.md`
- 이미지 디렉토리: `assets/images/`
- Jekyll 설정: `_config.yml`

### 주의사항
1. **SEO 최우선**: URL 구조 절대 변경 금지
2. **GA ID 유지**: `G-JWJT3DQR8G` 그대로 사용
3. **Giscus 설정**: pathname 매핑 유지
4. **독립적 커밋**: 각 기능은 별도 커밋으로 관리

### 측정 지표
- 빌드 시간: ~0.5초 (Astro 5.14.4)
- 포스트 수: 75개+ (마이그레이션 대기 중)
- 커밋 수: 4개 완료 (Phase 1)

---

## Astro 5.x 업그레이드 상세 정보

### 업그레이드 날짜
**2025-10-12** - Astro 4.16.0 → 5.14.4 (메이저 버전 업데이트)

### 주요 변경사항

#### 1. Content Layer API (새 기능)
Astro 5.0의 가장 큰 변화는 Content Layer API 도입입니다. 이를 통해:
- **5배 빠른 빌드 속도** (대규모 콘텐츠 컬렉션)
- **다양한 소스 지원**: Markdown, API, CMS, 데이터베이스
- **하위 호환성 유지**: 기존 Content Collections 코드 그대로 작동

**적용 파일**: `src/content.config.ts` (신규 생성)

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

**이점**:
- 명시적 컬렉션 정의 (auto-generation 경고 제거)
- glob loader로 빠른 파일 스캔
- 타입 안정성 강화

#### 2. Vite 6.0 업그레이드
- 더 빠른 개발 서버
- 개선된 HMR (Hot Module Replacement)
- 최신 빌드 최적화

#### 3. MDX 4.x 업그레이드
**변경**: `@astrojs/mdx` 3.0.0 → 4.3.7

**주요 개선사항**:
- JSX/MDX 처리 성능 향상
- 더 나은 에러 메시지
- TypeScript 지원 개선

**Breaking Changes (우리 프로젝트 영향 없음)**:
- 구버전 MDX 통합 호환성 제거 (우리는 최신 버전 사용)

#### 4. React 통합 업그레이드
**변경**: `@astrojs/react` 3.0.0 → 4.4.0

**개선사항**:
- React 18.3.1 지원
- 부분 hydration 최적화
- 더 나은 클라이언트 디렉티브

#### 5. TypeScript 설정 업데이트
**변경**: `tsconfig.json` 업데이트

```json
{
  "include": [".astro/types.d.ts", "src/**/*"]
}
```

**이유**: Astro 5.x는 `.astro/types.d.ts`를 명시적으로 포함해야 함

### Breaking Changes 영향 분석

| 변경사항 | 우리 프로젝트 영향 | 조치 |
|---------|------------------|------|
| `<ViewTransitions />` → `<ClientRouter />` | 없음 | 사용 안함 |
| `compiledContent()` 비동기화 | 없음 | 아직 사용 안함 |
| Shiki 토큰 이름 변경 | 낮음 | 향후 커스텀 테마 적용 시 고려 |
| `astro:content` 클라이언트 접근 제거 | 없음 | 서버 사이드만 사용 |
| hybrid 렌더링 모드 제거 | 없음 | static 모드 사용 |
| Script 태그 동작 변경 | 낮음 | 현재 스크립트 미사용 |

### 테스트 결과

**빌드 성공**: ✅
```
pnpm build
✓ Completed in 599ms
0 errors, 0 warnings, 0 hints
```

**파일 크기**:
- 클라이언트 번들: 143.47 KB (gzip: 46.21 KB)
- 정적 페이지: 1개

### 다음 단계에서 활용할 Astro 5.x 기능

1. **Content Layer Loaders**
   - Jekyll 포스트를 효율적으로 로드
   - 커스텀 loader 작성 가능 (필요 시)

2. **개선된 이미지 처리**
   - 크롭, 반응형 레이아웃
   - 자동 srcset/sizes 생성

3. **Environment Variables (astro:env)**
   - 타입 안전 환경 변수
   - Google Analytics ID, Giscus 설정 등

### 참고 자료
- [Astro 5.0 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/)
- [Astro 5.0 Release Blog](https://astro.build/blog/astro-5/)
- [Content Layer API Docs](https://docs.astro.build/en/guides/content-collections/)

---

**마지막 커밋**: `ccf021c docs: Add comprehensive migration progress documentation`
**다음 목표**: Phase 2 - 콘텐츠 마이그레이션 도구 개발
