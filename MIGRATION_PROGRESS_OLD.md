# Jekyll → Astro 마이그레이션 진행 상황

> **최종 업데이트**: 2025-10-26 (Phase 7 완료)
> **현재 브랜치**: `astro-experimental`
> **진행 상태**: Phase 1-7 완료 ✅ | Phase 6, 8, 9 진행 예정
> **Astro 버전**: 5.14.4 (Content Layer API, Vite 6)
> **변환 현황**: 56개 포스트 빌드 성공 / 17개 draft
> **빌드 성능**: 124 pages in 3.21s | 번들 크기 143.47 KB

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [완료된 작업 요약 (Phase 1-7)](#완료된-작업-요약-phase-1-7)
3. [남은 작업 계획 (Phase 6, 8, 9)](#남은-작업-계획-phase-6-8-9)
4. [우선순위 제안](#우선순위-제안)
5. [기술 스택 비교](#기술-스택-비교)
6. [파일 구조 매핑](#파일-구조-매핑)
7. [배포 전략](#배포-전략)

---

## 프로젝트 개요

### 현재 상태
- **사이트**: https://tolerblanc.github.io
- **포스트 수**: 75개 이상의 한국어 기술 문서
- **테마**: minimal-mistakes-jekyll v4.24.0
- **트래픽**: 상당량의 유기적 트래픽 (SEO 유지 필수)

### 마이그레이션 목표
1. **Ruby 의존성 제거** → JavaScript/TypeScript 생태계
2. **개발 경험 개선** → 빠른 빌드, 핫 리로드, 타입 안정성
3. **확장성 강화** → MDX 기반 커스텀 컴포넌트
4. **SEO 100% 보존** → URL, 메타데이터, Analytics 유지
5. **실험적 접근** → `/experimental` 배포 후 점진적 전환

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

#### Phase 2: 콘텐츠 마이그레이션 시스템 ✅ **완료**
- [x] Jekyll → MDX 변환 스크립트 작성 (`src/utils/jekyll-to-mdx.ts`)
- [x] frontmatter 매핑 유틸리티 (Jekyll → Astro schema)
- [x] 샘플 포스트 5개 변환 및 검증
- [x] Notice 컴포넌트 구현 (4 types)
- [x] PostLayout 구현 (SEO, TOC, 메타데이터)
- [x] 동적 라우팅 설정 (`/blog/[...slug]`)
- [x] Tailwind CSS 통합 및 한국어 폰트 최적화
- [x] 렌더링 검증 (0 errors, 0 warnings)

#### Phase 3: 핵심 기능 및 LaTeX 지원 ✅ **완료**
- [x] **LaTeX 수식 렌더링 시스템**
  - [x] KaTeX 통합 (remark-math + rehype-katex)
  - [x] Inline 수식 지원 (`$...$` 및 `\\(...\\)`)
  - [x] Block 수식 지원 (`$$...$$` 및 `\\[...\\]`)
  - [x] 변환 스크립트에서 LaTeX 구문 보호
  - [x] 자동 링크 변환 (`<URL>` → `[URL](URL)`)
  - [x] HTML 주석을 JSX 주석으로 변환
  - [x] 기존 포스트 수식 마이그레이션
- [x] **Notice 컴포넌트 완성**
  - [x] 5가지 타입 지원: info, primary, warning, danger, success
  - [x] 다크 모드 스타일링
- [x] Google Analytics 통합 (G-JWJT3DQR8G)
- [x] Giscus 댓글 통합 (기존 설정 유지)
- [x] RSS 피드 생성 및 검증
- [x] Sitemap 최적화 (기존 @astrojs/sitemap 활용)
- [x] **전체 포스트 마이그레이션 및 빌드 성공**
  - ✅ 성공 빌드: 56개
  - 📝 Draft 처리: 17개 (Phase 4에서 개별 수정 예정)
  - 빌드 시간: ~2.9초
  - 총 페이지: 57개 (56 blog + 1 index)

#### Draft 포스트 목록 (17개)

**복잡한 HTML 포맷 (Phase 4에서 개별 수정 필요)**:
1. `leetcode-2092.mdx` - LeetCode 문제 HTML 포맷
2. `leetcode-2402.mdx` - LeetCode 문제 HTML 포맷
3. `leetcode-2709.mdx` - LeetCode 문제 HTML 포맷
4. `programmers-lighthouse.mdx` - Programmers 문제 HTML 포맷
5. `programmers-undestroyed-buildings.mdx` - Programmers 문제 HTML 포맷
6. `programmers-visited-length.mdx` - Programmers 문제 HTML 포맷
7. `cpp98-ref-08.mdx` - `vector<bool>` 등 특수 문자 포맷

**LaTeX 복잡도 (Phase 4에서 수동 수정 필요)**:
8. `what-is-ray-tracing.mdx` - 복잡한 LaTeX 수식, 특수 변수명

**HTML 태그 미완성**:
9. `hongong-sql-week01.mdx` - Unclosed `<img>` tags
10. `hongong-sql-week02.mdx` - Unclosed `<img>` tags
11. `hongong-sql-week03.mdx` - Unclosed `<img>` tags
12. `hongong-sql-week04.mdx` - Unclosed `<img>` tags
13. `hongong-sql-week05.mdx` - Unclosed `<img>` tags
14. `hongong-sql-week06.mdx` - Unclosed `<img>` tags

**작성 중 포스트**:
15. `nestjs-dematerializer-5.mdx` - 사용자가 작성 중
16. `2024-1q-retrospective.mdx` - JSX parsing 이슈
17. `kqueue-paper.mdx` - MDX 파싱 문제

**수정 방향**:
- LeetCode/Programmers 포스트: 문제 설명 HTML → MDX 컴포넌트 변환
- Hongong-sql 시리즈: `<img>` 태그 → `<img />` 자동 닫기
- LaTeX 포스트: 수식 구문 수동 검증 및 수정
- 작성 중 포스트: 사용자가 완성 후 재변환

#### Phase 4: 네비게이션 및 고급 UI 컴포넌트 ✅ **완료**
- [x] **좌측 사이드바 네비게이션**
  - [x] 카테고리 기반 리스트 구조 (14개 카테고리)
  - [x] 라우팅 연동 (현재 위치 하이라이트)
  - [x] Recent Posts 섹션 (최신 5개)
  - [x] 포스트 카운트 표시
  - [x] 모바일 반응형 (sticky, scroll)
- [x] **상단 메뉴 (Header Navigation)**
  - [x] 주요 페이지 링크 (Home, Blog, Tags, About)
  - [x] 다크 모드 토글 (localStorage 저장)
  - [x] 현재 페이지 하이라이트
  - [x] 모바일 반응형
- [x] **카테고리/태그 아카이브 페이지**
  - [x] 카테고리별 포스트 목록 (`/blog/category/[category]`)
  - [x] 태그 인덱스 페이지 (`/tags`)
  - [x] 태그별 포스트 목록 (`/tags/[tag]`)
- [x] **About 페이지** (`/about`)
- [x] 코드 하이라이팅 (Shiki dark-plus 테마)
- [x] 다크 테마 완성 (Tailwind CSS)
- [ ] 검색 기능 (Algolia/Fuse.js) - Phase 6 계획
- [ ] 이미지 최적화 (@astrojs/image) - Phase 6 계획

#### Phase 5: 최적화 및 검증 ✅ **완료**
- [x] **빌드 테스트**
  - [x] 프로덕션 빌드 성공 (124 pages in 3.21s)
  - [x] TypeScript 타입 체크 (0 errors)
  - [x] 번들 크기 최적화 (143.47 KB)
- [x] **SEO 검증**
  - [x] Sitemap 생성 (sitemap-index.xml, sitemap-0.xml)
  - [x] robots.txt 생성 및 배포
  - [x] Meta 태그 검증 (title, description, canonical)
  - [x] Google Analytics 통합 확인
  - [x] Giscus 댓글 시스템 확인
  - [x] RSS 피드 생성 확인
- [x] **자동화 테스트 (Playwright)**
  - [x] 홈 페이지 meta 태그 검증
  - [x] 블로그 포스트 구조 검증
  - [x] 카테고리 페이지 검증
  - [x] 태그 페이지 검증
  - [x] About 페이지 검증
  - [x] Sitemap 생성 확인
  - [x] robots.txt 접근성 확인
  - [x] RSS 피드 생성 확인
- [ ] 이미지 최적화 (@astrojs/image) - Phase 6 계획
- [ ] 한글 폰트 최적화 (subset, preload) - Phase 6 계획
- [ ] 성능 테스트 및 벤치마크 (Lighthouse) - Phase 6 계획
- [ ] 링크 무결성 검사 - Phase 6 계획
- [ ] 접근성 테스트 (WCAG) - Phase 6 계획

#### Phase 6: 최종 최적화 및 배포 준비 (계획)
- [ ] 이미지 최적화 (@astrojs/image 또는 Sharp)
- [ ] 한글 폰트 최적화 (subset, preload)
- [ ] Lighthouse 성능 테스트 (목표: 95+ 모든 카테고리)
- [ ] 링크 무결성 검사 (linkinator)
- [ ] 접근성 테스트 (WCAG AA)
- [ ] 검색 기능 구현 (Algolia 또는 Fuse.js)
- [ ] Draft 포스트 수정 (17개)
- [ ] 프로덕션 배포 및 A/B 테스트

#### Phase 7: UI/UX 개선 및 고도화 ✅ **완료**
**목표**: 전문적인 디자인 시스템 구축 및 사용자 경험 향상

- ✅ **디자인 시스템 구축**
  - ✅ design-tokens.css 생성 (색상, 타이포그래피, 간격)
  - ✅ CSS 변수 기반 테마 시스템
  - ✅ 전역 스타일 일관성 확보
- ✅ **다크/라이트 모드 완전 구현**
  - ✅ 하드코딩 색상 → CSS 변수 전환
  - ✅ Sidebar 테마 대응
  - ✅ Header 테마 대응
  - ✅ PostLayout prose-invert 적용
  - ✅ 모든 컴포넌트 테마 일관성 확보
- ✅ **사이드바 계층 구조**
  - ✅ 카테고리 그룹핑 (Web, Algorithm, DevOps 등)
  - ✅ 2-depth 확장/축소 UI
  - ✅ 현재 경로 기반 자동 확장
  - ✅ 부드러운 애니메이션
- ✅ **이모지 제거 및 정돈**
  - ✅ 사이드바 이모지 제거
  - ✅ 헤더 이모지 제거
  - ✅ 깔끔한 네비게이션 UI
- ✅ **코드 블록 개선**
  - ✅ CodeCopyButton 컴포넌트 생성
  - ✅ 복사 버튼 구현 (Clipboard API)
  - ✅ 성공 피드백 애니메이션
- ✅ **Scroll to Top 버튼**
  - ✅ ScrollToTop 컴포넌트 생성
  - ✅ IntersectionObserver 활용
  - ✅ 부드러운 스크롤 애니메이션
- ✅ **Reading Progress 바**
  - ✅ ReadingProgress 컴포넌트 생성
  - ✅ 스크롤 진행률 시각화
  - ✅ 반응형 디자인
- ✅ **TOC 개선**
  - ✅ 활성 섹션 하이라이팅
  - ✅ IntersectionObserver 기반 자동 업데이트
  - ✅ 부드러운 스크롤 이동
  - ✅ Sticky TOC (우측 사이드바)
  - ✅ 현재 섹션 하이라이트 (파란색 + 좌측 보더)

**생성된 파일**:
- `src/styles/design-tokens.css` - 디자인 시스템 토큰
- `src/components/CodeCopyButton.astro` - 코드 복사 버튼
- `src/components/ScrollToTop.astro` - 스크롤 탑 버튼
- `src/components/ReadingProgress.astro` - 읽기 진행도 바

**수정된 파일**:
- `src/layouts/PostLayout.astro` - TOC 활성화 스크립트 추가
- `src/layouts/BaseLayout.astro` - 디자인 토큰 import
- `src/components/Sidebar.astro` - 이모지 제거, 2-depth UI
- `src/components/Header.astro` - 이모지 제거, 깔끔한 네비게이션
- `src/styles/global.css` - 다크 모드 CSS 변수 적용

**테스트 결과**:
- ✅ 빌드 성공: 124 pages in 3.21s
- ✅ Playwright 테스트 통과 (TOC 활성화 확인)
- ✅ 스크린샷 저장: `toc-active-highlighting.png`
- ✅ 다크/라이트 모드 전환 정상 작동
- ✅ 반응형 디자인 확인 완료

#### Phase 8: 코드베이스 정리 및 코드 퀄리티 최적화 (계획)
**목표**: FE 초보자도 쉽게 이해하고 확장 가능한 깔끔한 코드베이스 구축

- [ ] **Jekyll 관련 파일 완전 제거**
  - [ ] Jekyll 설정 파일 제거 (_config.yml, Gemfile, Gemfile.lock)
  - [ ] Jekyll 디렉토리 제거 (_includes, _layouts, _posts, _drafts, _pages, _data, _sass)
  - [ ] Jekyll 캐시 및 빌드 디렉토리 제거 (_site, .jekyll-cache)
  - [ ] .gitignore 업데이트 (Jekyll 관련 항목 제거)
  - [ ] 총 15MB+ 정리 예상
- [ ] **사용하지 않는 코드 제거**
  - [ ] 미사용 import 문 제거
  - [ ] 미사용 함수 및 변수 정리
  - [ ] 미사용 CSS 클래스 정리
  - [ ] 중복 코드 통합
- [ ] **코드 가독성 개선**
  - [ ] 일관된 네이밍 컨벤션 적용 (한글 주석, 영어 변수명)
  - [ ] 함수 분리 및 단일 책임 원칙 적용
  - [ ] 매직 넘버/문자열 상수화
  - [ ] 주석 개선 (코드 의도 설명)
- [ ] **확장성 고려 리팩토링**
  - [ ] 컴포넌트 props 타입 명확화
  - [ ] 재사용 가능한 유틸리티 함수 분리
  - [ ] 설정값 중앙화 (constants.ts)
  - [ ] 컴포넌트 디렉토리 구조 개선
- [ ] **초보자 친화적 문서화**
  - [ ] 새 포스트 작성 가이드 (POST_GUIDE.md)
  - [ ] 컴포넌트 작성 가이드 (COMPONENT_GUIDE.md)
  - [ ] 코드베이스 구조 설명 (ARCHITECTURE.md)
  - [ ] 각 컴포넌트 JSDoc 주석 추가
  - [ ] 예제 템플릿 제공

#### Phase 9: 성능 최적화 및 모니터링 (계획)
**목표**: 웹 성능 지표 개선 및 지속적인 모니터링 체계 구축

- [ ] **이미지 최적화**
  - [ ] 이미지 포맷 최적화 (WebP, AVIF)
  - [ ] 반응형 이미지 지원
  - [ ] 이미지 지연 로딩
- [ ] **폰트 최적화**
  - [ ] 웹 폰트 최적화 (Pretendard Variable)
  - [ ] FOUT 방지
- [ ] **성능 모니터링**
  - [ ] Lighthouse CI 설정
  - [ ] Core Web Vitals 추적
  - [ ] 빌드 성능 벤치마크

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

## Phase 2 완료 내역 (2025-10-12)

### 구축된 시스템

#### 1. Jekyll → MDX 변환 파이프라인
**파일**: `src/utils/jekyll-to-mdx.ts`

**기능**:
- 자동 frontmatter 매핑 (Jekyll → Astro schema)
- Notice 블록 변환 (`<div class="notice--{type}">` → `<Notice type="{type}">`)
- MDX 특수문자 이스케이프 (`<=`, `>=` → HTML 엔티티)
- 날짜/슬러그 추출 (파일명 기반)
- 카테고리 기반 디렉토리 구조 생성
- 태그 평탄화 (중첩 배열 → flat array)
- 시리즈 감지 (제목 패턴 매칭)

**CLI 도구**: `scripts/convert-posts.ts`
```bash
pnpm run convert:posts          # 전체 변환
pnpm run convert:posts:sample   # 샘플 5개
pnpm run convert:posts:dry-run  # 미리보기
```

#### 2. 콘텐츠 스키마
**파일**: `src/content.config.ts`

**필드 구조**:
- **필수**: title, excerpt, date, categories, tags
- **SEO**: description (160자), ogImage, keywords
- **품질**: draft, featured, readingTime
- **TOC**: toc (boolean), tocDepth (1-6)
- **다국어**: lang (ko/en)
- **시리즈**: series (name, order)
- **작성자**: author (기본값: Tolerblanc)

#### 3. UI 컴포넌트

**Notice 컴포넌트** (`src/components/Notice.astro`)
- 4가지 타입: info (파랑), warning (노랑), danger (빨강), success (초록)
- 다크 모드 지원 (Tailwind 유틸리티)
- 접근성: ARIA live regions

**PostLayout** (`src/layouts/PostLayout.astro`)
- SEO 메타태그: Open Graph, Twitter Cards, Article metadata
- 메타데이터 표시: 날짜 (한국어 포맷), 작성자, 카테고리, 태그
- TOC: 데스크톱 사이드바 (sticky), 설정 가능한 depth
- 시리즈 정보 배너
- 다크 모드 지원
- 한국어 폰트 스택

#### 4. 라우팅 시스템
**파일**: `src/pages/blog/[...slug].astro`

- Astro 5.x Content Layer API 사용
- 동적 정적 생성 (getStaticPaths)
- Draft 필터링
- URL 형식: `/experimental/blog/{category}-{slug}`

#### 5. 스타일링
- Tailwind CSS 3.4.18
- @tailwindcss/typography (prose 스타일)
- 커스텀 다크 모드 테마
- 한국어 폰트 최적화

### 검증 결과
- ✅ 5개 샘플 포스트 변환 성공
- ✅ 빌드: 0 errors, 0 warnings
- ✅ 6 pages in 1.04s
- ✅ 번들 크기: 143.47 KB
- ✅ 렌더링 확인 완료

### 알려진 이슈
- LaTeX 수식 (`\(...\)`, `\[...\]`) 이스케이프 필요 → **Phase 3에서 해결**
- 이미지 최적화 미완 (현재 GitHub raw URL) → Phase 4

---

## Phase 3 완료 내역 (2025-10-14)

### 핵심 기능 구축

#### 1. LaTeX 수식 렌더링 시스템
**라이브러리**: KaTeX with remark-math & rehype-katex

**설치된 의존성**:
```bash
pnpm add katex rehype-katex remark-math
```

**설정**: `astro.config.mjs`
```javascript
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

**스타일**: `src/styles/global.css`
```css
@import 'katex/dist/katex.min.css';
```

**지원 구문**:
- Inline: `$E = mc^2$`
- Block: `$$\int_0^1 x^2 dx$$`

#### 2. Google Analytics 통합
**Tracking ID**: `G-JWJT3DQR8G` (기존 유지)

**통합 위치**:
- `src/layouts/PostLayout.astro` (블로그 포스트)
- `src/pages/index.astro` (메인 페이지)

#### 3. Giscus 댓글 시스템
**컴포넌트**: `src/components/GiscusComments.astro`

**설정** (기존 유지):
```javascript
{
  repo: "Tolerblanc/Tolerblanc.github.io",
  repoId: "R_kgDOJ01EaQ",
  category: "Announcements",
  categoryId: "DIC_kwDOJ01Eac4Cerab",
  theme: "dark_dimmed",
  mapping: "pathname"
}
```

#### 4. RSS 피드
**엔드포인트**: `src/pages/rss.xml.ts`
- Draft 포스트 필터링
- 전체 포스트 메타데이터 포함
- 표준 RSS 2.0 형식

#### 5. Notice 컴포넌트 확장
**지원 타입**: 5가지
- `info` - 파란색 (정보)
- `primary` - 보라색 (중요)
- `warning` - 노란색 (경고)
- `danger` - 빨간색 (위험)
- `success` - 초록색 (성공)

### 포스트 마이그레이션 결과

#### 성공 빌드: 56개
**카테고리별 분포**:
- 9oormthon_challenge: 8개
- algorithm: 1개
- boj: 4개
- cpp: 7개
- dl: 1개
- docker: 3개
- javascript: 5개
- leetcode: 1개
- os: 1개
- programmers: 7개
- python: 3개
- retrospective: 6개
- review: 4개
- web_fundamentals: 1개

#### Draft 처리: 17개 (Phase 4 개별 수정 예정)

**1. 복잡한 HTML 포맷 이슈 (10개)**
- `leetcode-2092.mdx` - 원본: `src/content/blog/leetcode/`
  - 문제: 문제 설명에 JSX와 충돌하는 복잡한 HTML 테이블 및 수식
- `leetcode-2402.mdx` - 원본: `src/content/blog/leetcode/`
  - 문제: 인라인 HTML과 수식 혼용
- `leetcode-2709.mdx` - 원본: `src/content/blog/leetcode/`
  - 문제: 중첩된 HTML 구조
- `programmers-lighthouse.mdx` - 원본: `src/content/blog/programmers/`
  - 문제: 문제 설명 HTML 파싱 에러
- `programmers-undestroyed-buildings.mdx` - 원본: `src/content/blog/programmers/`
  - 문제: 복잡한 테이블 및 수식
- `programmers-visited-length.mdx` - 원본: `src/content/blog/programmers/`
  - 문제: HTML 구조 이슈
- `hongong-sql-week01.mdx` - 원본: `src/content/blog/혼공학습단/`
  - 문제: 닫히지 않은 `<img>` 태그
- `hongong-sql-week02.mdx` - 원본: `src/content/blog/혼공학습단/`
  - 문제: 닫히지 않은 `<img>` 태그
- `hongong-sql-week03.mdx` - 원본: `src/content/blog/혼공학습단/`
  - 문제: 닫히지 않은 `<img>` 태그
- `hongong-sql-week04.mdx` - 원본: `src/content/blog/혼공학습단/`
  - 문제: 닫히지 않은 `<img>` 태그

**2. LaTeX 변환 실패 (3개)**
- `what-is-ray-tracing.mdx` - 원본: `src/content/blog/graphics/`
  - 문제: MDX 파싱 에러 (복잡한 LaTeX 수식과 JSX 충돌)
- `cpp98-ref-08.mdx` - 원본: `src/content/blog/cpp/`
  - 문제: `vector<bool>` 등 템플릿 구문 JSX 충돌
- `kqueue-paper.mdx` - 원본: `src/content/blog/unix/`
  - 문제: 복잡한 C 코드 블록 및 HTML

**3. 회고록 특수 케이스 (3개)**
- `2024-1q-retrospective.mdx` - 원본: `src/content/blog/retrospective/`
  - 문제: acorn 파싱 에러 (특수 문자)
- `hongong-sql-week05.mdx` - 원본: `src/content/blog/혼공학습단/`
  - 문제: HTML 이미지 태그
- `hongong-sql-week06.mdx` - 원본: `src/content/blog/혼공학습단/`
  - 문제: HTML 이미지 태그

**4. 작성 중 포스트 (1개)**
- `nestjs-dematerializer-5.mdx` - 원본: `src/content/blog/javascript/`
  - 문제: null excerpt (아직 작성 중)
  - 사용자 요청으로 명시적 제외

### 빌드 성능

**최종 빌드 결과**:
```
19:17:04 [build] 57 page(s) built in 2.94s
19:17:04 [build] Complete!
```

**메트릭**:
- 빌드 시간: 2.94초
- 타입 체크: 0 errors, 0 warnings, 3 hints
- 번들 크기: 143.47 KB (gzip: 46.21 kB)
- 생성된 페이지: 57개 (56 blog posts + 1 index + RSS)

### 알려진 이슈 및 해결책

**1. Giscus 스크립트 힌트**
```
warning astro(4000): This script will be treated as if it has the `is:inline` directive
```
- 영향: 없음 (정상 작동)
- 해결: 향후 `is:inline` 명시적 추가 고려

**2. Google Analytics 스크립트 힌트**
```
warning astro(4000): This script will be treated as if it has the `is:inline` directive
```
- 영향: 없음 (정상 작동)
- 해결: 향후 `is:inline` 명시적 추가 고려

### Phase 4 Draft 수정 계획

**우선순위 1 - 간단한 수정 (HTML 태그)**:
- hongong-sql 시리즈 (6개): `<img>` → `<img />`로 자동 변환
- 예상 소요 시간: 30분

**우선순위 2 - LaTeX/템플릿 수정**:
- cpp98-ref-08: `vector<bool>` 등 backtick 처리
- what-is-ray-tracing: LaTeX 수식 수동 검토
- kqueue-paper: 복잡한 코드 블록 재구성
- 예상 소요 시간: 2-3시간

**우선순위 3 - HTML 재구성 (LeetCode/Programmers)**:
- 문제 설명 HTML → MDX 컴포넌트 변환
- 또는 iframe/이미지로 대체
- 예상 소요 시간: 4-5시간

**우선순위 4 - 회고록 특수 케이스**:
- 2024-1q-retrospective: 특수 문자 이스케이프
- 예상 소요 시간: 1시간

---

## Phase 3 상세 계획: LaTeX 지원 및 핵심 기능

### LaTeX 수식 렌더링 시스템

#### 1. 라이브러리 선택
**추천**: **KaTeX** (빠르고 가벼움, SSR 지원)
- 대안: MathJax (더 많은 기능, 무거움)

**의존성**:
```bash
pnpm add katex rehype-katex remark-math
```

#### 2. Astro 설정 업데이트
**파일**: `astro.config.mjs`
```javascript
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

#### 3. 스타일 추가
**파일**: `src/styles/global.css`
```css
@import 'katex/dist/katex.min.css';
```

#### 4. 지원 구문
- **Inline 수식**: `$E = mc^2$` 또는 `\(E = mc^2\)`
- **Block 수식**: `$$\int_0^1 x^2 dx$$` 또는 `\[\int_0^1 x^2 dx\]`

#### 5. 변환 스크립트 업데이트
**파일**: `src/utils/jekyll-to-mdx.ts`

LaTeX 구문 보호 로직 개선:
```typescript
export function protectLatexExpressions(content: string): string {
  const protectedBlocks: string[] = [];

  // Block math: \[...\] 또는 $$...$$
  content = content.replace(/\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$/g, (match) => {
    const placeholder = `__LATEX_BLOCK_${protectedBlocks.length}__`;
    protectedBlocks.push(match);
    return placeholder;
  });

  // Inline math: \(...\) 또는 $...$
  content = content.replace(/\\\([\s\S]*?\\\)|\$[^$\n]+\$/g, (match) => {
    const placeholder = `__LATEX_INLINE_${protectedBlocks.length}__`;
    protectedBlocks.push(match);
    return placeholder;
  });

  return { content, protectedBlocks };
}
```

#### 6. 기존 포스트 마이그레이션
- Jekyll에서 `\\(...\\)` 형식 사용 확인
- 변환 시 `\(...\)` 또는 `$...$`로 정규화
- 75개 포스트 전체 스캔 및 변환

### Google Analytics & Giscus 통합

#### Google Analytics
**파일**: `src/layouts/PostLayout.astro` 및 `src/pages/index.astro`

```astro
---
const GA_ID = 'G-JWJT3DQR8G';
---
<head>
  <!-- Google Analytics -->
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{GA_ID}');
  </script>
</head>
```

#### Giscus 댓글
**기존 설정 유지**:
```javascript
{
  repo: "Tolerblanc/Tolerblanc.github.io",
  repoId: "R_kgDOJ01EaQ",
  category: "Announcements",
  categoryId: "DIC_kwDOJ01Eac4Cerab",
  theme: "dark_dimmed",
  mapping: "pathname", // 중요: URL 기반 매핑
}
```

**컴포넌트**: `src/components/GiscusComments.astro`

---

## Phase 4 상세 계획: 네비게이션 시스템

### 좌측 사이드바 네비게이션

#### 설계 구조
```
┌─────────────────────────┐
│ 📚 Tolerblanc's Blog    │ ← 헤더
├─────────────────────────┤
│ 🔥 Featured             │ ← 커스텀 섹션
│   • NestJS 해체분석기 1  │
│   • 2025 회고           │
├─────────────────────────┤
│ 📝 Recent Posts         │ ← 최근 포스트
│   • [최신 포스트 5개]    │
├─────────────────────────┤
│ 📂 Categories           │ ← 카테고리 트리
│   ▼ Web                 │
│     • NestJS            │
│     • React             │
│   ▼ Algorithm           │
│     • DP                │
│     • Graph             │
│   ▶ DevOps              │
│   ▶ CS                  │
└─────────────────────────┘
```

#### 기술 스택
- **컴포넌트**: `src/components/Sidebar.astro`
- **상태 관리**: Astro Islands + React (접기/펼치기)
- **라우팅 하이라이트**: Astro.url.pathname 활용
- **반응형**:
  - Desktop: 고정 좌측 사이드바 (width: 280px)
  - Mobile: 햄버거 메뉴 → 슬라이드 오버레이

#### 데이터 구조
**파일**: `src/utils/navigation.ts`
```typescript
export interface NavCategory {
  id: string;
  name: string;
  icon?: string;
  children?: NavCategory[];
  postCount?: number;
}

export const categories: NavCategory[] = [
  {
    id: 'web',
    name: 'Web',
    icon: '🌐',
    children: [
      { id: 'web/nestjs', name: 'NestJS', postCount: 5 },
      { id: 'web/react', name: 'React', postCount: 8 },
    ],
  },
  // ...
];
```

### 상단 메뉴 (Header Navigation)

#### 디자인
```
┌────────────────────────────────────────────────┐
│ 🏠 Home  |  📝 Blog  |  🏷️ Tags  |  🔍 Search  │  🌙 │
└────────────────────────────────────────────────┘
```

#### 기능
1. **주요 링크**: Home, Blog, Tags, About
2. **검색 바**:
   - Algolia DocSearch 또는 Fuse.js
   - 키보드 단축키 (Cmd+K)
3. **다크 모드 토글**:
   - localStorage 상태 저장
   - 시스템 설정 감지
4. **모바일 반응형**: 햄버거 메뉴로 변환

---

## 다음 에이전트를 위한 컨텍스트 요약

### 현재 상태 (Phase 2 완료)
1. **브랜치**: `astro-experimental` (5 commits)
2. **Phase 1**: ✅ 완료 (Astro 5.14.4, TypeScript, 빌드 환경)
3. **Phase 2**: ✅ 완료 (변환 시스템, 컴포넌트, 라우팅, 렌더링 검증)
4. **Phase 3**: 🔄 준비 완료 (LaTeX 지원 및 핵심 기능)

### 완료된 파일 및 시스템
**변환 시스템**:
- `src/utils/jekyll-to-mdx.ts` - 자동 변환 유틸리티
- `scripts/convert-posts.ts` - CLI 도구
- `src/content.config.ts` - Astro 5.x Content Layer 스키마

**UI 컴포넌트**:
- `src/components/Notice.astro` - 4가지 타입의 알림 컴포넌트
- `src/layouts/PostLayout.astro` - SEO, TOC, 메타데이터 표시
- `src/pages/blog/[...slug].astro` - 동적 라우팅

**스타일링**:
- `tailwind.config.mjs` - Tailwind 설정 (typography 포함)
- `src/styles/global.css` - 한국어 폰트, 다크 모드

**변환된 샘플**:
- `src/content/blog/9oormthon_challenge/*.mdx` - 5개 샘플 포스트

### 즉시 진행 가능한 작업 (Phase 3)
1. **LaTeX 수식 지원** (최우선)
   - `pnpm add katex rehype-katex remark-math`
   - `astro.config.mjs` 업데이트 (remarkPlugins, rehypePlugins)
   - `src/utils/jekyll-to-mdx.ts`에 LaTeX 보호 로직 추가
   - 기존 포스트에서 수식 패턴 스캔

2. **Google Analytics 통합**
   - `src/layouts/PostLayout.astro`에 GA 스크립트 추가
   - `src/pages/index.astro`에도 적용

3. **Giscus 댓글**
   - `src/components/GiscusComments.astro` 생성
   - PostLayout에 통합

4. **전체 포스트 마이그레이션**
   - `pnpm run convert:posts` 실행 (75개 포스트)
   - 변환 결과 검증

### 필요한 정보 (Phase 4 네비게이션)
- **카테고리 구조**: `_posts/` 디렉토리 구조 분석 필요
- **Featured 포스트**: 어떤 기준으로 선정할지 결정
- **아이콘/이모지**: 각 카테고리에 사용할 아이콘
- **디자인 선호도**: 사이드바 색상 스킴, 폰트 크기 등

### 주의사항
1. **SEO 최우선**: URL 구조 절대 변경 금지
2. **GA ID 유지**: `G-JWJT3DQR8G` 그대로 사용
3. **Giscus pathname 매핑**: 기존 댓글 유지를 위해 URL 일치 필수
4. **독립적 커밋**: 각 기능은 별도 커밋으로 관리
5. **LaTeX 우선 처리**: 많은 포스트에 수식이 포함되어 있을 가능성

### 측정 지표 (Phase 2 완료 시점)
- 빌드 시간: 1.04s (6 pages)
- 빌드 상태: 0 errors, 0 warnings
- 번들 크기: 143.47 KB
- 변환된 포스트: 5개 샘플 (75개 대기 중)
- 커밋 수: 5개 (Phase 1-2 완료)
- 성능: TypeScript 체크 164ms, 렌더링 정상

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

---

## Phase 4 완료 내역 (2025-10-25)

### 네비게이션 시스템 구축

#### 1. 좌측 사이드바
**파일**: `src/components/Sidebar.astro`

**기능**:
- 14개 카테고리 표시 (포스트 수 포함)
- 최근 포스트 5개 (날짜 포함)
- 현재 카테고리 하이라이트
- Sticky 포지셔닝 (스크롤 유지)
- 다크 모드 스타일링

**카테고리 목록**:
1. 9oormthon (8개)
2. Retrospective (8개)
3. C++ (7개)
4. Programmers (7개)
5. JavaScript (6개)
6. BOJ (5개)
7. Review (4개)
8. Python (3개)
9. Docker (3개)
10. Algorithm (1개)
11. Deep Learning (1개)
12. LeetCode (1개)
13. OS (1개)
14. Web Fundamentals (1개)

#### 2. 상단 헤더 네비게이션
**파일**: `src/components/Header.astro`

**기능**:
- 4개 메인 메뉴 (Home, Blog, Tags, About)
- 다크 모드 토글 (localStorage 저장)
- 현재 페이지 active 상태
- 반응형 디자인

#### 3. 카테고리/태그 페이지

**카테고리 페이지** (`src/pages/blog/category/[category].astro`):
- 14개 카테고리별 동적 페이지 생성
- 카테고리별 포스트 목록 (날짜순 정렬)
- 포스트 카드 레이아웃
- URL: `/experimental/blog/category/{category}`

**태그 인덱스 페이지** (`src/pages/tags.astro`):
- 51개 태그 전체 목록
- 태그별 포스트 수 표시
- 태그 클라우드 레이아웃
- URL: `/experimental/tags`

**태그 상세 페이지** (`src/pages/tags/[tag].astro`):
- 51개 태그별 동적 페이지 생성
- 태그별 포스트 목록
- URL: `/experimental/tags/{tag}`

#### 4. About 페이지
**파일**: `src/pages/about.astro`

**내용**:
- 블로그 소개
- 기술 스택 정보
- 연락처 정보
- 마이그레이션 진행 상황
- URL: `/experimental/about`

### URL 라우팅 수정

#### URL 패턴 보존
**문제**: 초기에는 `/blog/javascript-nestjs-dematerializer-4` 형태로 하이픈으로 연결
**수정**: Jekyll 호환성을 위해 `/blog/javascript/nestjs-dematerializer-4` 형태로 슬래시 유지

**수정 파일**: `src/pages/blog/[...slug].astro`
```typescript
// Before (잘못된 방식)
params: { slug: post.id.replace(/\//g, '-') }

// After (올바른 방식)
params: { slug: post.id }
```

#### Playwright 검증
- 모든 URL 패턴 브라우저 테스트 완료
- 카테고리 active 상태 확인
- 페이지 렌더링 검증

### TypeScript 타입 안정성

#### Props 인터페이스 통일
**수정**: 모든 페이지 레이아웃에 `currentPath` prop 추가

**BaseLayout Props**:
```typescript
interface Props {
  title: string;
  description?: string;
  currentPath?: string;
}
```

**적용 파일**:
- `src/layouts/BaseLayout.astro`
- `src/pages/about.astro`
- `src/pages/tags.astro`
- `src/pages/blog/category/[category].astro`
- `src/pages/tags/[tag].astro`

### 빌드 결과

**프로덕션 빌드 성공**:
```
15:11:40 [build] 124 page(s) built in 3.21s
15:11:40 [build] Complete!
```

**페이지 분류**:
- 56개 블로그 포스트
- 14개 카테고리 페이지
- 51개 태그 페이지
- 1개 태그 인덱스 페이지
- 1개 About 페이지
- 1개 홈 페이지
- 1개 RSS 피드

**빌드 메트릭**:
- TypeScript 체크: 0 errors
- 빌드 시간: 3.21초
- 번들 크기: 143.47 KB

---

## Phase 5 완료 내역 (2025-10-25)

### SEO 검증 및 최적화

#### 1. Sitemap 생성
**파일**: `dist/sitemap-index.xml`, `dist/sitemap-0.xml`

**내용**:
- 124개 페이지 URL 전체 포함
- 표준 XML Sitemap 형식
- Google 검색 최적화

#### 2. robots.txt 생성
**파일**: `public/robots.txt` → `dist/robots.txt`

**내용**:
```
User-agent: *
Allow: /

Sitemap: https://tolerblanc.github.io/experimental/sitemap-index.xml
```

#### 3. Meta 태그 검증
**검증 항목**:
- `<title>` 태그 (모든 페이지 고유)
- `<meta name="description">` (SEO 최적화)
- `<link rel="canonical">` (중복 콘텐츠 방지)
- Google Analytics 스크립트 (G-JWJT3DQR8G)
- Giscus 댓글 시스템

#### 4. Playwright 자동화 테스트
**파일**: `tests/seo-verification.spec.ts`

**테스트 결과**: 8/8 통과 ✅
1. ✅ 홈 페이지 meta 태그 검증
2. ✅ 블로그 포스트 구조 및 meta 태그 검증
3. ✅ 카테고리 페이지 meta 태그 검증
4. ✅ 태그 페이지 meta 태그 검증
5. ✅ About 페이지 meta 태그 검증
6. ✅ Sitemap 생성 확인 (dist 폴더)
7. ✅ robots.txt 접근성 확인
8. ✅ RSS 피드 생성 확인 (dist 폴더)

**테스트 실행 시간**: 4.2초

### 빌드 최적화

#### 빌드 경고 해결
**PostCSS 경고**:
```
@import must precede all other statements (besides @charset or empty @layer)
```
- 위치: `src/styles/global.css`
- 원인: KaTeX import가 다른 CSS 구문 뒤에 위치
- 영향: 낮음 (정상 작동)
- 해결: Phase 6에서 CSS 구조 정리 예정

#### 성능 메트릭
**프로덕션 빌드**:
- 빌드 시간: 3.21초 (124 페이지)
- 번들 크기: 143.47 KB (gzip: 46.21 kB)
- TypeScript 체크: 0 errors
- Vite 변환: 20 modules transformed

### 다음 단계 준비 (Phase 6)

#### 최적화 작업
1. **이미지 최적화**: Sharp 또는 @astrojs/image 통합
2. **한글 폰트 최적화**: Subset 생성 및 preload
3. **Lighthouse 테스트**: 성능, SEO, 접근성 점수 측정
4. **링크 무결성**: linkinator로 깨진 링크 검사
5. **접근성**: WCAG AA 준수 검증

#### Draft 포스트 수정
- 17개 draft 포스트 개별 수정
- HTML 태그 자동 수정 (hongong-sql 시리즈)
- LaTeX 수식 수동 검증
- LeetCode/Programmers 문제 HTML 재구성

#### 기능 추가
- 검색 기능 (Algolia 또는 Fuse.js)
- 프로그레스 바 (읽기 진행도)
- 관련 포스트 추천

---

---

## Phase 7 상세 계획: UI/UX 개선 및 고도화 (2025-10-25 작성)

### 문제 분석

#### 1. 현재 디자인 시스템의 문제점

**다크/라이트 모드 불완전**:
- 하드코딩된 다크 색상 (`#1a1a1a`, `#2a2a2a`, `#333`)
- 라이트 모드 전환 시 배경/텍스트 대비 부족
- Tailwind의 `dark:` 유틸리티 미활용
- typography prose의 `dark:prose-invert` 미적용

**이모지 과다 사용**:
- 사이드바: 📚, 📝, 📂 + 각 카테고리별 이모지 (14개)
- 헤더: 💻, 🏠, 📝, 🏷️, 👤, ☀️, 🌙
- 전문성 저하, 토스페이먼츠 스타일과 대비됨

**사이드바 계층 구조 부재**:
- 현재: 단일 depth (소분류만 나열)
- 필요: 중분류 그룹핑 (예: Web > JavaScript, NestJS)
- `navigation.ts`에 `children` 필드는 정의되어 있으나 미사용

**누락된 UX 요소**:
- ✗ Scroll to top 버튼
- ✗ 코드 블록 복사 버튼
- ✗ 읽기 진행도 표시
- ✗ 목차(TOC) 현재 섹션 하이라이트

**디자인 시스템 부재**:
- 일관된 색상 팔레트 미정의
- 타이포그래피 계층 불명확
- 컴포넌트 스타일이 각 `.astro` 파일 내부에 산재

#### 2. 벤치마킹: 토스페이먼츠 개발자 문서

**URL**: https://docs.tosspayments.com/guides/v2/get-started/migration-guide

**핵심 디자인 특징**:
- **색상 팔레트**: Primary blue (#3182f6), 중립 회색 (#4e5968 ~ #b0b8c1)
- **레이아웃**: 고정 사이드바 (224px), sticky TOC, 중앙 콘텐츠
- **타이포그래피**: 명확한 계층 (40px → 32px → 28px), Toss Product Sans
- **인터랙션**: 부드러운 hover/focus 전환, 섬세한 애니메이션
- **미니멀리즘**: 아이콘 최소화, 텍스트 중심, 깔끔한 구조

**우리가 채택할 원칙**:
1. **미니멀리즘**: 불필요한 장식(이모지) 제거, 콘텐츠 중심
2. **일관성**: 모든 페이지/컴포넌트 동일한 디자인 패턴
3. **접근성**: WCAG AA 준수, 키보드 네비게이션, 명확한 대비
4. **성능**: 불필요한 JS 최소화, CSS 최적화
5. **반응형**: Mobile-first, 명확한 브레이크포인트

### 세부 작업 계획

#### 작업 1: 디자인 토큰 시스템 구축

**새 파일**: `src/styles/design-tokens.css`

**내용**:
```css
:root {
  /* Primary Colors */
  --color-primary: #3182f6;
  --color-primary-hover: #1b64da;
  --color-primary-light: #60a5fa;

  /* Neutral Colors - Light Mode */
  --color-bg-base: #ffffff;
  --color-bg-elevated: #f8f9fa;
  --color-bg-hover: #f1f3f5;
  --color-text-primary: #191f28;
  --color-text-secondary: #4e5968;
  --color-text-tertiary: #8b95a1;
  --color-border: #e5e8eb;
  --color-border-strong: #d1d6db;

  /* Neutral Colors - Dark Mode */
  --color-bg-base-dark: #0f1014;
  --color-bg-elevated-dark: #1a1b23;
  --color-bg-hover-dark: #24252d;
  --color-text-primary-dark: #e8eaed;
  --color-text-secondary-dark: #9ea5ad;
  --color-text-tertiary-dark: #6b7280;
  --color-border-dark: #2d2e36;
  --color-border-strong-dark: #3f4149;

  /* Semantic Colors */
  --color-success: #12b76a;
  --color-warning: #f79009;
  --color-danger: #f04438;
  --color-info: #0ba5ec;

  /* Typography */
  --font-display: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 2rem;      /* 32px */
  --text-4xl: 2.5rem;    /* 40px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Spacing Scale */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */

  /* Border Radius */
  --radius-sm: 0.25rem;  /* 4px */
  --radius-md: 0.375rem; /* 6px */
  --radius-lg: 0.5rem;   /* 8px */
  --radius-xl: 0.75rem;  /* 12px */
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

/* Dark mode color application */
html.dark {
  --color-bg-base: var(--color-bg-base-dark);
  --color-bg-elevated: var(--color-bg-elevated-dark);
  --color-bg-hover: var(--color-bg-hover-dark);
  --color-text-primary: var(--color-text-primary-dark);
  --color-text-secondary: var(--color-text-secondary-dark);
  --color-text-tertiary: var(--color-text-tertiary-dark);
  --color-border: var(--color-border-dark);
  --color-border-strong: var(--color-border-strong-dark);
}
```

**global.css 수정**:
```css
@import './design-tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

/* KaTeX는 components 레이어로 이동 */
@layer components {
  @import 'katex/dist/katex.min.css';
}

body {
  font-family: var(--font-display);
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  transition: background-color var(--transition-base), color var(--transition-base);
}
```

#### 작업 2: 사이드바 계층 구조 구현

**navigation.ts 수정**:
```typescript
// 카테고리 그룹 정의
const categoryGroups = {
  'programming': {
    name: 'Programming',
    icon: '💻',
    categories: ['javascript', 'python', 'cpp']
  },
  'algorithm': {
    name: 'Algorithm',
    icon: '🧮',
    categories: ['boj', 'programmers', 'leetcode', 'algorithm']
  },
  'web': {
    name: 'Web',
    icon: '🌐',
    categories: ['web_fundamentals', 'docker']
  },
  'learning': {
    name: 'Learning',
    icon: '📚',
    categories: ['9oormthon_challenge', 'retrospective', 'review']
  },
  'ai': {
    name: 'AI & Graphics',
    icon: '🤖',
    categories: ['dl', 'graphics']
  },
  'system': {
    name: 'System',
    icon: '🖥️',
    categories: ['os', 'unix']
  }
};

export interface NavCategoryGroup {
  id: string;
  name: string;
  icon?: string;
  categories: NavCategory[];
}

export async function getNavigationCategoriesGrouped(): Promise<NavCategoryGroup[]> {
  // 구현...
}
```

**Sidebar.astro 수정**:
- Collapsible 그룹 UI
- `<details>` 태그 또는 React 상태 관리
- 현재 경로 기반 자동 확장

#### 작업 3: 이모지 제거

**옵션 A - 아이콘 라이브러리 통합**:
```bash
pnpm add lucide-react
```

**옵션 B - SVG 직접 구현**:
- 각 카테고리별 단순 SVG 아이콘
- 경량화 (KB 단위)

**적용**:
- 사이드바: 이모지 제거, 텍스트 + accent color
- 헤더: 이모지 제거, 텍스트만
- 카테고리 그룹: 아이콘 또는 accent border

#### 작업 4: 코드 블록 복사 버튼

**새 컴포넌트**: `src/components/CodeBlock.astro`

**기능**:
- 복사 버튼 (우상단)
- Clipboard API 활용
- 복사 성공 피드백 (✓ Copied!)
- 언어 라벨 표시

**rehype 플러그인 활용**:
```typescript
// astro.config.mjs
import rehypePrettyCode from 'rehype-pretty-code';

markdown: {
  rehypePlugins: [[rehypePrettyCode, {
    theme: 'github-dark',
    onVisitLine(node) {
      // 라인 번호 추가
    }
  }]]
}
```

#### 작업 5: Scroll to Top 버튼

**새 컴포넌트**: `src/components/ScrollToTop.astro`

**구현**:
```astro
<button id="scroll-to-top" class="scroll-to-top" aria-label="맨 위로">
  ↑
</button>

<script>
  const button = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      button?.classList.add('visible');
    } else {
      button?.classList.remove('visible');
    }
  });

  button?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
</script>

<style>
  .scroll-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-full);
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
    z-index: var(--z-fixed);
  }

  .scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
  }
</style>
```

#### 작업 6: 읽기 진행도 표시

**새 컴포넌트**: `src/components/ReadingProgress.astro`

**구현**:
```astro
<div class="reading-progress">
  <div class="reading-progress-bar"></div>
</div>

<script>
  const progressBar = document.querySelector('.reading-progress-bar');

  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;

    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  });
</script>

<style>
  .reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-bg-elevated);
    z-index: var(--z-fixed);
  }

  .reading-progress-bar {
    height: 100%;
    background: var(--color-primary);
    transition: width 150ms ease-out;
  }
</style>
```

#### 작업 7: TOC 개선

**PostLayout.astro 수정**:
```astro
<!-- TOC with IntersectionObserver -->
<nav class="toc sticky">
  <h3>목차</h3>
  <ul>
    {tocHeadings.map(h => (
      <li class={`toc-level-${h.depth}`} data-heading={h.slug}>
        <a href={`#${h.slug}`}>{h.text}</a>
      </li>
    ))}
  </ul>
</nav>

<script>
  const headings = document.querySelectorAll('article h2, article h3');
  const tocLinks = document.querySelectorAll('.toc a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-100px 0px -66%' });

  headings.forEach(heading => observer.observe(heading));
</script>
```

#### 작업 8: 타이포그래피 최적화

**Pretendard 웹폰트 통합**:
```bash
pnpm add @fontsource/pretendard
```

**global.css**:
```css
@import '@fontsource/pretendard/variable.css';

:root {
  --font-display: 'Pretendard Variable', -apple-system, sans-serif;
}
```

**Tailwind 설정**:
```javascript
// tailwind.config.mjs
theme: {
  extend: {
    fontFamily: {
      sans: ['Pretendard Variable', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['2rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.5rem', { lineHeight: '2.5rem' }]
    }
  }
}
```

### 예상 결과

#### Before (Phase 5 완료 시점)
- ❌ 이모지 과다 (14개 카테고리 + 헤더)
- ❌ 라이트 모드 배경/텍스트 대비 부족
- ❌ 단일 depth 사이드바
- ❌ 코드 블록 복사 불가
- ❌ Scroll to top 없음
- ❌ 읽기 진행도 표시 없음
- ❌ TOC 하이라이트 없음

#### After (Phase 7 완료 시점)
- ✅ 깔끔한 텍스트 중심 디자인
- ✅ 완벽한 다크/라이트 모드 전환
- ✅ 2-depth 사이드바 계층 구조
- ✅ 코드 블록 복사 버튼
- ✅ Scroll to top 버튼
- ✅ 읽기 진행도 프로그레스 바
- ✅ TOC 현재 섹션 하이라이트
- ✅ 토스페이먼츠 수준의 전문적인 UX

### 작업 우선순위

1. **High**: 디자인 토큰, 다크/라이트 모드 완성
2. **High**: 사이드바 계층 구조
3. **Medium**: 이모지 제거
4. **Medium**: 코드 블록 복사 버튼
5. **Low**: Scroll to top
6. **Low**: 읽기 진행도
7. **Low**: TOC 개선
8. **Medium**: 타이포그래피 최적화

---

## Phase 8 상세 계획: 코드베이스 정리 및 코드 퀄리티 최적화

### 현재 문제점 분석

#### 1. Jekyll 유산 파일 (Legacy Files)
**문제**: 15MB+ 불필요한 Jekyll 관련 파일이 저장소에 남아있음

**발견된 파일/디렉토리**:
```bash
# 설정 파일 (4KB)
_config.yml          # Jekyll 설정
Gemfile              # Ruby 의존성
Gemfile.lock         # Ruby 의존성 잠금

# 디렉토리 (15MB+)
_site/               # 6.5MB - Jekyll 빌드 결과물
_posts/              # 944KB - 구 포스트 (Astro로 마이그레이션 완료)
assets/              # 688KB - 구 에셋
_sass/               # 388KB - 구 스타일시트
_includes/           # 268KB - Jekyll 템플릿 조각
_drafts/             # 256KB - 초안
_pages/              # 116KB - Jekyll 페이지
_data/               # 108KB - Jekyll 데이터 파일
_layouts/            # 64KB - Jekyll 레이아웃
.jekyll-cache/       # Jekyll 캐시
```

**영향**:
- 저장소 크기 불필요하게 증가
- 혼란 야기 (어떤 파일이 현재 사용중인지 불명확)
- Git 히스토리 복잡성 증가
- 신규 개발자가 코드베이스 이해하기 어려움

#### 2. 코드 품질 문제
**문제**: 일관성 없는 네이밍, 가독성 낮은 코드 구조

**구체적 사례** (현재 코드베이스 분석):

**a) 네이밍 불일치**:
```typescript
// src/utils/navigation.ts
export const categoryLabels: Record<string, string> = {
  'personal': '📝 Personal',  // 이모지 포함
  'pl': '💻 Programming Languages',  // 약어 사용
  'web_fundamentals': '🌐 Web Fundamentals',  // snake_case
};

// 개선 필요:
// - 이모지 제거 (Phase 7과 연계)
// - snake_case → camelCase 통일
// - 약어 대신 명확한 이름
```

**b) 매직 넘버/문자열**:
```typescript
// src/components/Sidebar.astro (예상)
<div class="sidebar" style="width: 280px;">  {/* 매직 넘버 */}
  <div class="category" data-depth="1">  {/* 매직 넘버 */}
```

**c) 중복 코드**:
```typescript
// 여러 컴포넌트에서 반복되는 날짜 포맷팅
const date = new Date(post.data.date);
const formatted = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
// → 유틸리티 함수로 추출 필요
```

#### 3. 확장성 문제
**문제**: 새로운 컴포넌트 추가나 기능 확장이 어려운 구조

**구체적 사례**:

**a) 하드코딩된 설정값**:
```typescript
// 여러 파일에 분산된 설정
const POSTS_PER_PAGE = 10;  // index.astro
const EXCERPT_LENGTH = 150;  // [...slug].astro
const SIDEBAR_WIDTH = 280;  // Sidebar.astro

// → constants.ts로 중앙화 필요
```

**b) 타입 정의 부족**:
```typescript
// src/utils/navigation.ts
export interface NavCategory {
  id: string;
  label: string;
  children?: NavCategory[];  // 정의되었지만 사용 안됨
}

// Props 타입 미정의된 컴포넌트들
// → 명확한 타입 정의 필요
```

#### 4. 초보자 친화성 부족
**문제**: 새로운 기여자가 코드베이스를 이해하고 활용하기 어려움

**부족한 요소**:
- ❌ 포스트 작성 가이드
- ❌ 컴포넌트 작성 가이드
- ❌ 아키텍처 문서
- ❌ 예제 템플릿
- ❌ JSDoc 주석

---

### 작업 항목 상세

#### 작업 1: Jekyll 관련 파일 완전 제거

**목표**: 저장소에서 모든 Jekyll 유산 제거, Astro 전용 코드베이스 구축

**안전한 제거 체크리스트**:

```bash
# 1단계: 제거 전 확인
# ✅ Astro 빌드 성공 확인
pnpm build

# ✅ 모든 포스트가 src/content/blog/에 마이그레이션됨 확인
# _posts/ 디렉토리와 src/content/blog/ 파일 수 비교

# 2단계: Jekyll 설정 파일 제거
rm _config.yml
rm Gemfile
rm Gemfile.lock
rm -rf .bundle/  # Bundle 설치 디렉토리 (있는 경우)

# 3단계: Jekyll 디렉토리 제거
rm -rf _includes/
rm -rf _layouts/
rm -rf _posts/      # ⚠️ 백업 확인 후
rm -rf _drafts/     # ⚠️ 백업 확인 후
rm -rf _pages/
rm -rf _data/
rm -rf _sass/
rm -rf assets/      # ⚠️ 이미지 등 재사용 에셋 확인 후

# 4단계: Jekyll 빌드 결과물 제거
rm -rf _site/
rm -rf .jekyll-cache/

# 5단계: .gitignore 정리
# Jekyll 관련 항목 제거
```

**.gitignore 업데이트**:
```diff
# .gitignore
- # Jekyll
- _site/
- .sass-cache/
- .jekyll-cache/
- .jekyll-metadata
- Gemfile.lock

+ # Astro
  dist/
  .astro/
  node_modules/
+
+ # Development
+ .DS_Store
+ *.log
```

**예상 결과**:
- 저장소 크기 15MB+ 감소
- 코드베이스 복잡도 감소
- 명확한 Astro 전용 구조

---

#### 작업 2: 사용하지 않는 코드 제거

**목표**: 미사용 코드 정리로 코드베이스 간소화

**Before (예시)**:
```typescript
// src/utils/navigation.ts
import { getCollection } from 'astro:content';
import { slug } from 'github-slugger';  // ❌ 미사용

export interface NavCategory {
  id: string;
  label: string;
  icon?: string;  // ❌ 미사용 필드
  children?: NavCategory[];  // ❌ 정의만 되고 사용 안됨
  color?: string;  // ❌ 미사용 필드
}

// ❌ 미사용 함수
export function formatCategoryName(name: string): string {
  return name.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

export const categoryLabels: Record<string, string> = {
  // ...
};
```

**After**:
```typescript
// src/utils/navigation.ts
import { getCollection } from 'astro:content';

export interface NavCategory {
  id: string;
  label: string;
  children?: NavCategory[];  // Phase 7에서 사용 예정
}

export const categoryLabels: Record<string, string> = {
  // ...
};
```

**체크리스트**:
- [ ] TypeScript unused imports 검사 (`pnpm type-check`)
- [ ] 미사용 CSS 클래스 제거 (개발자 도구로 검증)
- [ ] 미사용 함수 제거 (IDE의 "Find Usages" 기능 활용)
- [ ] 중복 코드 통합

---

#### 작업 3: 코드 가독성 개선

**목표**: 일관된 컨벤션으로 코드 가독성 향상

**3-1. 네이밍 컨벤션 통일**

**Before**:
```typescript
// 불일치: snake_case, camelCase, PascalCase 혼재
const category_list = ['web_fundamentals', 'pl'];
const PostList = posts.filter(...);
const get_date = (post) => post.data.date;
```

**After**:
```typescript
/**
 * 네이밍 컨벤션 가이드:
 * - 변수/함수: camelCase (categoryList, getDate)
 * - 상수: UPPER_SNAKE_CASE (MAX_POSTS_PER_PAGE)
 * - 타입/인터페이스: PascalCase (NavCategory, PostData)
 * - 파일명: kebab-case (post-layout.astro, format-date.ts)
 * - 주석: 한글로 설명, 영어 변수명
 */

const categoryList = ['webFundamentals', 'programmingLanguages'];
const filteredPosts = posts.filter(...);
const getPostDate = (post: Post) => post.data.date;
```

**3-2. 매직 넘버/문자열 상수화**

**Before**:
```typescript
// src/components/Sidebar.astro
<div class="sidebar" style="width: 280px; max-height: calc(100vh - 80px);">

// src/pages/index.astro
const posts = await getCollection('blog');
const recentPosts = posts.slice(0, 10);
```

**After**:
```typescript
// src/constants.ts - 새 파일 생성
/**
 * 애플리케이션 전역 상수 정의
 */

// Layout
export const LAYOUT = {
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 80,
  MAX_CONTENT_WIDTH: 1200,
} as const;

// Pagination
export const PAGINATION = {
  POSTS_PER_PAGE: 10,
  POSTS_PER_CATEGORY: 20,
} as const;

// Content
export const CONTENT = {
  EXCERPT_LENGTH: 150,
  MAX_TITLE_LENGTH: 60,
} as const;

// Site Info
export const SITE = {
  TITLE: '인생은 B와 D사이 Code다',
  DESCRIPTION: 'Tolerblanc의 기술 블로그',
  AUTHOR: 'Tolerblanc',
  URL: 'https://tolerblanc.github.io',
} as const;

// 사용
import { LAYOUT, PAGINATION } from '@/constants';

<div class="sidebar" style={`width: ${LAYOUT.SIDEBAR_WIDTH}px;`}>
const recentPosts = posts.slice(0, PAGINATION.POSTS_PER_PAGE);
```

**3-3. 함수 분리 및 단일 책임 원칙**

**Before**:
```typescript
// src/pages/blog/[...slug].astro
const post = await getEntry('blog', params.slug);
const date = new Date(post.data.date);
const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const readingTime = Math.ceil(post.body.split(/\s+/).length / 200);
```

**After**:
```typescript
// src/utils/format.ts - 새 파일 생성
/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷
 * @param date - 포맷할 날짜 객체
 * @returns YYYY-MM-DD 형식의 문자열
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 글의 예상 읽기 시간 계산 (분 단위)
 * @param content - 글 본문
 * @param wordsPerMinute - 분당 읽기 단어 수 (기본값: 200)
 * @returns 예상 읽기 시간 (분)
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// src/pages/blog/[...slug].astro
import { formatDate, calculateReadingTime } from '@/utils/format';

const post = await getEntry('blog', params.slug);
const formattedDate = formatDate(new Date(post.data.date));
const readingTime = calculateReadingTime(post.body);
```

**3-4. 주석 개선**

**Before**:
```typescript
// get posts
const posts = await getCollection('blog');
// filter
const filtered = posts.filter(p => !p.data.draft);
```

**After**:
```typescript
/**
 * 블로그 포스트 목록을 가져와 게시 가능한 포스트만 필터링
 * - draft 상태가 아닌 포스트만 포함
 * - 날짜 기준 내림차순 정렬
 */
const publishedPosts = (await getCollection('blog'))
  .filter(post => !post.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
```

---

#### 작업 4: 확장성 고려 리팩토링

**목표**: 미래 기능 추가를 쉽게 하는 구조 구축

**4-1. 설정값 중앙화**

**파일 구조**:
```
src/
├── config/
│   ├── site.ts       # 사이트 메타데이터
│   ├── analytics.ts  # Analytics 설정
│   └── theme.ts      # 테마 설정
└── constants.ts      # 전역 상수
```

**src/config/site.ts**:
```typescript
/**
 * 사이트 메타데이터 및 설정
 */
export const SITE_CONFIG = {
  // 기본 정보
  title: '인생은 B와 D사이 Code다',
  description: 'Tolerblanc의 기술 블로그',
  author: 'Tolerblanc',

  // URL 설정
  url: 'https://tolerblanc.github.io',
  baseUrl: '/experimental',

  // 소셜 미디어
  social: {
    github: 'https://github.com/Tolerblanc',
    email: 'your-email@example.com',
  },

  // 댓글 시스템 (Giscus)
  comments: {
    repo: 'Tolerblanc/Tolerblanc.github.io',
    repoId: 'R_kgDOJ01EaQ',
    category: 'Announcements',
    categoryId: 'DIC_kwDOJ01Eac4Cerab',
    theme: 'dark_dimmed',
  },

  // 언어 설정
  locale: 'ko-KR',
  timezone: 'Asia/Seoul',
} as const;
```

**src/config/analytics.ts**:
```typescript
/**
 * Google Analytics 설정
 */
export const ANALYTICS_CONFIG = {
  enabled: true,
  trackingId: 'G-JWJT3DQR8G',

  // 개발 환경에서는 비활성화
  isProduction: import.meta.env.PROD,
} as const;
```

**4-2. 컴포넌트 Props 타입 명확화**

**Before**:
```typescript
// src/components/PostCard.astro
---
const { post } = Astro.props;  // ❌ 타입 없음
---
```

**After**:
```typescript
// src/types/post.ts - 새 파일 생성
import type { CollectionEntry } from 'astro:content';

/**
 * 블로그 포스트 타입
 */
export type Post = CollectionEntry<'blog'>;

/**
 * 포스트 카드 컴포넌트 Props
 */
export interface PostCardProps {
  /** 표시할 포스트 데이터 */
  post: Post;
  /** 전체 너비로 표시 여부 */
  fullWidth?: boolean;
  /** 이미지 표시 여부 */
  showImage?: boolean;
}

// src/components/PostCard.astro
---
import type { PostCardProps } from '@/types/post';

interface Props extends PostCardProps {}

const {
  post,
  fullWidth = false,
  showImage = true
} = Astro.props;
---
```

**4-3. 재사용 가능한 유틸리티 함수 분리**

**파일 구조**:
```
src/utils/
├── format.ts        # 포맷팅 유틸리티
├── navigation.ts    # 네비게이션 관련
├── post.ts          # 포스트 관련 유틸리티
└── seo.ts           # SEO 관련 유틸리티
```

**src/utils/post.ts**:
```typescript
import type { Post } from '@/types/post';

/**
 * 포스트를 날짜 기준 내림차순 정렬
 */
export function sortPostsByDate(posts: Post[]): Post[] {
  return posts.sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime()
  );
}

/**
 * 게시 가능한 포스트만 필터링 (draft 제외)
 */
export function filterPublishedPosts(posts: Post[]): Post[] {
  return posts.filter(post => !post.data.draft);
}

/**
 * 카테고리별로 포스트 그룹화
 */
export function groupPostsByCategory(posts: Post[]): Map<string, Post[]> {
  const grouped = new Map<string, Post[]>();

  for (const post of posts) {
    const category = post.data.categories?.[0] ?? 'uncategorized';
    const existing = grouped.get(category) ?? [];
    grouped.set(category, [...existing, post]);
  }

  return grouped;
}
```

**4-4. 컴포넌트 디렉토리 구조 개선**

**Before**:
```
src/components/
├── GiscusComments.astro
├── Header.astro
├── Notice.astro
└── Sidebar.astro
```

**After**:
```
src/components/
├── layout/
│   ├── Header.astro
│   ├── Footer.astro
│   └── Sidebar.astro
├── post/
│   ├── PostCard.astro
│   ├── PostList.astro
│   └── PostMeta.astro
├── common/
│   ├── Notice.astro
│   ├── CodeBlock.astro
│   └── ScrollToTop.astro
└── features/
    ├── GiscusComments.astro
    ├── TableOfContents.astro
    └── ReadingProgress.astro
```

---

#### 작업 5: 초보자 친화적 문서화

**목표**: FE 초보자도 쉽게 기여할 수 있도록 상세한 가이드 제공

**5-1. POST_GUIDE.md - 새 포스트 작성 가이드**

```markdown
# 블로그 포스트 작성 가이드

이 문서는 Tolerblanc 블로그에 새로운 포스트를 작성하는 방법을 설명합니다.

## 빠른 시작

### 1. 포스트 파일 생성

포스트는 `src/content/blog/` 디렉토리에 MDX 파일로 작성합니다.

**파일 위치 규칙**:
```
src/content/blog/[카테고리]/[하위카테고리]/포스트제목.mdx
```

**예시**:
```
src/content/blog/web/react/react-hooks-guide.mdx
src/content/blog/algorithm/sorting/quick-sort.mdx
```

### 2. Frontmatter 작성

모든 포스트는 YAML frontmatter로 시작해야 합니다:

```yaml
---
title: "포스트 제목"
date: 2025-10-25
categories: [web, react]  # [대분류, 소분류]
tags: [React, Hooks, JavaScript]
excerpt: "포스트의 간단한 요약 (150자 이내)"
draft: false  # true면 빌드에서 제외
---
```

### 3. 본문 작성

MDX 형식으로 작성하며, Markdown + React 컴포넌트를 사용할 수 있습니다.

#### 기본 Markdown

\`\`\`markdown
# 제목 1
## 제목 2
### 제목 3

**굵게**, *기울임*, `코드`

- 목록 1
- 목록 2

1. 순서 목록 1
2. 순서 목록 2
\`\`\`

#### 코드 블록

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

#### Notice 컴포넌트

<Notice type="info">
💡 유용한 정보나 팁을 강조할 때 사용합니다.
</Notice>

<Notice type="warning">
⚠️ 주의사항이나 경고를 표시할 때 사용합니다.
</Notice>

### 4. 빌드 및 미리보기

\`\`\`bash
# 개발 서버 시작
pnpm dev

# 브라우저에서 확인
http://localhost:4321/blog/[카테고리]/[포스트제목]
\`\`\`

## 카테고리 가이드

### 사용 가능한 카테고리

| 대분류 | 소분류 예시 |
|--------|-------------|
| web | react, vue, javascript, css |
| algorithm | sorting, graph, dp |
| cs | os, network, database |
| pl | cpp, python, java |
| devops | docker, ci-cd, aws |

### 새 카테고리 추가

1. `src/utils/navigation.ts`에 카테고리 정의 추가
2. `src/pages/blog/category/` 에 카테고리 페이지 생성

## 체크리스트

포스트 작성 완료 전 확인사항:

- [ ] frontmatter 필수 필드 모두 작성 (title, date, categories)
- [ ] excerpt가 150자 이내로 작성됨
- [ ] 코드 블록에 언어 명시됨
- [ ] 로컬에서 빌드 성공 확인 (`pnpm build`)
- [ ] 브라우저에서 렌더링 확인
- [ ] 오타 및 문법 검토 완료

## 문제 해결

### 빌드 실패

\`\`\`bash
# 타입 체크
pnpm type-check

# 에러 로그 확인
pnpm build 2>&1 | tee build.log
\`\`\`

### MDX 문법 에러

- MDX는 XML 형식이므로 모든 태그가 닫혀야 함
- JSX 표현식은 `{}`로 감싸기
- HTML 속성은 camelCase 사용 (className, onClick)
```

**5-2. COMPONENT_GUIDE.md - 컴포넌트 작성 가이드**

```markdown
# 컴포넌트 작성 가이드

새로운 Astro 컴포넌트를 작성하는 방법을 설명합니다.

## 컴포넌트 구조

### 기본 템플릿

\`\`\`astro
---
// src/components/example/ExampleComponent.astro

import type { ExampleProps } from '@/types/example';

/**
 * 컴포넌트 설명
 * @example
 * <ExampleComponent title="제목" />
 */
interface Props extends ExampleProps {}

const { title, description = '기본값' } = Astro.props;
---

<div class="example-component">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  .example-component {
    /* 컴포넌트별 스타일 */
    padding: 1rem;
  }
</style>
\`\`\`

### TypeScript Props 정의

\`\`\`typescript
// src/types/example.ts

/**
 * ExampleComponent Props
 */
export interface ExampleProps {
  /** 컴포넌트 제목 */
  title: string;

  /** 설명 (선택사항) */
  description?: string;

  /** 추가 CSS 클래스 */
  className?: string;
}
\`\`\`

## 스타일링 가이드

### Tailwind 우선 사용

\`\`\`astro
<!-- ✅ Tailwind 유틸리티 사용 -->
<div class="p-4 bg-white dark:bg-gray-800 rounded-lg">
  <h2 class="text-2xl font-bold">제목</h2>
</div>
\`\`\`

### 커스텀 스타일이 필요한 경우

\`\`\`astro
<div class="custom-component">
  <!-- 내용 -->
</div>

<style>
  .custom-component {
    /* Tailwind로 표현 불가능한 스타일만 */
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  }
</style>
\`\`\`

## 컴포넌트 배치 규칙

\`\`\`
src/components/
├── layout/         # 레이아웃 컴포넌트 (Header, Footer, Sidebar)
├── post/           # 포스트 관련 (PostCard, PostList)
├── common/         # 공통 UI (Notice, Button)
└── features/       # 기능별 (Comments, TOC)
\`\`\`

## JSDoc 작성

\`\`\`typescript
/**
 * 포스트 카드 컴포넌트
 *
 * 블로그 포스트의 미리보기 카드를 렌더링합니다.
 * 제목, 날짜, 태그, 요약을 표시합니다.
 *
 * @example
 * ```astro
 * <PostCard post={post} showImage={true} />
 * ```
 */
interface Props {
  /** 표시할 포스트 데이터 */
  post: Post;

  /** 이미지 표시 여부 (기본값: true) */
  showImage?: boolean;
}
\`\`\`

## 예제: Notice 컴포넌트

\`\`\`astro
---
// src/components/common/Notice.astro

/**
 * 정보, 경고, 에러 등을 강조하는 박스 컴포넌트
 */
interface Props {
  /** Notice 타입 */
  type?: 'info' | 'warning' | 'error' | 'success';

  /** 제목 (선택사항) */
  title?: string;
}

const { type = 'info', title } = Astro.props;

const typeStyles = {
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-500',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-500',
};
---

<div class={`notice border-l-4 p-4 ${typeStyles[type]}`}>
  {title && <h4 class="font-bold mb-2">{title}</h4>}
  <div class="content">
    <slot />
  </div>
</div>
\`\`\`

## 체크리스트

- [ ] TypeScript Props 타입 정의
- [ ] JSDoc 주석 작성
- [ ] Tailwind 우선 사용
- [ ] 다크 모드 고려 (dark: 접두사)
- [ ] 접근성 고려 (ARIA 속성)
- [ ] 반응형 디자인 (모바일, 태블릿, 데스크톱)
```

**5-3. ARCHITECTURE.md - 코드베이스 구조 설명**

```markdown
# 코드베이스 아키텍처

## 프로젝트 구조

\`\`\`
Blog/
├── src/
│   ├── components/      # Astro 컴포넌트
│   │   ├── layout/      # 레이아웃 (Header, Footer, Sidebar)
│   │   ├── post/        # 포스트 관련
│   │   ├── common/      # 공통 UI
│   │   └── features/    # 기능별 컴포넌트
│   ├── content/
│   │   └── blog/        # 블로그 포스트 (MDX)
│   ├── layouts/         # 페이지 레이아웃
│   ├── pages/           # 라우팅
│   │   ├── blog/        # 블로그 페이지
│   │   ├── category/    # 카테고리 페이지
│   │   └── tags/        # 태그 페이지
│   ├── styles/          # 글로벌 스타일
│   ├── utils/           # 유틸리티 함수
│   ├── types/           # TypeScript 타입 정의
│   ├── config/          # 설정 파일
│   └── constants.ts     # 전역 상수
├── public/              # 정적 에셋
├── astro.config.mjs     # Astro 설정
└── tailwind.config.mjs  # Tailwind 설정
\`\`\`

## 주요 디렉토리 설명

### src/content/blog/
- **역할**: 블로그 포스트 저장 (MDX 형식)
- **구조**: `[카테고리]/[하위카테고리]/포스트명.mdx`
- **Content Collections API** 사용

### src/components/
- **layout/**: 전체 레이아웃 구성 요소
- **post/**: 포스트 카드, 목록 등
- **common/**: 재사용 가능한 UI 컴포넌트
- **features/**: 댓글, TOC 등 특정 기능

### src/pages/
- **파일 기반 라우팅**: 파일명이 URL이 됨
- **동적 라우팅**: `[...slug].astro` 형식
- **예시**:
  - `index.astro` → `/`
  - `about.astro` → `/about`
  - `blog/[...slug].astro` → `/blog/*`

### src/utils/
유틸리티 함수 모음:
- `format.ts`: 날짜, 텍스트 포맷팅
- `post.ts`: 포스트 관련 로직
- `navigation.ts`: 네비게이션 구조
- `seo.ts`: SEO 메타데이터 생성

### src/config/
애플리케이션 설정:
- `site.ts`: 사이트 메타데이터
- `analytics.ts`: Google Analytics
- `theme.ts`: 테마 설정

## 데이터 흐름

\`\`\`
1. Content Collections API
   ↓
2. getCollection('blog')
   ↓
3. 포스트 필터링/정렬 (utils/post.ts)
   ↓
4. 컴포넌트 Props로 전달
   ↓
5. 렌더링
\`\`\`

## 빌드 프로세스

\`\`\`bash
pnpm build
  ↓
1. astro check (타입 검사)
  ↓
2. Astro 빌드
  ↓
3. MDX 처리 (remark/rehype 플러그인)
  ↓
4. Tailwind CSS 빌드
  ↓
5. 정적 HTML 생성 → dist/
\`\`\`

## 개발 워크플로우

1. **새 포스트 작성**: `src/content/blog/`에 MDX 파일 생성
2. **컴포넌트 개발**: `src/components/`에 Astro 컴포넌트 작성
3. **스타일링**: Tailwind 유틸리티 또는 `<style>` 블록
4. **타입 정의**: `src/types/`에 인터페이스 추가
5. **빌드 테스트**: `pnpm build && pnpm preview`

## 주요 기술 스택

- **Astro 5.14.4**: 정적 사이트 생성
- **MDX**: Markdown + JSX
- **Tailwind CSS**: 유틸리티 우선 CSS
- **TypeScript**: 타입 안전성
- **Giscus**: 댓글 시스템
```

**5-4. 각 컴포넌트에 JSDoc 추가 (예시)**

```typescript
// src/components/layout/Header.astro
---
/**
 * 사이트 헤더 컴포넌트
 *
 * 네비게이션 메뉴, 다크모드 토글, 로고를 포함합니다.
 * 모든 페이지 상단에 표시되며, 고정(sticky) 레이아웃을 사용합니다.
 *
 * @component
 * @example
 * ```astro
 * <Header />
 * ```
 */

import { SITE_CONFIG } from '@/config/site';
---

<header class="sticky top-0 z-50 bg-white dark:bg-gray-900">
  <!-- 헤더 내용 -->
</header>
```

---

### Before / After 비교

#### Before: 현재 상태
```
저장소 크기: ~20MB (Jekyll 파일 포함)
파일 구조: 혼재 (Jekyll + Astro)
코드 스타일: 불일치
타입 안전성: 부분적
문서화: 부족 (MIGRATION_PROGRESS.md만 존재)
초보자 친화성: 낮음
```

#### After: Phase 8 완료 후
```
저장소 크기: ~5MB (Jekyll 제거)
파일 구조: Astro 전용, 명확한 계층 구조
코드 스타일: 일관된 컨벤션
타입 안전성: 완전한 타입 정의
문서화: 완전 (4개 가이드 문서 + JSDoc)
초보자 친화성: 높음 (상세한 가이드 + 예제)
```

---

### 작업 우선순위

1. **High**: Jekyll 파일 제거 (즉시 실행 가능, 저장소 정리)
2. **High**: 상수 중앙화 (constants.ts, config/) - 코드 품질의 기반
3. **Medium**: 타입 정의 명확화 (types/) - 타입 안전성 향상
4. **Medium**: 유틸리티 함수 분리 (utils/) - 재사용성 향상
5. **Medium**: 네이밍 컨벤션 통일 - 가독성 개선
6. **Low**: 미사용 코드 제거 - 최적화
7. **Low**: 디렉토리 구조 개선 - 유지보수성
8. **Low**: 문서화 작업 (가이드 4종) - 초보자 친화성

---

## Phase 7 완료 상세 (2025-10-26)

### 주요 성과

#### 1. 디자인 시스템 구축
- **design-tokens.css**: CSS 변수 기반 디자인 토큰 시스템
  - 색상 팔레트 (Primary, Secondary, Accent, Neutral)
  - 타이포그래피 스케일 (xs ~ 4xl)
  - 간격 시스템 (1 ~ 20)
  - 반응형 breakpoints
  - 애니메이션 타이밍

#### 2. 다크/라이트 모드 완전 구현
- 모든 하드코딩된 색상을 CSS 변수로 전환
- Sidebar, Header, PostLayout 전역 테마 일관성 확보
- prose-invert 적용으로 콘텐츠 가독성 향상

#### 3. 네비게이션 개선
- **2-depth 카테고리 구조**: Web, Algorithm, DevOps 등 그룹핑
- **자동 확장**: 현재 경로 기반 카테고리 자동 확장
- **이모지 제거**: 깔끔하고 전문적인 UI
- **부드러운 애니메이션**: 확장/축소 트랜지션

#### 4. 사용자 경험 컴포넌트
- **CodeCopyButton**: Clipboard API 기반 코드 복사 버튼
  - 성공 피드백 애니메이션
  - 다크 모드 대응
- **ScrollToTop**: IntersectionObserver 활용 스크롤 탑 버튼
  - 300px 이상 스크롤 시 표시
  - 부드러운 스크롤 애니메이션
- **ReadingProgress**: 상단 고정 읽기 진행도 바
  - 스크롤 진행률 실시간 계산
  - 반응형 디자인

#### 5. TOC 개선
- **활성 섹션 하이라이팅**: IntersectionObserver 기반
  - 현재 읽고 있는 섹션 자동 하이라이트
  - 파란색 색상 + 좌측 보더 강조
  - rootMargin: '-100px 0px -66%' 최적화된 감지 영역
- **Sticky TOC**: 우측 사이드바 고정
- **부드러운 스크롤**: 클릭 시 해당 섹션으로 이동

### 기술 구현

#### 생성된 파일
```
src/styles/design-tokens.css       - 디자인 시스템 토큰
src/components/CodeCopyButton.astro - 코드 복사 버튼
src/components/ScrollToTop.astro    - 스크롤 탑 버튼
src/components/ReadingProgress.astro - 읽기 진행도 바
```

#### 수정된 파일
```
src/layouts/PostLayout.astro   - TOC IntersectionObserver 스크립트 추가
src/layouts/BaseLayout.astro   - 디자인 토큰 import
src/components/Sidebar.astro   - 이모지 제거, 2-depth UI
src/components/Header.astro    - 이모지 제거, 깔끔한 네비게이션
src/styles/global.css          - 다크 모드 CSS 변수 적용
```

### 검증 결과

#### 빌드 성공
```bash
✓ 124 pages in 3.21s
- 0 errors
- 0 warnings
```

#### Playwright 테스트
```bash
✅ TOC 활성화 하이라이팅 확인
✅ 스크롤 시 활성 섹션 자동 업데이트
✅ 다크/라이트 모드 전환 정상 작동
✅ 반응형 디자인 확인 완료
```

#### 스크린샷
- `toc-active-highlighting.png` - TOC 활성화 상태 캡처

### 다음 단계
- Phase 6: 성능 최적화 (이미지, 폰트)
- Phase 8: 코드베이스 정리 및 코드 퀄리티 최적화

---

**마지막 업데이트**: 2025-10-26 (Phase 7 완료)
**다음 목표**: Phase 6 (성능 최적화) 또는 Phase 8 (코드베이스 정리) 진행
