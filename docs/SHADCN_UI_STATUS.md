# shadcn/ui 컴포넌트 현황

> 프로젝트에서 사용 중인 shadcn/ui 컴포넌트 및 커스텀 컴포넌트 현황 (2025-02-11 기준)

## 📦 설치된 shadcn/ui 컴포넌트

### Core 컴포넌트 (사용 중)

| 컴포넌트 | 파일 | 사용 위치 | 주요 용도 |
|---------|------|----------|----------|
| **Button** | `button.tsx` | 404, index, scroll-to-top, pagination | 액션 버튼 |
| **Card** | `card.tsx` | index, blog-post-card, blog-post-skeleton | 콘텐츠 카드 |
| **Badge** | `badge.tsx` | index, blog-post-card | 카테고리/태그 표시 |
| **Separator** | `separator.tsx` | index, blog/[...page] | 섹션 구분선 |
| **Accordion** | `accordion.tsx` | (미사용) | 아코디언 메뉴 |
| **Alert** | `alert.tsx` | notice | 알림 메시지 |
| **Breadcrumb** | `breadcrumb.tsx` | blog-breadcrumb | 경로 표시 |
| **Pagination** | `pagination.tsx` | blog-pagination | 페이지 네비게이션 |
| **Scroll Area** | `scroll-area.tsx` | (미사용) | 커스텀 스크롤 영역 |
| **Skeleton** | `skeleton.tsx` | blog-post-skeleton | 로딩 스켈레톤 |

### 커스텀 확장 컴포넌트

| 컴포넌트 | 파일 | 상태 | 설명 |
|---------|------|------|------|
| **BlogPostCard** | `blog-post-card.tsx` | ✅ 사용 중 | Card 기반 블로그 포스트 카드 |
| **BlogPagination** | `blog-pagination.tsx` | ✅ 사용 중 | Pagination 기반 블로그 페이지네이션 |
| **BlogBreadcrumb** | `blog-breadcrumb.tsx` | ❌ 미사용 | Breadcrumb 기반 경로 표시 |
| **BlogPostSkeleton** | `blog-post-skeleton.tsx` | ❌ 미사용 | Skeleton 기반 로딩 UI |
| **Notice** | `notice.tsx` | ❌ 미사용 | Alert 기반 공지사항 |
| **CodeCopyButton** | `code-copy-button.tsx` | ✅ 사용 중 | 코드 복사 버튼 |
| **ScrollToTop** | `scroll-to-top.tsx` | ✅ 사용 중 | Button 기반 스크롤 상단 이동 |

### Deprecated 컴포넌트 (Astro로 전환)

| 컴포넌트 | 파일 | 대체 | 이유 |
|---------|------|------|------|
| **BlogSidebar** | `blog-sidebar.tsx` | `Sidebar.astro` | 서버 사이드 렌더링으로 성능 개선 |
| **TableOfContents** | `table-of-contents.tsx` | `TableOfContents.astro` | IntersectionObserver 직접 구현으로 정밀도 향상 |

## 🎨 사용 패턴

### Card + Badge 패턴
```tsx
// 블로그 포스트 카드
<Card>
  <CardHeader>
    <Badge>{category}</Badge>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>{excerpt}</CardContent>
  <CardFooter>{date}</CardFooter>
</Card>
```

### Button 변형
```tsx
// 기본
<Button>Click me</Button>

// Variant
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Size
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Icon with asChild
<Button asChild>
  <a href="/link">Link Button</a>
</Button>
```

### Pagination
```tsx
<BlogPagination
  currentPage={currentPage}
  totalPages={totalPages}
  baseUrl="/blog"
/>
```

## 🔧 통합 기회

### 현재 Astro 컴포넌트를 shadcn/ui로 마이그레이션 가능한 후보

1. **Sidebar** → 현재는 Astro로 구현
   - 고려 사항: 클라이언트 사이드 상태 관리 필요 시
   - 장점: shadcn/ui의 Accordion, ScrollArea 활용 가능
   - 단점: 초기 로딩 시 JavaScript 필요

2. **Header** → 현재는 Astro로 구현
   - 고려 사항: 복잡한 드롭다운 메뉴 추가 시
   - 장점: NavigationMenu 컴포넌트 활용 가능
   - 단점: 고정 헤더에는 현재 방식이 더 효율적

3. **Search** → 현재는 React 컴포넌트
   - 고려 사항: Combobox나 Command 컴포넌트 활용
   - 장점: shadcn/ui의 접근성 기능 활용
   - 단점: Pagefind와의 통합 복잡도

### 추가 설치 고려 컴포넌트

| 컴포넌트 | 용도 | 우선순위 |
|---------|------|---------|
| **Dialog** | 검색 모달, 이미지 라이트박스 | 🔴 높음 |
| **DropdownMenu** | 헤더 메뉴, 설정 메뉴 | 🟡 중간 |
| **Tabs** | 카테고리 탭, 코드 예제 탭 | 🟡 중간 |
| **Sheet** | 모바일 사이드바 | 🟢 낮음 |
| **Tooltip** | 아이콘 설명, 추가 정보 | 🟢 낮음 |

## 📊 사용 통계

### 컴포넌트별 사용 빈도
```
Button      ██████████ (10회)
Card        ████████   (8회)
Badge       ██████     (6회)
Separator   ████       (4회)
Pagination  ██         (2회)
```

### 페이지별 shadcn/ui 사용
- **index.astro**: Card, Badge, Button, Separator (4개)
- **blog/[...page].astro**: BlogPostCard, BlogPagination, Separator (3개)
- **404.astro**: Button (1개)

## 🚀 최적화 제안

### 1. 사용하지 않는 컴포넌트 정리
```bash
# 삭제 고려
rm src/components/ui/blog-sidebar.tsx
rm src/components/ui/table-of-contents.tsx

# 보관 (향후 사용 가능성)
# - blog-breadcrumb.tsx (빵 crumbs 네비게이션 추가 시)
# - blog-post-skeleton.tsx (페이지 전환 로딩 UI)
# - notice.tsx (공지사항 기능 추가 시)
```

### 2. Astro Islands 패턴 최적화
현재 사용 중인 React 컴포넌트들은 `client:load`로 설정되어 있습니다:
- 개선: 뷰포트에 진입할 때만 로드하도록 `client:visible` 사용 고려
- 예: ScrollToTop, BlogPostCard (아래쪽 포스트)

### 3. 번들 크기 최적화
```tsx
// ❌ 나쁜 예: 전체 import
import { Card } from '@/components/ui/card';

// ✅ 좋은 예: 필요한 것만 import (이미 적용됨)
import { Card, CardHeader, CardContent } from '@/components/ui/card';
```

## 📝 문서화 개선 제안

### 1. Storybook 추가
```bash
pnpm add -D @storybook/react @storybook/addon-essentials
```

### 2. 컴포넌트별 사용 예제
각 커스텀 컴포넌트에 JSDoc 주석 추가:
```tsx
/**
 * BlogPostCard - 블로그 포스트 미리보기 카드
 *
 * @example
 * <BlogPostCard
 *   title="제목"
 *   excerpt="요약"
 *   date={new Date()}
 *   slug="post-slug"
 *   categories={["React"]}
 *   tags={["hooks", "tsx"]}
 *   readingTime="5분"
 * />
 */
```

### 3. 접근성 체크리스트
- [ ] 모든 Button에 적절한 aria-label 설정
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 호환성 검증

## 🎯 다음 단계

1. **즉시 실행** (Phase 5.6)
   - [ ] 미사용 컴포넌트 삭제 또는 주석 처리
   - [ ] client:load → client:visible 전환 검토
   - [ ] 타입스크립트 경고 해결 (unused imports)

2. **단기** (1-2주)
   - [ ] Dialog 컴포넌트 추가 (검색 모달)
   - [ ] Breadcrumb 통합 (포스트 페이지)
   - [ ] Skeleton 활용 (페이지 전환 시)

3. **중기** (1개월)
   - [ ] Tabs 컴포넌트 추가 (코드 예제)
   - [ ] Tooltip 추가 (UI 설명)
   - [ ] DropdownMenu 추가 (설정 메뉴)

4. **장기** (3개월+)
   - [ ] Storybook 설정
   - [ ] 컴포넌트 문서화 완성
   - [ ] 접근성 감사 완료

---

*Last Updated: 2025-02-11*
*Maintainer: Claude + Tolerblanc*
