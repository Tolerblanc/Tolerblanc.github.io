# 컴포넌트 가이드

> Tolerblanc 블로그의 Astro 컴포넌트 사용법과 커스터마이징 방법을 안내합니다.

---

## 📋 목차

1. [컴포넌트 개요](#컴포넌트-개요)
2. [레이아웃 컴포넌트](#레이아웃-컴포넌트)
3. [UI 컴포넌트](#ui-컴포넌트)
4. [유틸리티 함수](#유틸리티-함수)
5. [새 컴포넌트 만들기](#새-컴포넌트-만들기)
6. [스타일링 가이드](#스타일링-가이드)

---

## 컴포넌트 개요

### 디렉토리 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── Notice.astro               # 알림 상자
│   ├── Header.astro               # 상단 메뉴
│   ├── Sidebar.astro              # 사이드바 네비게이션
│   ├── GiscusComments.astro       # 댓글 시스템
│   ├── CodeCopyButton.astro       # 코드 복사 버튼
│   ├── ReadingProgress.astro      # 읽기 진행률 바
│   └── ScrollToTop.astro          # 맨 위로 버튼
├── layouts/             # 페이지 레이아웃
│   ├── BaseLayout.astro           # 기본 레이아웃
│   └── PostLayout.astro           # 포스트 레이아웃
└── utils/               # 유틸리티 함수
    ├── navigation.ts              # 네비게이션 데이터
    └── formatDate.ts              # 날짜 포맷팅
```

### 컴포넌트 파일 명명 규칙

- **PascalCase**: `MyComponent.astro`
- **설명적 이름**: `CodeCopyButton.astro` (O), `Button.astro` (X)
- **단일 책임**: 하나의 컴포넌트는 하나의 역할만

---

## 레이아웃 컴포넌트

### BaseLayout

**위치**: `src/layouts/BaseLayout.astro`

**용도**: 모든 페이지의 기본 HTML 구조, SEO, Analytics

**Props**:
```typescript
interface Props {
  title: string;           // 페이지 제목 (필수)
  description?: string;    // 페이지 설명 (SEO)
  ogImage?: string;        // Open Graph 이미지
  canonicalURL?: string;   // 표준 URL
}
```

**사용 예시**:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="About Me"
  description="Tolerblanc의 기술 블로그 소개"
>
  <h1>About</h1>
  <p>콘텐츠...</p>
</BaseLayout>
```

**주요 기능**:
- HTML `<head>` 메타 태그 생성
- Google Analytics 스크립트 삽입
- 다크/라이트 모드 토글 (localStorage 기반)
- 글로벌 CSS 및 디자인 토큰 로드

---

### PostLayout

**위치**: `src/layouts/PostLayout.astro`

**용도**: 블로그 포스트 전용 레이아웃

**Props**:
```typescript
interface Props {
  title: string;
  date: Date;
  excerpt: string;
  categories: string[];
  tags: string[];
  toc?: boolean;        // 목차 표시 여부
  updatedDate?: Date;
}
```

**사용 예시**:
```astro
---
import PostLayout from '../../layouts/PostLayout.astro';
const { entry } = Astro.props;
---

<PostLayout {...entry.data}>
  <Content />
</PostLayout>
```

**주요 기능**:
- 포스트 메타데이터 표시 (제목, 날짜, 카테고리, 태그)
- 목차 (TOC) 자동 생성 및 하이라이팅
- 읽기 진행률 바
- 댓글 시스템 (Giscus)
- Scroll to Top 버튼
- 코드 복사 버튼 자동 삽입

---

## UI 컴포넌트

### Notice

**위치**: `src/components/Notice.astro`

**용도**: 정보/경고/위험/성공 알림 상자

**Props**:
```typescript
interface Props {
  type: 'info' | 'warning' | 'danger' | 'success';
}
```

**사용 예시**:
```mdx
<Notice type="info">
개인 공부 기록용 블로그입니다.
</Notice>

<Notice type="warning">
이 방법은 보안 취약점이 있을 수 있습니다.
</Notice>

<Notice type="danger">
프로덕션 환경에서는 절대 사용하지 마세요!
</Notice>

<Notice type="success">
모든 테스트가 통과했습니다!
</Notice>
```

**스타일 커스터마이징**:
```astro
<!-- src/components/Notice.astro -->
<style>
  .notice--info {
    background: var(--color-info-bg);
    border-left: 4px solid var(--color-info-border);
  }
  /* ... */
</style>
```

---

### Header

**위치**: `src/components/Header.astro`

**용도**: 상단 네비게이션 메뉴

**Props**: 없음 (내부적으로 `NAV_MENU` 상수 사용)

**구조**:
- 로고/사이트 이름
- 메뉴 링크 (Home, Blog, Tags, About)
- 다크 모드 토글 버튼

**커스터마이징**:

메뉴 항목 수정:
```typescript
// src/constants.ts
export const NAV_MENU = [
  { label: 'Home', href: `${SITE_CONFIG.BASE_PATH}/` },
  { label: 'Blog', href: `${SITE_CONFIG.BASE_PATH}/` },
  { label: 'Tags', href: `${SITE_CONFIG.BASE_PATH}/tags` },
  { label: 'About', href: `${SITE_CONFIG.BASE_PATH}/about` },
  { label: 'Contact', href: `${SITE_CONFIG.BASE_PATH}/contact` },  // 추가
] as const;
```

---

### Sidebar

**위치**: `src/components/Sidebar.astro`

**용도**: 좌측 카테고리 네비게이션

**Props**: 없음 (자동으로 카테고리 조회)

**주요 기능**:
- 카테고리 목록 (2-depth 확장/축소)
- 포스트 개수 표시
- 최근 포스트 5개
- 자동 확장 (현재 카테고리)

**카테고리 추가**:
```typescript
// src/constants.ts
export const CATEGORY_LABELS: Record<string, string> = {
  // ... 기존 카테고리
  'new_category': 'New Category',
};

export const CATEGORY_GROUPS: Record<string, string[]> = {
  'programming': ['cpp', 'python', 'javascript', 'new_category'],
};
```

---

### GiscusComments

**위치**: `src/components/GiscusComments.astro`

**용도**: GitHub Discussions 기반 댓글 시스템

**Props**: 없음 (내부적으로 `GISCUS_CONFIG` 사용)

**설정**:
```typescript
// src/constants.ts
export const GISCUS_CONFIG = {
  REPO: 'Tolerblanc/Tolerblanc.github.io',
  REPO_ID: 'R_kgDOJ01EaQ',
  CATEGORY: 'Announcements',
  CATEGORY_ID: 'DIC_kwDOJ01Eac4Cerab',
  THEME_LIGHT: 'light',
  THEME_DARK: 'dark_dimmed',
  // ...
} as const;
```

**다크 모드 연동**:
- 자동으로 테마 변경 감지
- `postMessage`로 Giscus iframe과 통신

---

### CodeCopyButton

**위치**: `src/components/CodeCopyButton.astro`

**용도**: 코드 블록에 복사 버튼 추가

**작동 방식**:
1. 모든 `<pre>` 태그 탐색
2. 복사 버튼 동적 추가
3. 클릭 시 코드 복사 + 성공 피드백 (✓ Copied!)

**사용 예시**: 자동 삽입 (PostLayout에서 사용)

---

### ReadingProgress

**위치**: `src/components/ReadingProgress.astro`

**용도**: 스크롤 진행률 표시

**작동 방식**:
- 스크롤 이벤트 리스닝
- 문서 높이 대비 현재 스크롤 위치 계산
- 상단 progress bar 업데이트

---

### ScrollToTop

**위치**: `src/components/ScrollToTop.astro`

**용도**: 페이지 맨 위로 이동 버튼

**작동 방식**:
- IntersectionObserver로 특정 위치 이하에서만 표시
- 클릭 시 smooth scroll로 상단 이동

---

## 유틸리티 함수

### navigation.ts

**위치**: `src/utils/navigation.ts`

**주요 함수**:

```typescript
/**
 * 모든 카테고리 정보를 포스트 개수와 함께 반환
 */
export async function getNavigationCategories(): Promise<NavCategory[]>

/**
 * 그룹화된 카테고리 정보를 반환 (2-depth 구조)
 */
export async function getNavigationCategoryGroups(): Promise<NavCategoryGroup[]>

/**
 * 최근 포스트를 날짜순으로 반환
 */
export async function getRecentPosts(count?: number): Promise<RecentPost[]>
```

**사용 예시**:
```astro
---
import { getNavigationCategories, getRecentPosts } from '../utils/navigation';

const categories = await getNavigationCategories();
const recentPosts = await getRecentPosts(5);
---

<ul>
  {categories.map(cat => (
    <li>{cat.name} ({cat.postCount})</li>
  ))}
</ul>
```

---

### formatDate.ts

**위치**: `src/utils/formatDate.ts`

**주요 함수**:

```typescript
/**
 * 한국어 전체 형식: 2025년 1월 19일
 */
export function formatDateFull(date: Date): string

/**
 * 짧은 형식: 2025.01.19
 */
export function formatDateShort(date: Date): string

/**
 * ISO 형식: 2025-01-19
 */
export function formatDateISO(date: Date): string

/**
 * 상대 시간: 3일 전, 2개월 전
 */
export function getRelativeTime(date: Date): string
```

**사용 예시**:
```astro
---
import { formatDateShort, getRelativeTime } from '../utils/formatDate';

const post = { date: new Date('2025-01-19') };
---

<time datetime={post.date.toISOString()}>
  {formatDateShort(post.date)}
  ({getRelativeTime(post.date)})
</time>
```

---

## 새 컴포넌트 만들기

### 1. 파일 생성

```bash
touch src/components/MyNewComponent.astro
```

### 2. 기본 구조

```astro
---
/**
 * MyNewComponent
 *
 * 컴포넌트 설명 및 용도
 */

interface Props {
  title: string;
  type?: 'primary' | 'secondary';
}

const { title, type = 'primary' } = Astro.props;
---

<div class={`my-component my-component--${type}`}>
  <h2>{title}</h2>
  <slot />
</div>

<style>
  .my-component {
    padding: var(--space-4);
    border-radius: var(--radius-md);
  }

  .my-component--primary {
    background: var(--color-primary);
  }

  .my-component--secondary {
    background: var(--color-secondary);
  }
</style>
```

### 3. 타입 정의

TypeScript Props 인터페이스:
```typescript
interface Props {
  // 필수 prop
  title: string;

  // 선택 prop (기본값 있음)
  type?: 'primary' | 'secondary';

  // 배열 prop
  items?: string[];

  // 객체 prop
  config?: {
    enabled: boolean;
    value: number;
  };
}
```

### 4. Slot 활용

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="card">
  <header>
    <h2>{title}</h2>
    <slot name="actions" />  <!-- Named slot -->
  </header>
  <main>
    <slot />  <!-- Default slot -->
  </main>
</div>
```

사용:
```astro
<MyCard title="제목">
  <button slot="actions">클릭</button>
  <p>기본 슬롯 내용</p>
</MyCard>
```

---

## 스타일링 가이드

### 디자인 토큰 사용

**위치**: `src/styles/design-tokens.css`

**사용 가능한 CSS 변수**:

```css
/* 색상 */
var(--color-text)
var(--color-bg)
var(--color-primary)
var(--color-secondary)
var(--color-accent)
var(--color-border)

/* 간격 */
var(--space-1)   /* 0.25rem */
var(--space-2)   /* 0.5rem */
var(--space-4)   /* 1rem */
var(--space-8)   /* 2rem */

/* 폰트 */
var(--font-sans)
var(--font-mono)
var(--text-sm)   /* 0.875rem */
var(--text-base) /* 1rem */
var(--text-lg)   /* 1.125rem */

/* 테두리 */
var(--radius-sm) /* 0.25rem */
var(--radius-md) /* 0.5rem */
var(--radius-lg) /* 1rem */

/* 그림자 */
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
```

### 다크 모드 지원

```css
.my-component {
  background: var(--color-bg);
  color: var(--color-text);
}

/* 자동으로 다크 모드 적용 (design-tokens.css에서 정의) */
```

### Tailwind CSS 사용

Tailwind는 `applyBaseStyles: false`로 설정되어 있습니다.

```astro
<div class="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
  <h1 class="text-2xl font-bold">제목</h1>
</div>
```

---

## 베스트 프랙티스

### 1. 재사용 가능하게 설계

- Props로 설정 가능하게
- Slot으로 내용 주입 가능하게
- 디자인 토큰 사용으로 테마 일관성 유지

### 2. 성능 최적화

- 클라이언트 JavaScript 최소화
- `client:` 디렉티브 신중하게 사용
- CSS는 컴포넌트 내부에 scoped style로

### 3. 접근성 (A11y)

- 시맨틱 HTML 사용
- ARIA 속성 추가
- 키보드 네비게이션 지원
- 색상 대비 확인

### 4. 타입 안정성

- 모든 Props에 TypeScript 인터페이스 정의
- 기본값 명시
- JSDoc 주석 추가

---

## 예제: 완전한 컴포넌트

```astro
---
/**
 * Card 컴포넌트
 *
 * 재사용 가능한 카드 UI 컴포넌트
 * 제목, 이미지, 액션 버튼을 포함할 수 있습니다.
 *
 * @example
 * <Card
 *   title="포스트 제목"
 *   image="/images/thumbnail.png"
 *   href="/blog/post"
 * >
 *   <p>포스트 설명...</p>
 * </Card>
 */

interface Props {
  /** 카드 제목 */
  title: string;

  /** 썸네일 이미지 URL (선택) */
  image?: string;

  /** 링크 URL (선택) */
  href?: string;

  /** 카드 크기 */
  size?: 'sm' | 'md' | 'lg';
}

const { title, image, href, size = 'md' } = Astro.props;
const Tag = href ? 'a' : 'div';
---

<Tag
  class={`card card--${size}`}
  href={href}
  aria-label={title}
>
  {image && (
    <img
      src={image}
      alt={title}
      class="card__image"
      loading="lazy"
    />
  )}
  <div class="card__content">
    <h3 class="card__title">{title}</h3>
    <slot />
  </div>
  <div class="card__actions">
    <slot name="actions" />
  </div>
</Tag>

<style>
  .card {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-md);
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .card__image {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .card__content {
    padding: var(--space-4);
  }

  .card__title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin-bottom: var(--space-2);
  }

  .card__actions {
    padding: var(--space-4);
    border-top: 1px solid var(--color-border);
  }

  /* Size variants */
  .card--sm {
    max-width: 300px;
  }

  .card--md {
    max-width: 400px;
  }

  .card--lg {
    max-width: 600px;
  }
</style>
```

---

**작성일**: 2025-10-26
**최종 수정**: 2025-10-26
