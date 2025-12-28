# 컴포넌트 문서

> **Astro 5 + React 18 + shadcn/ui** 기반 블로그 컴포넌트 가이드

---

## 📂 컴포넌트 구조

```
src/components/
├── Header.astro             # 헤더 레이아웃
├── Sidebar.astro            # 사이드바 레이아웃
├── MobileMenu.tsx           # 모바일 메뉴 (React/Sheet)
├── Search.tsx               # 검색 (React)
│
├── features/                # 기능성 컴포넌트 (Astro)
│   ├── TableOfContents.astro    # 목차
│   ├── ReadingProgress.astro    # 읽기 진행률
│   ├── ScrollToTop.astro        # 맨 위로 이동
│   ├── CodeCopyButton.astro     # 코드 복사
│   ├── GiscusComments.astro     # 댓글
│   ├── Notice.astro             # 알림/콜아웃 (MDX용)
│   ├── PostRecommendations.astro # 게시글 추천
│   └── SeriesNavigation.astro   # 시리즈 네비게이션
│
└── ui/                      # shadcn/ui 기반 컴포넌트
    ├── Core (shadcn/ui)
    │   ├── button.tsx, card.tsx, badge.tsx
    │   ├── sheet.tsx, separator.tsx, skeleton.tsx
    │   ├── pagination.tsx, alert.tsx, accordion.tsx
    │   └── scroll-area.tsx, breadcrumb.tsx
    │
    └── Custom (블로그 전용)
        ├── blog-post-card.tsx      # 포스트 카드
        ├── blog-pagination.tsx     # 블로그 페이지네이션
        ├── blog-breadcrumb.tsx     # 블로그 브레드크럼
        ├── series-card.tsx         # 시리즈 카드
        ├── series-post-list.tsx    # 시리즈 포스트 목록
        └── series-navigation.tsx   # 시리즈 네비게이션 (React)
```

---

## ✍️ MDX 작성용 컴포넌트

포스트 작성(`src/content/blog/**/*.mdx`) 시 다음 컴포넌트들을 별도 import 없이 바로 사용할 수 있습니다.

### Notice (Callout)

중요한 정보, 경고, 팁 등을 강조할 때 사용합니다. `src/components/Notice.astro`

**Props:**
- `type`: `'info'` | `'warning'` | `'danger'` | `'success'` | `'primary'` (기본값: `'info'`)

```mdx
<Notice type="info">
  참고: 이 기능은 베타 버전입니다.
</Notice>
```

### Toggle (Notion-style)

접었다 폈다 할 수 있는 토글 목록입니다. `src/components/mdx/Toggle.astro`

**Props:**
- `title`: 토글 제목 (필수)
- `open`: 기본 열림 상태 (기본값: false)

```mdx
<Toggle title="정답 보기">
  정답은 **Astro**입니다!
</Toggle>
```

### FileTree

프로젝트 폴더 구조를 시각화합니다. `FileTree`, `Folder`, `File` 컴포넌트를 조합하여 사용합니다.

```mdx
<FileTree>
  <Folder name="src" open>
    <Folder name="components">
      <File name="Header.astro" />
      <File name="Footer.astro" />
    </Folder>
    <File name="env.d.ts" />
  </Folder>
  <File name="package.json" />
</FileTree>
```

### Tabs

여러 내용을 탭으로 구분하여 보여줍니다. `Tabs`, `TabItem`을 사용합니다. Vanilla JS로 동작합니다.

**Props (TabItem):**
- `label`: 탭 이름 (필수)
- `value`: 탭 식별자 (선택)

```mdx
<Tabs>
  <TabItem label="npm">
    ```bash
    npm install astro
    ```
  </TabItem>
  <TabItem label="pnpm">
    ```bash
    pnpm add astro
    ```
  </TabItem>
</Tabs>
```

### Steps

단계별 절차를 시각적으로 보여줍니다. 내부의 `h3`(`###`) 또는 `h4`(`####`) 태그를 자동으로 감지하여 번호를 매깁니다.
**Tip:** 목차(TOC)에 포함되지 않게 하려면 `####`를 사용하는 것을 권장합니다.

```mdx
<Steps>
#### 프로젝트 생성
터미널을 열고 명령어를 입력합니다.

#### 의존성 설치
패키지를 설치합니다.

#### 실행
서버를 실행합니다.
</Steps>
```

### Figure

이미지와 캡션을 함께 보여줍니다.

**Props:**
- `src`: 이미지 경로 (필수)
- `alt`: 대체 텍스트 (필수)
- `caption`: 이미지 설명 (선택)

```mdx
<Figure 
  src="/images/architecture.png" 
  alt="시스템 아키텍처" 
  caption="그림 1. 전체 시스템 구조도" 
/>
```

### LinkCard

외부 링크를 풍부한 카드 형태로 보여줍니다.

**Props:**
- `href`: 링크 주소 (필수)
- `title`: 제목 (필수)
- `description`: 설명 (선택)
- `host`: 도메인명 (선택, 자동 추출됨)

```mdx
<LinkCard 
  href="https://astro.build" 
  title="Astro" 
  description="The web framework for content-driven websites." 
/>
```

---

## 🎨 레이아웃 & 네비게이션

### Header.astro

**위치:** `src/components/Header.astro`

**기능:**
- 고정 헤더, 테마 토글
- 모바일 햄버거 메뉴 트리거 (`MobileMenu` 연동)

### Sidebar.astro

**위치:** `src/components/Sidebar.astro`

**기능:**
- 데스크톱용 좌측 고정 사이드바
- 프로필, 카테고리 네비게이션
- 접기/펼치기 기능

### MobileMenu.tsx

**위치:** `src/components/MobileMenu.tsx`

**기능:**
- **Sheet (shadcn/ui)** 컴포넌트 기반 모바일 사이드바
- 네비게이션, 프로필, 최근 글, 카테고리 포함
- 반응형 동작 (모바일에서만 활성화)

---

## ⚙️ 포스트 기능 컴포넌트 (Astro)

### PostRecommendations.astro

**위치:** `src/components/PostRecommendations.astro`

**기능:**
- 현재 포스트 하단에 "추천 게시글" 표시
- **알고리즘**: 같은 카테고리(10점) > 같은 태그(3점) > 최신순(가산점)
- 최대 3개 카드 표시

### SeriesNavigation.astro

**위치:** `src/components/SeriesNavigation.astro`

**기능:**
- 시리즈에 속한 포스트인 경우 상단에 시리즈 목록 표시
- 현재 읽고 있는 포스트 하이라이트
- 전체 목록 보기 링크 제공

### TableOfContents.astro

**위치:** `src/components/TableOfContents.astro`

**기능:**
- 우측 Sticky 목차
- 스크롤 스파이 (현재 섹션 하이라이트)

### ReadingProgress.astro

**위치:** `src/components/ReadingProgress.astro`

**기능:**
- 상단 스크롤 진행률 바 (그라데이션)

### CodeCopyButton.astro

**위치:** `src/components/CodeCopyButton.astro`

**기능:**
- 코드 블록 우상단 복사 버튼 자동 삽입

### GiscusComments.astro

**위치:** `src/components/GiscusComments.astro`

**기능:**
- GitHub Discussions 기반 댓글

---

## 🧩 UI 컴포넌트 (Custom Extensions)

### SeriesCard

**위치:** `src/components/ui/series-card.tsx`

**사용처:** `/series` 페이지
**기능:**
- 시리즈 정보 카드 (제목, 설명, 포스트 수)
- 호버 인터랙션

### SeriesPostList

**위치:** `src/components/ui/series-post-list.tsx`

**사용처:** `/series/[slug]` 페이지
**기능:**
- 특정 시리즈의 포스트 목록 표시
- 정렬 기능 (순서대로, 최신순, 과거순)
- 순서 배지 표시

### BlogPostCard

**위치:** `src/components/ui/blog-post-card.tsx`

**기능:**
- 포스트 요약 카드
- 카테고리, 태그, 날짜, 읽는 시간 표시

---

## 🧩 shadcn/ui Core Components

주요 사용 컴포넌트 목록입니다. 필요 시 `npx shadcn-ui@latest add [name]`으로 추가 설치 가능합니다.

| 컴포넌트 | 파일 | 용도 |
| --- | --- | --- |
| **Button** | `ui/button.tsx` | 버튼 (Variants: default, outline, ghost 등) |
| **Card** | `ui/card.tsx` | 콘텐츠 컨테이너 |
| **Badge** | `ui/badge.tsx` | 카테고리, 태그 라벨 |
| **Sheet** | `ui/sheet.tsx` | 모바일 메뉴, 사이드 패널 |
| **Separator** | `ui/separator.tsx` | 구분선 |
| **Skeleton** | `ui/skeleton.tsx` | 로딩 상태 |
| **ScrollArea** | `ui/scroll-area.tsx` | 커스텀 스크롤 영역 |
| **Alert** | `ui/alert.tsx` | 알림 메시지 (Notice 구현에 사용) |

---

## ❌ Deprecated / Legacy

다음 컴포넌트들은 마이그레이션 되었거나 더 이상 직접 사용되지 않을 수 있습니다.

- `ui/blog-sidebar.tsx` → `Sidebar.astro` 로 대체됨
- `ui/table-of-contents.tsx` → `TableOfContents.astro` 로 대체됨
- `ui/scroll-to-top.tsx` → `ScrollToTop.astro` 로 대체됨
- `ui/code-copy-button.tsx` → `CodeCopyButton.astro` 로 대체됨
- `ui/notice.tsx` → `Notice.astro` 로 대체됨

---

**Last Updated:** 2025-12-28
