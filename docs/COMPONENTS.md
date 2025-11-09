# 컴포넌트 문서

> **Astro 5 + React 18 + shadcn/ui** 기반 블로그 컴포넌트 가이드

---

## 📂 컴포넌트 구조

```
src/components/
├── layout/              # 레이아웃 컴포넌트 (Astro)
│   ├── Header.astro
│   └── Sidebar.astro
│
├── features/            # 기능 컴포넌트 (Astro)
│   ├── TableOfContents.astro
│   ├── ReadingProgress.astro
│   ├── ScrollToTop.astro
│   ├── CodeCopyButton.astro
│   ├── GiscusComments.astro
│   └── Notice.astro
│
├── Search.tsx           # 검색 컴포넌트 (React)
│
└── ui/                  # shadcn/ui 컴포넌트
    ├── Core Components (shadcn/ui 표준)
    │   ├── button.tsx
    │   ├── card.tsx
    │   ├── badge.tsx
    │   ├── separator.tsx
    │   ├── pagination.tsx
    │   ├── accordion.tsx
    │   ├── scroll-area.tsx
    │   ├── skeleton.tsx
    │   ├── alert.tsx
    │   └── breadcrumb.tsx
    │
    └── Custom Extensions (블로그 전용)
        ├── blog-post-card.tsx
        ├── blog-pagination.tsx
        ├── blog-breadcrumb.tsx
        └── blog-post-skeleton.tsx
```

---

## 🎨 레이아웃 컴포넌트

### Header.astro

**위치:** `src/components/Header.astro`

**기능:**
- 고정 헤더 (fixed position, backdrop-blur)
- 다크/라이트 모드 토글
- 반응형 네비게이션 (모바일: 햄버거 메뉴)
- Sidebar 접기/펼치기 버튼

**Props:**
```typescript
// Props 없음 (standalone component)
```

**사용법:**
```astro
---
import Header from '@/components/Header.astro';
---

<Header />
```

**주요 기능:**
- **다크 모드 전환**: localStorage 저장, FOUC 방지
- **Sidebar 토글**: 상태를 localStorage에 저장하여 세션 간 유지
- **반응형 디자인**:
  - Desktop: 로고 + 검색 + 테마 토글
  - Mobile: 햄버거 메뉴 + 테마 토글

**스타일:**
- 높이: 64px (desktop), 56px (mobile)
- 배경: `backdrop-blur-md` + 반투명
- z-index: `var(--z-fixed)` (50)

---

### Sidebar.astro

**위치:** `src/components/Sidebar.astro`

**기능:**
- 좌측 고정 사이드바
- 프로필 섹션 (GitHub 스타일 컴팩트 디자인)
- 최근 포스트 목록
- 카테고리 네비게이션

**Props:**
```typescript
interface Props {
  categories: string[];      // 카테고리 목록
  recentPosts?: Post[];      // 최근 포스트 (선택)
}
```

**사용법:**
```astro
---
import Sidebar from '@/components/Sidebar.astro';
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const categories = [...new Set(posts.map(p => p.data.subject))];
---

<Sidebar categories={categories} />
```

**주요 기능:**
- **접기/펼치기**: Header의 토글 버튼과 연동
- **프로필 섹션**:
  - 32px 아바타
  - 이름, 직함, 소셜 링크
  - 호버 시 화살표 애니메이션
- **Recent Posts**: Clock 아이콘 + 최근 5개 포스트
- **Categories**: Folder 아이콘 + 전체 카테고리

**스타일:**
- 너비: `var(--layout-sidebar-width)` (256px)
- 위치: Fixed left, 독립 스크롤
- 접힌 상태: `-translate-x-full` (모바일/토글)

---

## ⚙️ 기능 컴포넌트 (Astro)

### TableOfContents.astro

**위치:** `src/components/TableOfContents.astro`

**기능:**
- 포스트 목차 (H2, H3 레벨)
- Intersection Observer 기반 현재 섹션 하이라이트
- Sticky 위치, 독립 스크롤

**Props:**
```typescript
interface Props {
  headings: { depth: number; text: string; slug: string }[];
}
```

**사용법:**
```astro
---
import TableOfContents from '@/components/TableOfContents.astro';
const { headings } = Astro.props;
---

<TableOfContents headings={headings} />
```

**주요 기능:**
- **자동 하이라이트**: 현재 보이는 섹션을 자동으로 감지하여 하이라이트
- **Smooth Scroll**: 클릭 시 부드러운 스크롤 이동
- **Sticky Position**: 헤더 아래 고정, 스크롤 가능

**스타일:**
- 위치: `sticky`, `top: calc(var(--layout-header-height) + var(--spacing-6))`
- 최대 높이: `calc(100vh - var(--layout-header-height) - var(--spacing-12))`
- Active 상태: `border-left: 2px solid primary`, 폰트 볼드

---

### ReadingProgress.astro

**위치:** `src/components/ReadingProgress.astro`

**기능:**
- 포스트 읽기 진행률 표시 (상단 바)
- 스크롤 위치에 따라 자동 업데이트

**Props:**
```typescript
// Props 없음 (standalone component)
```

**사용법:**
```astro
---
import ReadingProgress from '@/components/ReadingProgress.astro';
---

<ReadingProgress />
```

**주요 기능:**
- 스크롤 이벤트 감지하여 진행률 계산
- 헤더 하단에 고정 (3px 높이)
- 반응형: 데스크톱에서는 사이드바 우측부터 시작

**스타일:**
- 위치: `fixed`, `top: var(--layout-header-height)`
- 좌측: `var(--layout-sidebar-width)` (desktop), `0` (mobile)
- 색상: primary gradient

---

### ScrollToTop.astro

**위치:** `src/components/ScrollToTop.astro`

**기능:**
- 페이지 상단으로 스크롤하는 버튼
- 일정 스크롤 이상에서만 표시

**Props:**
```typescript
// Props 없음 (standalone component)
```

**사용법:**
```astro
---
import ScrollToTop from '@/components/ScrollToTop.astro';
---

<ScrollToTop />
```

**주요 기능:**
- 스크롤 300px 이상: 버튼 표시
- 클릭 시 부드러운 애니메이션으로 상단 이동
- 우하단 고정 위치

**스타일:**
- 위치: `fixed`, `bottom: 2rem`, `right: 2rem`
- 크기: 48x48px
- 애니메이션: fade-in/out

---

### CodeCopyButton.astro

**위치:** `src/components/CodeCopyButton.astro`

**기능:**
- 코드 블록 복사 버튼
- 복사 완료 피드백

**Props:**
```typescript
// Props 없음 (자동으로 모든 <pre> 태그에 추가)
```

**사용법:**
```astro
---
import CodeCopyButton from '@/components/CodeCopyButton.astro';
---

<CodeCopyButton />
```

**주요 기능:**
- 모든 코드 블록에 자동으로 복사 버튼 추가
- 클릭 시 클립보드 복사
- 복사 완료 시 체크 아이콘으로 변경 (2초 후 원복)

**스타일:**
- 위치: 코드 블록 우상단 absolute
- 호버 시에만 표시

---

### GiscusComments.astro

**위치:** `src/components/GiscusComments.astro`

**기능:**
- GitHub Discussions 기반 댓글 시스템

**Props:**
```typescript
// Props 없음 (자동 설정)
```

**사용법:**
```astro
---
import GiscusComments from '@/components/GiscusComments.astro';
---

<GiscusComments />
```

**주요 기능:**
- 다크/라이트 모드 자동 전환
- GitHub 계정으로 댓글 작성

---

### Notice.astro

**위치:** `src/components/Notice.astro`

**기능:**
- 알림/공지 메시지 컴포넌트

**Props:**
```typescript
interface Props {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
}
```

**사용법:**
```astro
---
import Notice from '@/components/Notice.astro';
---

<Notice type="warning" title="주의">
  이것은 경고 메시지입니다.
</Notice>
```

**스타일:**
- 아이콘 + 제목 + 내용
- type에 따라 색상 변경

---

## 🔍 검색 컴포넌트 (React)

### Search.tsx

**위치:** `src/components/Search.tsx`

**기능:**
- Pagefind 기반 전체 포스트 검색
- 모달 UI

**Props:**
```typescript
// Props 없음 (standalone component)
```

**사용법:**
```astro
---
import Search from '@/components/Search.tsx';
---

<Search client:load />
```

**주요 기능:**
- 전체 포스트 인덱싱 검색
- 한글 지원
- 검색 결과 하이라이트
- 키보드 단축키: `Ctrl/Cmd + K`

**참고:**
- 개발 모드에서는 작동하지 않음 (Pagefind 인덱스가 빌드 시에만 생성됨)
- 프로덕션 빌드 후 `pnpm preview`로 테스트 가능

---

## 🧩 shadcn/ui Core Components

### Button

**파일:** `src/components/ui/button.tsx`

**사용 위치:**
- Header (햄버거 메뉴, 테마 토글)
- Sidebar (접기/펼치기 버튼)
- ScrollToTop
- 404 페이지

**Variants:**
```typescript
variant: 'default' | 'outline' | 'ghost' | 'link' | 'destructive'
size: 'sm' | 'md' | 'lg' | 'icon'
```

**사용법:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="md">
  클릭
</Button>
```

---

### Card

**파일:** `src/components/ui/card.tsx`

**사용 위치:**
- 홈페이지 (포스트 카드)
- 블로그 리스트 (포스트 카드)
- 카테고리 페이지

**하위 컴포넌트:**
- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

**사용법:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

---

### Badge

**파일:** `src/components/ui/badge.tsx`

**사용 위치:**
- 포스트 카드 (카테고리 배지)
- 태그 페이지

**Variants:**
```typescript
variant: 'default' | 'secondary' | 'outline' | 'destructive'
```

**사용법:**
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">카테고리</Badge>
```

---

### Separator

**파일:** `src/components/ui/separator.tsx`

**사용 위치:**
- Sidebar (섹션 구분)
- 포스트 메타 정보 구분

**사용법:**
```tsx
import { Separator } from '@/components/ui/separator';

<Separator orientation="horizontal" />
```

---

### Pagination

**파일:** `src/components/ui/pagination.tsx`

**사용 위치:**
- 블로그 리스트 하단 (페이지 네비게이션)

**하위 컴포넌트:**
- `Pagination`
- `PaginationContent`
- `PaginationItem`
- `PaginationLink`
- `PaginationPrevious`
- `PaginationNext`
- `PaginationEllipsis`

**사용법:**
```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationLink href="/blog/1">1</PaginationLink>
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

### Accordion (미사용, 향후 사용 가능)

**파일:** `src/components/ui/accordion.tsx`

**제안 사용처:**
- FAQ 페이지
- 사이드바 카테고리 접기/펼치기 (고급)

---

### ScrollArea (미사용, 향후 사용 가능)

**파일:** `src/components/ui/scroll-area.tsx`

**제안 사용처:**
- TOC (스크롤 영역 커스터마이징)
- Sidebar (커스텀 스크롤바)

---

## 🎨 Custom Extensions (블로그 전용)

### BlogPostCard

**파일:** `src/components/ui/blog-post-card.tsx`

**사용 위치:**
- 홈페이지 (최근 포스트)
- 블로그 리스트
- 카테고리 페이지

**Props:**
```typescript
interface BlogPostCardProps {
  title: string;
  description: string;
  date: Date;
  subject: string;      // 카테고리
  slug: string;         // URL slug
  tags?: string[];
  readTime?: string;    // 읽는 시간 (예: "5분")
}
```

**사용법:**
```tsx
import { BlogPostCard } from '@/components/ui/blog-post-card';

<BlogPostCard
  title="포스트 제목"
  description="포스트 설명"
  date={new Date()}
  subject="JavaScript"
  slug="javascript/example"
  tags={['React', 'TypeScript']}
  readTime="5분"
/>
```

**주요 기능:**
- 호버 효과 (translateY -2px, shadow-lg)
- 카테고리 배지
- 날짜 + 읽는 시간 표시
- 태그 (최대 3개)

---

### BlogPagination

**파일:** `src/components/ui/blog-pagination.tsx`

**사용 위치:**
- 블로그 리스트 하단

**Props:**
```typescript
interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;     // 예: "/blog"
}
```

**사용법:**
```tsx
import { BlogPagination } from '@/components/ui/blog-pagination';

<BlogPagination
  currentPage={1}
  totalPages={7}
  basePath="/blog"
/>
```

**주요 기능:**
- 이전/다음 버튼
- 페이지 번호 표시 (최대 5개)
- 현재 페이지 하이라이트
- Ellipsis (...) 표시

---

### BlogPostSkeleton

**파일:** `src/components/ui/blog-post-skeleton.tsx`

**사용 위치:**
- 로딩 상태 표시 (향후 사용)

**사용법:**
```tsx
import { BlogPostSkeleton } from '@/components/ui/blog-post-skeleton';

<BlogPostSkeleton count={3} />
```

---

## ❌ Deprecated Components

다음 컴포넌트들은 Astro 버전으로 전환되었으며 더 이상 사용되지 않습니다:

- `ui/table-of-contents.tsx` → `TableOfContents.astro`
- `ui/scroll-to-top.tsx` → `ScrollToTop.astro`
- `ui/code-copy-button.tsx` → `CodeCopyButton.astro`
- `ui/notice.tsx` → `Notice.astro`
- `ui/blog-sidebar.tsx` → `Sidebar.astro`

**제거 가능 시기:** Phase 6 정리 단계

---

## 📚 레이아웃 사용 예시

### BaseLayout.astro

**위치:** `src/layouts/BaseLayout.astro`

**사용:**
```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="페이지 제목" description="페이지 설명">
  <!-- 페이지 콘텐츠 -->
</BaseLayout>
```

**포함 컴포넌트:**
- Header
- Footer (기본)
- ViewTransitions
- FOUC 방지 스크립트

---

### PostLayout.astro

**위치:** `src/layouts/PostLayout.astro`

**사용:**
```astro
---
import PostLayout from '@/layouts/PostLayout.astro';
const { frontmatter, headings } = Astro.props;
---

<PostLayout frontmatter={frontmatter} headings={headings}>
  <slot />
</PostLayout>
```

**포함 컴포넌트:**
- BaseLayout
- Sidebar
- TableOfContents
- ReadingProgress
- ScrollToTop
- GiscusComments
- CodeCopyButton

**레이아웃 구조:**
```
┌─────────────────────────────────────────────┐
│ Header (fixed)                              │
├──────┬──────────────────────────┬───────────┤
│      │                          │           │
│ Side │  Main Content            │  TOC      │
│ bar  │  (max-w-content)         │  (sticky) │
│      │                          │           │
└──────┴──────────────────────────┴───────────┘
```

---

## 🎨 스타일링 가이드

### Design Tokens

주요 CSS 변수는 `src/styles/design-tokens.css`에 정의되어 있습니다:

```css
/* Layout */
--layout-header-height: 64px;
--layout-sidebar-width: 256px;
--layout-content-width: 672px;

/* Spacing */
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-12: 3rem;    /* 48px */

/* Border Radius */
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */

/* Transitions */
--transition-base: 0.2s;
--transition-slow: 0.3s;

/* Z-index */
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-fixed: 50;
--z-modal: 100;
```

### Color System

shadcn/ui HSL 기반 색상 시스템 사용 (`src/styles/global.css`):

```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 0 0% 10%;
--primary: 217 91% 60%;
--secondary: 0 0% 96%;

/* Dark Mode */
.dark {
  --background: 0 0% 9%;
  --foreground: 0 0% 95%;
  --primary: 217 91% 60%;
  --secondary: 0 0% 15%;
}
```

---

## 🚀 향후 통합 제안

### Phase 6 추가 컴포넌트

1. **Dialog** (검색 모달 개선)
   ```bash
   npx shadcn-ui@latest add dialog
   ```

2. **DropdownMenu** (설정 메뉴)
   ```bash
   npx shadcn-ui@latest add dropdown-menu
   ```

3. **Tabs** (카테고리 필터링)
   ```bash
   npx shadcn-ui@latest add tabs
   ```

---

## 📝 컴포넌트 추가 가이드

### 1. shadcn/ui 컴포넌트 추가

```bash
npx shadcn-ui@latest add [component-name]
```

### 2. 커스텀 컴포넌트 생성

**Astro 컴포넌트:**
```astro
---
// src/components/MyComponent.astro
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="my-component">
  <h2>{title}</h2>
</div>

<style>
.my-component {
  /* styles */
}
</style>
```

**React 컴포넌트:**
```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export const MyComponent = ({ title }: MyComponentProps) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
    </div>
  );
};
```

### 3. 사용 시 주의사항

- **Astro 컴포넌트**: 기본적으로 서버 사이드 렌더링 (빠름, SEO 좋음)
- **React 컴포넌트**: 클라이언트 인터랙션 필요 시 사용
  - `client:load` - 페이지 로드 시 즉시 하이드레이션
  - `client:idle` - 페이지 로드 후 idle 시 하이드레이션
  - `client:visible` - 뷰포트에 보일 때 하이드레이션
  - `client:media` - 미디어 쿼리 매칭 시 하이드레이션

---

**마지막 업데이트:** 2025-11-09
**작성자:** Claude + Tolerblanc
**버전:** Astro 5.14.4 + React 18.3.1 + shadcn/ui
