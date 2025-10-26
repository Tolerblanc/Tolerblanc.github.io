# 프로젝트 아키텍처 가이드

> Tolerblanc 블로그의 전체 구조와 설계 원칙을 설명합니다.

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [디렉토리 구조](#디렉토리-구조)
3. [기술 스택](#기술-스택)
4. [핵심 개념](#핵심-개념)
5. [라우팅 시스템](#라우팅-시스템)
6. [데이터 흐름](#데이터-흐름)
7. [빌드 프로세스](#빌드-프로세스)
8. [SEO 전략](#seo-전략)
9. [성능 최적화](#성능-최적화)
10. [확장 가이드](#확장-가이드)

---

## 프로젝트 개요

### 목적
Jekyll에서 Astro로 마이그레이션하여:
- **Ruby 의존성 제거** → JavaScript/TypeScript 생태계
- **개발 경험 개선** → 빠른 빌드, 핫 리로드, 타입 안정성
- **확장성 강화** → MDX 컴포넌트, 모던 프레임워크
- **SEO 보존** → 기존 URL, Analytics, 댓글 시스템 유지

### 핵심 원칙
1. **SEO 우선**: URL 구조, 메타데이터, Analytics 절대 보존
2. **성능 최적화**: 빠른 빌드, 작은 번들, 효율적 로딩
3. **개발자 경험**: 타입 안정성, 명확한 구조, 좋은 문서
4. **점진적 개선**: 실험 브랜치에서 검증 후 배포

---

## 디렉토리 구조

```
/Users/hyunjun/Code/Blog/
├── .github/
│   └── workflows/
│       └── deploy-experimental.yml  # GitHub Actions 배포
├── src/
│   ├── components/                   # 재사용 UI 컴포넌트
│   │   ├── Notice.astro
│   │   ├── Header.astro
│   │   ├── Sidebar.astro
│   │   ├── GiscusComments.astro
│   │   ├── CodeCopyButton.astro
│   │   ├── ReadingProgress.astro
│   │   └── ScrollToTop.astro
│   ├── content/                      # Content Collections
│   │   ├── config.ts                 # 스키마 정의
│   │   └── blog/                     # 블로그 포스트
│   │       ├── javascript/
│   │       ├── python/
│   │       ├── algorithm/
│   │       └── ...
│   ├── layouts/                      # 페이지 레이아웃
│   │   ├── BaseLayout.astro          # 기본 HTML 구조
│   │   └── PostLayout.astro          # 포스트 레이아웃
│   ├── pages/                        # 파일 기반 라우팅
│   │   ├── index.astro               # 홈페이지
│   │   ├── about.astro               # About 페이지
│   │   ├── tags.astro                # 태그 목록
│   │   ├── rss.xml.ts                # RSS 피드
│   │   ├── blog/
│   │   │   ├── [...slug].astro       # 동적 포스트 라우팅
│   │   │   └── category/
│   │   │       └── [category].astro  # 카테고리 페이지
│   │   └── tags/
│   │       └── [tag].astro           # 태그 페이지
│   ├── styles/                       # 글로벌 스타일
│   │   ├── global.css
│   │   └── design-tokens.css
│   ├── utils/                        # 유틸리티 함수
│   │   ├── navigation.ts             # 네비게이션 데이터
│   │   └── formatDate.ts             # 날짜 포맷팅
│   ├── constants.ts                  # 전역 상수
│   ├── content.config.ts             # Content Collections 스키마
│   └── env.d.ts                      # TypeScript 환경 타입
├── public/                           # 정적 파일 (복사됨)
│   ├── robots.txt
│   ├── images/
│   └── fonts/
├── dist/                             # 빌드 출력 (무시)
├── tests/                            # Playwright E2E 테스트
│   └── seo-verification.spec.ts
├── astro.config.mjs                  # Astro 설정
├── tsconfig.json                     # TypeScript 설정
├── tailwind.config.cjs               # Tailwind CSS 설정
├── package.json                      # npm 의존성
├── CLAUDE.md                         # Claude Code 지침
├── MIGRATION_PROGRESS.md             # 마이그레이션 진행 상황
├── POST_GUIDE.md                     # 포스트 작성 가이드
├── COMPONENT_GUIDE.md                # 컴포넌트 가이드
└── ARCHITECTURE.md                   # 이 파일
```

---

## 기술 스택

### 프레임워크
- **Astro 5.14.4**: 정적 사이트 생성 프레임워크
  - Content Layer API
  - Vite 6 빌드 도구
  - MDX 지원

### 언어
- **TypeScript**: 타입 안정성
- **CSS**: 글로벌 스타일 + 컴포넌트 scoped style
- **MDX**: Markdown + JSX 컴포넌트

### 라이브러리
- **@astrojs/mdx**: MDX 통합
- **@astrojs/react**: React 컴포넌트 지원 (최소 사용)
- **@astrojs/sitemap**: 자동 사이트맵 생성
- **@astrojs/tailwind**: Tailwind CSS 통합
- **remark-math + rehype-katex**: LaTeX 수식 렌더링
- **Shiki**: 코드 하이라이팅

### 도구
- **pnpm**: 패키지 관리자 (빠른 의존성 관리)
- **Playwright**: E2E 테스트
- **GitHub Actions**: CI/CD

---

## 핵심 개념

### Content Collections

**위치**: `src/content/blog/`

Astro의 Content Layer API를 사용하여 타입 안전한 콘텐츠 관리:

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    // ...
  }),
});

export const collections = {
  blog: blogCollection,
};
```

**장점**:
- 타입 안정성 (컴파일 타임 검증)
- 자동 완성 (IDE 지원)
- 스키마 기반 검증

### 파일 기반 라우팅

**디렉토리**: `src/pages/`

Astro는 파일 시스템을 기반으로 라우팅:

```
src/pages/index.astro         → /experimental/
src/pages/about.astro          → /experimental/about/
src/pages/tags/[tag].astro     → /experimental/tags/python/
src/pages/blog/[...slug].astro → /experimental/blog/javascript/nestjs-dematerializer-4/
```

**동적 라우팅**:
```astro
---
// src/pages/blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}
---
```

### 컴포넌트 구조

**레이아웃 계층**:
```
BaseLayout
  ├── Header
  ├── Sidebar (선택)
  └── PostLayout (포스트 페이지만)
      ├── ReadingProgress
      ├── ScrollToTop
      ├── CodeCopyButton
      └── GiscusComments
```

**Props 전달 흐름**:
1. `[...slug].astro`에서 포스트 데이터 조회
2. `PostLayout`에 props 전달
3. 레이아웃이 메타데이터 렌더링
4. `<slot />`에 포스트 내용 삽입

---

## 라우팅 시스템

### URL 구조 (SEO 보존)

**Jekyll 패턴**: `/:categories/:title/`

**Astro 구현**:
```
Content 파일: src/content/blog/javascript/nestjs-dematerializer-4.mdx
최종 URL:    /experimental/blog/javascript/nestjs-dematerializer-4/
```

**매핑 전략**:
1. Content Collections의 `id` = 카테고리 경로 + slug
2. 동적 라우팅 `[...slug].astro`로 모든 경로 처리
3. `getStaticPaths()`에서 URL 생성

### 정적 페이지 생성

```astro
---
// src/pages/blog/category/[category].astro
export async function getStaticPaths() {
  const allPosts = await getCollection('blog');
  const categories = [...new Set(allPosts.map(p => p.id.split('/')[0]))];

  return categories.map(category => ({
    params: { category },
    props: {
      posts: allPosts.filter(p => p.id.startsWith(category)),
    },
  }));
}

const { category } = Astro.params;
const { posts } = Astro.props;
---
```

---

## 데이터 흐름

### 포스트 데이터 조회

```
1. Content Collections 스키마 정의 (content.config.ts)
   ↓
2. MDX 파일 작성 (src/content/blog/[category]/[slug].mdx)
   ↓
3. getCollection() 호출 (페이지 컴포넌트)
   ↓
4. 필터링/정렬 (draft 제외, 날짜순 등)
   ↓
5. Props 전달 (레이아웃 컴포넌트)
   ↓
6. 렌더링 (HTML 생성)
```

### 네비게이션 데이터 흐름

```
1. getNavigationCategories() 호출
   ↓
2. getCollection('blog') → 모든 포스트 조회
   ↓
3. 카테고리별 포스트 개수 계산
   ↓
4. CATEGORY_LABELS 매핑 (constants.ts)
   ↓
5. NavCategory[] 반환
   ↓
6. Sidebar 컴포넌트 렌더링
```

---

## 빌드 프로세스

### 빌드 단계

```bash
pnpm build
```

**실행 순서**:

1. **타입 체크** (`astro check`)
   - TypeScript 컴파일 에러 검사
   - Content Collections 스키마 검증
   - 0 errors → 진행

2. **Content Layer 동기화**
   - MDX 파일 파싱
   - Frontmatter 검증
   - 메타데이터 추출

3. **정적 페이지 생성**
   - `getStaticPaths()` 실행
   - 124개 페이지 생성 (포스트 + 카테고리 + 태그)
   - HTML + CSS + JS 빌드

4. **번들 최적화**
   - Vite 빌드 (코드 splitting, tree shaking)
   - CSS 압축 (143.47 KB → 46.21 KB gzip)
   - 이미지 최적화 (Phase 6 예정)

5. **사이트맵 생성** (`@astrojs/sitemap`)
   - `sitemap-index.xml` 생성
   - 모든 페이지 URL 포함

**출력**: `dist/` 디렉토리

### 빌드 성능

**현재**:
- 빌드 시간: ~3초 (124 pages)
- 번들 크기: 143.47 KB (gzip: 46.21 kB)
- 타입 체크: 0 errors

**최적화 목표** (Phase 6):
- 이미지 최적화로 페이지 로드 30% 개선
- 폰트 최적화 (subset, preload)
- Lighthouse 점수 95+ (모든 카테고리)

---

## SEO 전략

### URL 구조 보존

**Jekyll → Astro 매핑**:
```
Jekyll: _posts/Web/NestJS/2025-02-23-nestjs-dematerializer-4.md
Astro:  src/content/blog/javascript/nestjs-dematerializer-4.mdx
URL:    /experimental/blog/javascript/nestjs-dematerializer-4/
```

**중요**: 카테고리 경로만 일치하면 URL 동일 (날짜 제거)

### 메타 태그

**BaseLayout.astro**에서 자동 생성:
```html
<title>{title} | 인생은 B와 D사이 Code다</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="article" />
<meta property="og:url" content={canonicalURL} />
<link rel="canonical" href={canonicalURL} />
```

### Google Analytics

**스크립트 삽입** (BaseLayout.astro):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JWJT3DQR8G"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-JWJT3DQR8G');
</script>
```

### 사이트맵 & RSS

**사이트맵**: `@astrojs/sitemap`이 자동 생성
- `sitemap-index.xml`
- 모든 페이지 포함
- 검색 엔진 크롤링 최적화

**RSS 피드**: `src/pages/rss.xml.ts`
- `/rss.xml` 엔드포인트
- 최신 포스트 자동 추가
- RSS 리더 지원

---

## 성능 최적화

### 현재 최적화

1. **정적 생성** (SSG)
   - 모든 페이지 빌드 타임에 생성
   - 런타임 렌더링 불필요
   - CDN 캐싱 가능

2. **코드 스플리팅**
   - Vite 자동 코드 splitting
   - 페이지별 번들 분리
   - 초기 로드 최소화

3. **CSS 최적화**
   - Scoped styles (불필요한 CSS 제거)
   - Tailwind JIT (사용된 클래스만)
   - 압축 (143 KB → 46 KB gzip)

4. **JavaScript 최소화**
   - Astro Islands (필요한 곳만 hydration)
   - 댓글 시스템만 client-side
   - 나머지는 static HTML

### 예정 최적화 (Phase 6, 9)

1. **이미지 최적화**
   - WebP/AVIF 변환
   - 반응형 이미지
   - 지연 로딩

2. **폰트 최적화**
   - Pretendard Variable subset
   - preload 적용
   - FOUT 방지

3. **성능 모니터링**
   - Lighthouse CI
   - Core Web Vitals 추적
   - 빌드 성능 벤치마크

---

## 확장 가이드

### 새 페이지 추가

1. **파일 생성**:
   ```bash
   touch src/pages/contact.astro
   ```

2. **BaseLayout 사용**:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   ---

   <BaseLayout title="Contact" description="연락처 페이지">
     <h1>Contact Me</h1>
     <form>...</form>
   </BaseLayout>
   ```

3. **네비게이션 메뉴 추가** (선택):
   ```typescript
   // src/constants.ts
   export const NAV_MENU = [
     // ...
     { label: 'Contact', href: `${SITE_CONFIG.BASE_PATH}/contact` },
   ] as const;
   ```

### 새 Content Collection 추가

1. **디렉토리 생성**:
   ```bash
   mkdir -p src/content/projects
   ```

2. **스키마 정의** (`src/content.config.ts`):
   ```typescript
   const projectsCollection = defineCollection({
     type: 'content',
     schema: z.object({
       title: z.string(),
       description: z.string(),
       github: z.string().url(),
       // ...
     }),
   });

   export const collections = {
     blog: blogCollection,
     projects: projectsCollection,  // 추가
   };
   ```

3. **페이지 생성**:
   ```astro
   ---
   // src/pages/projects.astro
   import { getCollection } from 'astro:content';
   const projects = await getCollection('projects');
   ---
   ```

### 새 컴포넌트 추가

**가이드**: [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) 참고

---

## 테스트 전략

### E2E 테스트 (Playwright)

**위치**: `tests/seo-verification.spec.ts`

**테스트 항목**:
- 홈페이지 렌더링
- 블로그 포스트 접근
- 카테고리/태그 페이지
- SEO 메타 태그
- Sitemap, robots.txt
- RSS 피드

**실행**:
```bash
pnpm exec playwright test
```

### 타입 체크

```bash
pnpm astro check
```

### 빌드 검증

```bash
pnpm build && pnpm preview
```

---

## 배포 전략

### 실험 브랜치 (`astro-experimental`)

```yaml
# .github/workflows/deploy-experimental.yml
on:
  push:
    branches: [astro-experimental]

jobs:
  deploy:
    steps:
      - checkout
      - pnpm install
      - pnpm build
      - deploy to gh-pages/experimental
```

**배포 URL**: https://tolerblanc.github.io/experimental

### 프로덕션 전환 시나리오

**옵션 1: 점진적 전환 (권장)**
1. `/experimental` 충분히 테스트 (2-4주)
2. 사용자 피드백 수집
3. Lighthouse 점수 확인
4. `main` 브랜치에 머지
5. Jekyll 파일 아카이브

**옵션 2: 일시 전환**
1. `/experimental` 완성도 100% 확인
2. 유지보수 공지
3. `main` 즉시 머지

---

## 문제 해결

### 빌드 실패

**증상**: TypeScript 에러

**해결**:
```bash
pnpm astro check
# 에러 위치 확인 후 수정
```

---

**증상**: Content Collections 스키마 불일치

**해결**:
```typescript
// src/content.config.ts 스키마 확인
// Frontmatter 필드 일치 여부 검증
```

---

### 성능 저하

**증상**: 빌드 시간 증가

**해결**:
- 불필요한 import 제거
- 큰 이미지 최적화
- 중복 컴포넌트 제거

---

### SEO 문제

**증상**: 검색 엔진에 노출 안 됨

**해결**:
- `robots.txt` 확인
- `sitemap-index.xml` 생성 확인
- Google Search Console 등록
- Canonical URL 확인

---

## 참고 자료

### 공식 문서
- [Astro 문서](https://docs.astro.build/)
- [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [MDX 가이드](https://docs.astro.build/en/guides/integrations-guide/mdx/)

### 내부 가이드
- [포스트 작성 가이드](./POST_GUIDE.md)
- [컴포넌트 가이드](./COMPONENT_GUIDE.md)
- [마이그레이션 진행 상황](./MIGRATION_PROGRESS.md)

---

**작성일**: 2025-10-26
**최종 수정**: 2025-10-26
**작성자**: Claude Code
