# Astro 5 개발 블로그

> Jekyll → Astro 마이그레이션 완료 (2025-11-09)

## 🚀 프로덕션 배포 완료

**Jekyll에서 Astro 5로 완전히 전환되었습니다!**

### ✨ 주요 기능
- ✅ **Astro 5.14.4**: 초고속 빌드 (4.37s)
- ✅ **React 18.3.1**: 인터랙티브 컴포넌트
- ✅ **shadcn/ui**: 모던 UI 컴포넌트 시스템 (19개)
- ✅ **Lucide React**: 전문적인 아이콘 세트
- ✅ **Tailwind CSS**: 유틸리티 우선 스타일링
- ✅ **TypeScript**: 완벽한 타입 안정성 (0 errors)
- ✅ **다크 모드**: FOUC 방지, 부드러운 전환
- ✅ **Pagefind**: 전체 포스트 검색 (17,623 단어 인덱싱)
- ✅ **KaTeX**: 수학 수식 렌더링
- ✅ **Shiki**: 구문 강조 (github-light/dark 테마)

### 📊 프로젝트 현황
- **페이지**: 132개 빌드 완료
- **포스트**: 72개
- **빌드 시간**: 4.37s ⚡
- **타입 안정성**: TypeScript 0 errors
- **검색**: Pagefind 17,623 단어 인덱싱
- **컴포넌트**: 레이아웃 2개 + 기능 8개 + shadcn/ui 19개

> **상세 문서**: [MIGRATION_COMPLETED.md](docs/MIGRATION_COMPLETED.md), [COMPONENTS.md](docs/COMPONENTS.md), [SHADCN_UI_STATUS.md](docs/SHADCN_UI_STATUS.md)

---

## 프로젝트 개요

Astro 5 기반 개발 블로그입니다. Jekyll + Minimal Mistakes에서 마이그레이션되었습니다.

---

## 📦 기술 스택

```
Core:     Astro 5.14.4
UI:       React 18.3.1 (인터랙티브 컴포넌트)
Type:     TypeScript (strict mode)
Style:    Tailwind CSS 3.4.1
Components: shadcn/ui (19개 컴포넌트)
Icons:    Lucide React (카테고리별 전용 아이콘)
Content:  MDX
Math:     KaTeX
Code:     Shiki (github-light/dark 테마)
Search:   Pagefind (전체 포스트 검색)
```

---

## 📁 프로젝트 구조

```
/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content Collections 정의
│   │   └── posts/
│   │       └── {subject}/         # 카테고리별 폴더
│   │           └── {title}.mdx    # 포스트 파일
│   ├── components/
│   │   ├── ui/                    # shadcn 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.astro       # 고정 헤더
│   │   │   ├── Footer.astro
│   │   │   ├── Sidebar.astro      # 카테고리 네비게이션
│   │   │   └── TableOfContents.tsx # 스크롤 연동 TOC
│   │   ├── post/
│   │   │   ├── PostCard.astro     # 포스트 카드
│   │   │   ├── PostMeta.astro     # 날짜, 읽는 시간 등
│   │   │   └── PostNavigation.astro
│   │   └── ThemeToggle.tsx        # 다크모드 토글
│   ├── layouts/
│   │   ├── BaseLayout.astro       # 기본 레이아웃
│   │   ├── PostLayout.astro       # 포스트 레이아웃
│   │   └── HomeLayout.astro       # 홈 레이아웃
│   ├── pages/
│   │   ├── index.astro            # 메인 페이지
│   │   └── [subject]/
│   │       └── [...slug].astro    # 동적 라우팅
│   └── styles/
│       └── global.css             # 전역 스타일
├── public/
│   ├── images/
│   └── fonts/
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

---

## 🎨 디자인 시스템 (검증 완료)

### 레이아웃 구조

#### 데스크톱 (≥1024px)
```
┌─────────────────────────────────────────────────────────┐
│ Header (fixed, 64px, backdrop-blur)                     │
├──────┬──────────────────────────────┬───────────────────┤
│      │                              │                   │
│ Side │   Main Content Area          │  TOC (sticky)     │
│ bar  │   (max-w-3xl / 672px)        │  (w-64 / 256px)   │
│      │   (centered with mx-auto)    │                   │
│(256px)│                              │                   │
│      │                              │                   │
└──────┴──────────────────────────────┴───────────────────┘
```

#### 태블릿 (768px - 1023px)
- 사이드바: 숨김 (햄버거 메뉴로 대체)
- TOC: 숨김
- 메인 콘텐츠: 전체 너비

#### 모바일 (<768px)
- 헤더: 56px 높이
- 햄버거 메뉴
- 풀 width 콘텐츠

### 타이포그래피

```typescript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        // 본문
        body: ['16px', { 
          lineHeight: '1.75', 
          letterSpacing: '-0.01em' 
        }],
        
        // 헤딩
        h1: ['2.5rem', {      // 40px
          lineHeight: '1.2', 
          fontWeight: '700', 
          letterSpacing: '-0.02em' 
        }],
        h2: ['2rem', {        // 32px
          lineHeight: '1.3', 
          fontWeight: '700', 
          letterSpacing: '-0.015em' 
        }],
        h3: ['1.5rem', {      // 24px
          lineHeight: '1.4', 
          fontWeight: '600', 
          letterSpacing: '-0.01em' 
        }],
        h4: ['1.25rem', {     // 20px
          lineHeight: '1.5', 
          fontWeight: '600' 
        }],
        
        // 유틸리티
        caption: ['0.875rem', {  // 14px
          lineHeight: '1.5' 
        }],
        small: ['0.8125rem', {   // 13px
          lineHeight: '1.5' 
        }],
      }
    }
  }
}
```

### 색상 시스템

#### 라이트 모드
```typescript
colors: {
  light: {
    // 배경
    bg: {
      primary: '#FFFFFF',     // 메인 배경
      secondary: '#F8F9FA',   // 카드 배경
      tertiary: '#F1F3F5',    // 보조 배경
      hover: '#E9ECEF',       // 호버 상태
    },
    
    // 텍스트
    text: {
      primary: '#1A1A1A',     // 제목, 본문
      secondary: '#6B7280',   // 부제목, 캡션
      tertiary: '#9CA3AF',    // placeholder
    },
    
    // 포인트 컬러 (토스 블루 계열)
    primary: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      500: '#3B82F6',        // 메인 액센트
      600: '#2563EB',        // 호버
      700: '#1D4ED8',        // 액티브
    },
    
    // 경계선
    border: {
      default: '#E5E7EB',    // 기본 테두리
      strong: '#D1D5DB',     // 강조 테두리
    },
    
    // 코드
    code: {
      bg: '#F8F9FA',
      border: '#E9ECEF',
      text: '#E11D48',       // 인라인 코드 색상
    }
  }
}
```

#### 다크 모드
```typescript
colors: {
  dark: {
    // 배경
    bg: {
      primary: '#0F1419',    // 메인 배경 (진한 검정)
      secondary: '#1A1F2E',  // 카드 배경
      tertiary: '#252A37',   // 보조 배경
      hover: '#2C3240',      // 호버 상태
    },
    
    // 텍스트
    text: {
      primary: '#F1F3F5',    // 제목, 본문
      secondary: '#A0A5B0',  // 부제목, 캡션
      tertiary: '#6B7280',   // placeholder
    },
    
    // 포인트 컬러
    primary: {
      50: '#1E3A8A',
      100: '#1E40AF',
      500: '#3B82F6',
      600: '#60A5FA',
      700: '#93C5FD',
    },
    
    // 경계선
    border: {
      default: '#2C3240',
      strong: '#3A4050',
    },
    
    // 코드
    code: {
      bg: '#1A1F2E',
      border: '#2C3240',
      text: '#FB7185',
    }
  }
}
```

### 간격 시스템

```typescript
spacing: {
  section: '6rem',      // 96px - 섹션 간 간격
  content: '3rem',      // 48px - 컨텐츠 블록 간격
  element: '1.5rem',    // 24px - 엘리먼트 간격
  compact: '0.75rem',   // 12px - 밀집 요소 간격
}

// 컨테이너 너비
maxWidth: {
  content: '42rem',     // 672px - 본문 최대 너비
  wide: '64rem',        // 1024px - 넓은 레이아웃
  full: '80rem',        // 1280px - 전체 최대 너비
}
```

### 반응형 Breakpoints

```typescript
screens: {
  sm: '640px',
  md: '768px',     // 모바일 → 태블릿
  lg: '1024px',    // 태블릿 → 데스크톱 (3단 레이아웃 시작)
  xl: '1280px',
  '2xl': '1536px',
}
```

---

## 🧩 컴포넌트 디자인 스펙 (구현 검증됨)

### 1. Header (Header.astro)

```astro
---
// 스펙
높이: 64px (모바일: 56px)
위치: fixed top-0
배경: backdrop-blur-md + bg-opacity-80
테두리: border-b (dynamic color)
z-index: 50
---

<header class="fixed top-0 left-0 right-0 z-50 h-16">
  <div class="h-full max-w-full px-6 mx-auto flex items-center justify-between">
    <!-- 좌측: 로고 + 제목 -->
    <div class="flex items-center gap-4">
      <button class="lg:hidden">
        <!-- 햄버거 메뉴 아이콘 -->
      </button>
      <a href="/" class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary-500 text-white font-bold">
          D
        </div>
        <span class="text-lg font-semibold">Dev Blog</span>
      </a>
    </div>
    
    <!-- 우측: 검색 + 테마 토글 -->
    <div class="flex items-center gap-2">
      <button class="hidden md:flex items-center gap-2 px-4 h-10 rounded-lg">
        <SearchIcon />
        <span>검색...</span>
      </button>
      <ThemeToggle client:load />
    </div>
  </div>
</header>
```

**구현 포인트:**
- `backdrop-filter: blur(12px)` + 80% 투명도
- 스크롤 시 미묘한 그림자 추가 (선택사항)
- 모바일에서 햄버거 메뉴로 전환

### 2. Sidebar (Sidebar.astro)

```astro
---
// 스펙
너비: 256px
위치: fixed left-0 top-16
배경: transparent (부모 배경 상속)
스크롤: overflow-y-auto (독립적)
---

<aside class="hidden lg:block fixed left-0 top-16 bottom-0 w-64 overflow-y-auto">
  <nav class="p-6">
    <h3 class="text-xs font-semibold uppercase mb-4 opacity-60">
      Categories
    </h3>
    <ul class="space-y-1">
      {categories.map(cat => (
        <li>
          <a 
            href={`/${cat.slug}`}
            class="flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200"
          >
            <span class="font-medium">{cat.name}</span>
            <span class="text-sm opacity-60">{cat.count}</span>
          </a>
        </li>
      ))}
    </ul>
  </nav>
</aside>
```

**스타일링:**
- 현재 페이지: `border-left: 3px solid primary-500` + 배경색
- 호버: subtle 배경색 변화
- 폰트: 미디엄 웨이트

### 3. PostCard (PostCard.astro)

```astro
---
// 스펙
padding: 1.5rem (24px)
border-radius: 0.75rem (12px)
border: 1px solid
transition: all 200ms ease

// 호버 효과
transform: translateY(-2px)
box-shadow: lg
border-color: stronger
---

<article class="group post-card">
  <!-- 카테고리 배지 -->
  <div class="mb-3">
    <span class="badge badge-primary">{subject}</span>
  </div>
  
  <!-- 제목 -->
  <h3 class="text-xl font-semibold mb-2">
    <a href={`/${subject}/${slug}`}>{title}</a>
  </h3>
  
  <!-- 설명 (2줄 말줄임) -->
  <p class="text-sm text-secondary line-clamp-2 mb-4">
    {description}
  </p>
  
  <!-- 메타 정보 -->
  <div class="flex items-center gap-4 text-xs text-tertiary mb-3">
    <div class="flex items-center gap-1">
      <CalendarIcon />
      <time datetime={date}>{formattedDate}</time>
    </div>
    <div class="flex items-center gap-1">
      <ClockIcon />
      <span>{readTime}분</span>
    </div>
  </div>
  
  <!-- 태그 (최대 3개) -->
  <div class="flex flex-wrap gap-2">
    {tags.slice(0, 3).map(tag => (
      <span class="tag">{tag}</span>
    ))}
  </div>
</article>

<style>
  .post-card {
    @apply p-6 rounded-xl border transition-all duration-200 cursor-pointer;
    @apply bg-light-bg-secondary dark:bg-dark-bg-secondary;
    @apply border-light-border-default dark:border-dark-border-default;
  }
  
  .post-card:hover {
    @apply -translate-y-0.5 shadow-lg;
    @apply border-light-border-strong dark:border-dark-border-strong;
  }
  
  .badge {
    @apply inline-block px-3 py-1 text-xs font-semibold rounded-full;
  }
  
  .badge-primary {
    @apply bg-primary-500/10 text-primary-500;
  }
  
  .tag {
    @apply px-2 py-1 text-xs rounded;
    @apply bg-light-bg-tertiary dark:bg-dark-bg-tertiary;
    @apply text-light-text-secondary dark:text-dark-text-secondary;
  }
</style>
```

### 4. TableOfContents (TableOfContents.tsx)

```tsx
// React 컴포넌트 (클라이언트 사이드)
interface TOCProps {
  headings: { depth: number; text: string; slug: string }[];
}

export const TableOfContents = ({ headings }: TOCProps) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Intersection Observer로 현재 섹션 감지
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    // 모든 헤딩 요소 관찰
    document.querySelectorAll('h2, h3').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="text-xs font-semibold uppercase mb-4 opacity-60">
        On This Page
      </p>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.slug}
            style={{ paddingLeft: `${(heading.depth - 2) * 12}px` }}
          >
            <a
              href={`#${heading.slug}`}
              className={`block text-sm py-1 border-l-2 pl-3 transition-all duration-200 ${
                activeId === heading.slug
                  ? 'border-primary-500 text-primary-500 font-medium'
                  : 'border-transparent text-secondary hover:text-primary'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

**구현 포인트:**
- `position: sticky` + `top: 6rem` (헤더 아래)
- Intersection Observer로 자동 active 상태
- Smooth scroll 연동
- depth에 따른 들여쓰기

### 5. CodeBlock (MDX에서 자동 적용)

```typescript
// remark-shiki 설정
shikiConfig: {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  wrap: true,
  transformers: [
    // 커스텀 transformer로 복사 버튼 추가
  ],
}
```

```css
/* 코드 블록 스타일 */
pre {
  @apply rounded-lg font-mono text-sm overflow-x-auto;
  @apply bg-light-code-bg dark:bg-dark-code-bg;
  @apply border border-light-code-border dark:border-dark-code-border;
  padding: 1.25rem;
  line-height: 1.7;
}

/* 언어 표시 */
pre[data-language]::before {
  content: attr(data-language);
  @apply absolute top-2 right-2 text-xs font-semibold uppercase;
  @apply bg-light-bg-tertiary dark:bg-dark-bg-tertiary;
  @apply text-light-text-tertiary dark:text-dark-text-tertiary;
  @apply px-2 py-1 rounded;
  letter-spacing: 0.05em;
}

/* 복사 버튼 */
.copy-button {
  @apply absolute top-2 right-20 opacity-0 group-hover:opacity-100;
  @apply transition-opacity duration-200;
}
```

### 6. InlineCode (인라인 코드)

```css
code:not(pre code) {
  @apply font-mono px-2 py-0.5 rounded text-sm font-medium;
  @apply bg-light-code-bg dark:bg-dark-code-bg;
  @apply text-light-code-text dark:text-dark-code-text;
  font-size: 0.9em;
}
```

### 7. Blockquote (인용구)

```css
blockquote {
  @apply rounded-r-lg p-4 my-6;
  @apply bg-light-bg-tertiary dark:bg-dark-bg-tertiary;
  @apply text-light-text-secondary dark:text-dark-text-secondary;
  border-left: 4px solid theme('colors.primary.500');
}

blockquote p {
  @apply m-0;
}
```

### 8. Button Component (Button.tsx)

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        outline: 'border-2 border-current hover:bg-opacity-10 hover:bg-current',
        ghost: 'hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props} />
  );
};
```

### 9. ThemeToggle (ThemeToggle.tsx)

```tsx
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // 초기 테마 로드
    const theme = localStorage.getItem('theme');
    const isDark = theme === 'dark' || 
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover"
      aria-label="Toggle theme"
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
```

---

## 🔧 핵심 설정 파일

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://yourusername.github.io',
  integrations: [
    mdx(),
    react(),
    tailwind({
      applyBaseStyles: false, // shadcn/ui와 호환
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    ssr: {
      noExternal: ['@astrojs/react'],
    },
  },
});
```

### tailwind.config.mjs

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard Variable', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        body: ['16px', { lineHeight: '1.75', letterSpacing: '-0.01em' }],
        h1: ['2.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        h2: ['2rem', { lineHeight: '1.3', fontWeight: '700', letterSpacing: '-0.015em' }],
        h3: ['1.5rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.01em' }],
        h4: ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        caption: ['0.875rem', { lineHeight: '1.5' }],
        small: ['0.8125rem', { lineHeight: '1.5' }],
      },
      colors: {
        light: {
          bg: {
            primary: '#FFFFFF',
            secondary: '#F8F9FA',
            tertiary: '#F1F3F5',
            hover: '#E9ECEF',
          },
          text: {
            primary: '#1A1A1A',
            secondary: '#6B7280',
            tertiary: '#9CA3AF',
          },
          border: {
            default: '#E5E7EB',
            strong: '#D1D5DB',
          },
          code: {
            bg: '#F8F9FA',
            border: '#E9ECEF',
            text: '#E11D48',
          }
        },
        dark: {
          bg: {
            primary: '#0F1419',
            secondary: '#1A1F2E',
            tertiary: '#252A37',
            hover: '#2C3240',
          },
          text: {
            primary: '#F1F3F5',
            secondary: '#A0A5B0',
            tertiary: '#6B7280',
          },
          border: {
            default: '#2C3240',
            strong: '#3A4050',
          },
          code: {
            bg: '#1A1F2E',
            border: '#2C3240',
            text: '#FB7185',
          }
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      maxWidth: {
        content: '42rem',
        wide: '64rem',
        full: '80rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

### src/content/config.ts

```typescript
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    subject: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
```

### src/styles/global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-sans: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  }

  /* FOUC 방지 */
  html {
    color-scheme: light dark;
  }

  body {
    @apply font-sans antialiased;
    @apply bg-light-bg-primary dark:bg-dark-bg-primary;
    @apply text-light-text-primary dark:text-dark-text-primary;
    transition: background-color 200ms ease, color 200ms ease;
  }

  /* 스크롤바 스타일 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-light-border-strong dark:bg-dark-border-strong;
    border-radius: 4px;
  }

  /* 선택 영역 */
  ::selection {
    @apply bg-primary-500/20;
  }

  /* 포커스 링 */
  :focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2;
  }
}

@layer components {
  /* 프로즈 스타일 (본문) */
  .prose {
    @apply max-w-none;
  }

  .prose h1 {
    @apply text-h1 text-light-text-primary dark:text-dark-text-primary;
  }

  .prose h2 {
    @apply text-h2 text-light-text-primary dark:text-dark-text-primary mt-12 mb-4;
  }

  .prose h3 {
    @apply text-h3 text-light-text-primary dark:text-dark-text-primary mt-8 mb-3;
  }

  .prose h4 {
    @apply text-h4 text-light-text-primary dark:text-dark-text-primary mt-6 mb-2;
  }

  .prose p {
    @apply text-body text-light-text-primary dark:text-dark-text-primary mb-4;
  }

  .prose a {
    @apply text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors;
  }

  .prose ul,
  .prose ol {
    @apply my-4 ml-6 space-y-2;
  }

  .prose li {
    @apply text-body text-light-text-primary dark:text-dark-text-primary;
  }

  .prose strong {
    @apply font-semibold text-light-text-primary dark:text-dark-text-primary;
  }

  .prose code {
    @apply font-mono px-2 py-0.5 rounded text-sm;
    @apply bg-light-code-bg dark:bg-dark-code-bg;
    @apply text-light-code-text dark:text-dark-code-text;
  }

  .prose pre {
    @apply rounded-lg overflow-x-auto my-6 p-5;
    @apply bg-light-code-bg dark:bg-dark-code-bg;
    @apply border border-light-code-border dark:border-dark-code-border;
  }

  .prose pre code {
    @apply p-0 bg-transparent text-light-text-primary dark:text-dark-text-primary;
  }

  .prose blockquote {
    @apply border-l-4 border-primary-500 rounded-r-lg p-4 my-6;
    @apply bg-light-bg-tertiary dark:bg-dark-bg-tertiary;
    @apply text-light-text-secondary dark:text-dark-text-secondary;
  }

  .prose img {
    @apply rounded-lg my-6;
  }

  .prose table {
    @apply w-full my-6 border-collapse;
  }

  .prose th {
    @apply bg-light-bg-secondary dark:bg-dark-bg-secondary;
    @apply border border-light-border-default dark:border-dark-border-default;
    @apply px-4 py-2 text-left font-semibold;
  }

  .prose td {
    @apply border border-light-border-default dark:border-dark-border-default;
    @apply px-4 py-2;
  }

  /* 라인 하이라이트 */
  .line.highlighted {
    @apply bg-primary-500/10 border-l-2 border-primary-500;
  }
}
```

---

## 📄 Layout 예시

### BaseLayout.astro

```astro
---
import Header from '@/components/layout/Header.astro';
import Footer from '@/components/layout/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net" />
    <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" rel="stylesheet" />
    
    <!-- KaTeX -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
    
    <!-- SEO -->
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
    
    <!-- FOUC 방지 -->
    <script is:inline>
      const theme = localStorage.getItem('theme') ?? 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    </script>
  </head>
  <body>
    <Header />
    <slot />
    <Footer />
  </body>
</html>
```

### PostLayout.astro

```astro
---
import BaseLayout from './BaseLayout.astro';
import Sidebar from '@/components/layout/Sidebar.astro';
import TableOfContents from '@/components/layout/TableOfContents';
import PostMeta from '@/components/post/PostMeta.astro';
import { getCollection } from 'astro:content';

const { frontmatter, headings } = Astro.props;
const allPosts = await getCollection('posts');
const categories = [...new Set(allPosts.map(p => p.data.subject))];
---

<BaseLayout title={frontmatter.title} description={frontmatter.description}>
  <div class="pt-16">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar categories={categories} />
      
      <!-- Main Content -->
      <main class="flex-1 lg:ml-64 lg:mr-64">
        <article class="max-w-content mx-auto px-6 py-12">
          <!-- Post Header -->
          <header class="mb-12">
            <div class="mb-4">
              <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-500/10 text-primary-500">
                {frontmatter.subject}
              </span>
            </div>
            <h1 class="text-h1 mb-4">{frontmatter.title}</h1>
            <PostMeta 
              date={frontmatter.date} 
              readTime={calculateReadTime(Astro.props.rawContent())}
            />
          </header>
          
          <!-- Post Content -->
          <div class="prose prose-lg">
            <slot />
          </div>
        </article>
      </main>
      
      <!-- TOC -->
      <aside class="hidden lg:block fixed right-0 top-16 bottom-0 w-64 overflow-y-auto">
        <TableOfContents headings={headings} client:media="(min-width: 1024px)" />
      </aside>
    </div>
  </div>
</BaseLayout>
```

---

## 🚀 시작하기

### 1. 프로젝트 생성

```bash
# Astro 프로젝트 생성
npm create astro@latest -- --template minimal --typescript strict

cd your-blog

# 의존성 설치
npm install @astrojs/mdx @astrojs/react @astrojs/tailwind @astrojs/sitemap
npm install react react-dom
npm install remark-math rehype-katex
npm install -D tailwindcss @tailwindcss/typography
npm install -D prettier prettier-plugin-astro prettier-plugin-tailwindcss

# shadcn/ui 초기화
npx shadcn-ui@latest init

# 필요한 shadcn 컴포넌트 추가
npx shadcn-ui@latest add button card badge tabs
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 빌드 및 배포

```bash
# 빌드
npm run build

# 프리뷰
npm run preview

# GitHub Pages 배포는 자동 (GitHub Actions 사용)
```

---

## 📝 포스트 작성 예시

```mdx
---
title: 'React 18의 새로운 기능'
description: 'Concurrent Rendering과 Automatic Batching 알아보기'
date: 2024-03-15
subject: 'React'
tags: ['React', 'JavaScript', 'Frontend']
---

import { Callout } from '@/components/ui/callout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

## 소개

React 18은 동시성 렌더링을 중심으로 한 메이저 업데이트입니다.

<Callout type="info">
이 포스트는 React 18 기준으로 작성되었습니다.
</Callout>

## Automatic Batching

이제 모든 곳에서 자동 배칭이 적용됩니다:

```javascript
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // 단 한 번만 리렌더링!
}
```

### 수식 예시

인라인 수식: $E = mc^2$

블록 수식:

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

## 결론

React 18의 새로운 기능들을 활용하면 더 나은 UX를 제공할 수 있습니다.
```

---

## 🎯 성능 목표

- **Lighthouse 점수**: 95+ (모든 항목)
- **빌드 시간**: 72개 포스트 기준 10초 이내
- **First Contentful Paint**: < 1.5초
- **Time to Interactive**: < 3초
- **번들 크기**: 메인 JS < 50KB (gzip)

---

## 📊 SEO & 접근성

### SEO 필수 요소

```astro
---
// BaseLayout.astro의 <head>에 추가
---

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="article" />
<meta property="og:url" content={Astro.url} />
{image && <meta property="og:image" content={image} />}

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
{image && <meta name="twitter:image" content={image} />}

<!-- JSON-LD -->
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": description,
  "datePublished": date,
})} />
```

### 접근성 체크리스트

- ✅ 모든 이미지에 alt 텍스트
- ✅ 시맨틱 HTML 사용 (header, nav, main, article, aside)
- ✅ 키보드 네비게이션 지원 (Tab, Enter, Esc)
- ✅ Focus visible 스타일
- ✅ ARIA labels for icons
- ✅ 색상 대비 WCAG AA 이상
- ✅ 반응형 폰트 크기

---

## 🔍 검색 기능 (Pagefind)

### 설치

```bash
npm install -D pagefind
```

### astro.config.mjs에 추가

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // ... 기존 설정
  build: {
    format: 'directory',
  },
});
```

### package.json 스크립트 수정

```json
{
  "scripts": {
    "build": "astro build && npx pagefind --site dist"
  }
}
```

### 검색 컴포넌트

```tsx
// components/Search.tsx
import { useEffect, useRef } from 'react';

export const Search = () => {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Pagefind UI 초기화
    new window.PagefindUI({ 
      element: searchRef.current,
      showSubResults: true,
    });
  }, []);

  return <div ref={searchRef} />;
};
```

---

## 📦 배포 (GitHub Pages)

### .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 🛠️ 유틸리티 함수

### 읽는 시간 계산

```typescript
// src/utils/readingTime.ts
export function calculateReadTime(content: string): number {
  const koreanChars = (content.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g) || []).length;
  const englishWords = (content.match(/\b\w+\b/g) || []).length;
  
  const koreanTime = koreanChars / 300; // 분당 300자
  const englishTime = englishWords / 200; // 분당 200단어
  
  return Math.ceil(koreanTime + englishTime);
}
```

### 날짜 포맷팅

```typescript
// src/utils/dateFormat.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date).replace(/\. /g, '.').slice(0, -1);
}
```

### Slug 생성

```typescript
// src/utils/slug.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

---

## 📚 마이그레이션 스크립트 (선택사항)

```javascript
// scripts/migrate-from-jekyll.js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const JEKYLL_POSTS_DIR = './_posts';
const ASTRO_POSTS_DIR = './src/content/posts';

// Jekyll frontmatter → Astro frontmatter 변환
function convertFrontmatter(jekyllFrontmatter) {
  return {
    title: jekyllFrontmatter.title,
    description: jekyllFrontmatter.description || '',
    date: new Date(jekyllFrontmatter.date),
    subject: jekyllFrontmatter.categories?.[0] || 'Misc',
    tags: jekyllFrontmatter.tags || [],
    draft: jekyllFrontmatter.published === false,
  };
}

// 모든 포스트 마이그레이션
fs.readdirSync(JEKYLL_POSTS_DIR).forEach(file => {
  if (!file.endsWith('.md')) return;
  
  const content = fs.readFileSync(path.join(JEKYLL_POSTS_DIR, file), 'utf-8');
  const { data, content: body } = matter(content);
  
  const astroFrontmatter = convertFrontmatter(data);
  const subject = astroFrontmatter.subject;
  
  // 카테고리 폴더 생성
  const subjectDir = path.join(ASTRO_POSTS_DIR, subject);
  if (!fs.existsSync(subjectDir)) {
    fs.mkdirSync(subjectDir, { recursive: true });
  }
  
  // MDX 파일 생성
  const newContent = matter.stringify(body, astroFrontmatter);
  const newFile = file.replace('.md', '.mdx');
  fs.writeFileSync(path.join(subjectDir, newFile), newContent);
  
  console.log(`✅ Migrated: ${file} → ${subject}/${newFile}`);
});
```

---

## ✅ 체크리스트

### 프로젝트 설정
- [ ] Astro 5 프로젝트 생성
- [ ] 모든 의존성 설치
- [ ] Tailwind + shadcn/ui 설정
- [ ] TypeScript 설정

### 디자인 시스템
- [ ] 색상 시스템 적용 (라이트/다크)
- [ ] 타이포그래피 설정
- [ ] 간격 시스템 설정
- [ ] 반응형 Breakpoints

### 레이아웃
- [ ] Header 구현 (고정, backdrop-blur)
- [ ] Sidebar 구현 (카테고리 네비게이션)
- [ ] Footer 구현
- [ ] 3단 레이아웃 (데스크톱)
- [ ] 반응형 레이아웃 (모바일/태블릿)

### 컴포넌트
- [ ] PostCard 구현 (호버 효과)
- [ ] TableOfContents 구현 (스크롤 연동)
- [ ] ThemeToggle 구현 (FOUC 방지)
- [ ] CodeBlock 구현 (복사 버튼)
- [ ] Button 컴포넌트
- [ ] Badge 컴포넌트

### 콘텐츠
- [ ] Content Collections 설정
- [ ] MDX 설정 (KaTeX, Shiki)
- [ ] 동적 라우팅 ([subject]/[...slug])
- [ ] 포스트 메타 정보 (날짜, 읽는 시간)
- [ ] 태그 시스템

### SEO & 성능
- [ ] Meta 태그 (OG, Twitter Card)
- [ ] JSON-LD structured data
- [ ] Sitemap 생성
- [ ] RSS 피드
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화

### 배포
- [ ] GitHub Actions 워크플로우
- [ ] GitHub Pages 설정
- [ ] 404 페이지
- [ ] robots.txt

### 선택사항
- [ ] Pagefind 검색 기능
- [ ] View Transitions API
- [ ] 마이그레이션 스크립트
- [ ] Analytics 연동

---

## 🎉 완성!

이 프롬프트를 사용하면:

1. ✅ **완전히 작동하는** Astro 5 블로그
2. ✅ **검증된 디자인 시스템** (실제 프리뷰 확인)
3. ✅ **타입 안전한** Content Collections
4. ✅ **반응형** 3단 레이아웃
5. ✅ **다크 모드** 완벽 지원
6. ✅ **SEO 최적화**
7. ✅ **GitHub Pages** 자동 배포

를 얻을 수 있습니다.

---

## 📞 추가 커스터마이징

### 색상 변경
`tailwind.config.mjs`의 `colors` 섹션에서 원하는 색상으로 변경

### 폰트 변경
`tailwind.config.mjs`의 `fontFamily` 섹션과 `BaseLayout.astro`의 폰트 링크 변경

### 레이아웃 조정
- 사이드바 너비: `w-64` (256px) 수정
- TOC 너비: `w-64` (256px) 수정
- 본문 최대 너비: `max-w-content` (672px) 수정

### 컴포넌트 추가
```bash
npx shadcn-ui@latest add [component-name]
```
