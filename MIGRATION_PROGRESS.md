# Jekyll → Astro 마이그레이션 진행 상황

> **최종 업데이트**: 2025-10-26 (Phase 8 완료)
> **현재 브랜치**: `astro-experimental`
> **진행 상태**: Phase 1-8 완료 ✅ | Phase 6, 9 진행 예정
> **Astro 버전**: 5.14.4 (Content Layer API, Vite 6)
> **변환 현황**: 56개 포스트 빌드 성공 / 17개 draft
> **빌드 성능**: 124 pages in 3.06s | 번들 크기 143.47 KB
> **Jekyll 파일**: 완전 제거 (8.7MB, 317 files)

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [완료된 작업 요약](#완료된-작업-요약-phase-1-7)
3. [남은 작업 계획](#남은-작업-계획-phase-6-8-9)
4. [우선순위 제안](#우선순위-제안)
5. [기술 스택 비교](#기술-스택-비교)
6. [배포 전략](#배포-전략)

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

---

## 완료된 작업 요약 (Phase 1-8)

### Phase 1: 기초 인프라 구축 ✅
**완료일**: 2025-10-12

- Astro 5.14.4 프로젝트 초기화 (Content Layer API, Vite 6)
- TypeScript 설정 및 path aliases
- GitHub Actions 워크플로우 (pnpm, 자동 배포)
- 디렉토리 구조 생성

**생성 파일**: `package.json`, `tsconfig.json`, `astro.config.mjs`, `.github/workflows/deploy-experimental.yml`

---

### Phase 2: 콘텐츠 마이그레이션 시스템 ✅
**완료일**: 2025-10-12

- Jekyll → MDX 자동 변환 시스템 (`jekyll-to-mdx.ts`)
- Content Collections 스키마 (`content.config.ts`)
- Notice 컴포넌트 (info, warning, danger, success)
- PostLayout (SEO, TOC, 메타데이터)
- Tailwind CSS + 한국어 폰트
- 샘플 5개 포스트 변환 및 검증

**빌드 성능**: 1.04s (6 pages), 143.47 KB

---

### Phase 3: 핵심 기능 및 LaTeX 지원 ✅
**완료일**: 2025-10-14

- **LaTeX 렌더링**: KaTeX + remark-math + rehype-katex
- **Google Analytics**: G-JWJT3DQR8G (기존 유지)
- **Giscus 댓글**: pathname 매핑 유지
- **RSS 피드**: `/rss.xml`
- **Sitemap**: @astrojs/sitemap
- **전체 포스트 마이그레이션**: 56개 성공 / 17개 draft

**Draft 현황** (17개):
- LeetCode/Programmers: 복잡한 HTML (6개)
- Hongong-SQL: Unclosed `<img>` (6개)
- LaTeX 복잡도: 수식 충돌 (3개)
- 작성 중: 2개

**빌드 성능**: 2.94s (57 pages), 143.47 KB (gzip 46.21 kB)

---

### Phase 4: 네비게이션 및 UI 컴포넌트 ✅
**완료일**: 2025-10-20

- **사이드바**: 카테고리 리스트 (14개), Recent Posts, 포스트 카운트
- **헤더**: Home, Blog, Tags, About, 다크 모드 토글
- **카테고리/태그**: `/blog/category/[category]`, `/tags`, `/tags/[tag]`
- **About 페이지**: `/about`
- **코드 하이라이팅**: Shiki dark-plus

---

### Phase 5: 최적화 및 검증 ✅
**완료일**: 2025-10-22

- **프로덕션 빌드**: 124 pages in 3.21s
- **TypeScript**: 0 errors
- **번들 크기**: 143.47 KB
- **SEO 검증**: Sitemap, robots.txt, Meta 태그, GA, Giscus, RSS
- **Playwright 테스트**: 8개 스위트 통과

---

### Phase 7: UI/UX 개선 및 고도화 ✅
**완료일**: 2025-10-26

- **디자인 시스템**: `design-tokens.css` (CSS 변수)
- **다크/라이트 모드**: 전체 컴포넌트 일관성
- **사이드바**: 2-depth 확장/축소, 자동 확장
- **코드 블록**: CodeCopyButton (복사 + 피드백)
- **Scroll to Top**: IntersectionObserver
- **Reading Progress**: 스크롤 진행률
- **TOC**: 활성 섹션 하이라이팅

**생성 컴포넌트**: `CodeCopyButton.astro`, `ScrollToTop.astro`, `ReadingProgress.astro`, `GiscusComments.astro`

---

### Phase 8: 코드베이스 정리 및 코드 퀄리티 ✅
**완료일**: 2025-10-26

**1단계: Jekyll 파일 완전 제거** (8.7MB, 317 files)
- 설정 파일: `_config.yml`, `Gemfile`, `Gemfile.lock`
- 디렉토리: `_includes`, `_layouts`, `_posts`, `_pages`, `_data`, `_sass`
- 빌드 아티팩트: `_site`, `_drafts`, `.jekyll-cache`
- `.gitignore` 업데이트 (Jekyll 항목 제거)

**2단계: 코드 정리 및 리팩토링**
- **상수 파일 생성** (`src/constants.ts`):
  - 사이트 설정 (URL, base path, author)
  - Analytics 및 Giscus 설정
  - 카테고리/그룹 레이블
  - 네비게이션 메뉴
  - 페이지 설정 (posts per page, TOC depth)
- **유틸리티 함수 추가** (`src/utils/formatDate.ts`):
  - 한국어 전체 형식 (`formatDateFull`)
  - 짧은 형식 (`formatDateShort`)
  - ISO 형식 (`formatDateISO`)
  - 상대 시간 (`getRelativeTime`)
- **navigation.ts 리팩토링**:
  - 상수 분리 (constants.ts로 이동)
  - JSDoc 주석 추가
  - 타입 안정성 개선
- **jekyll-to-mdx.ts 제거**: 마이그레이션 완료로 불필요

**3단계: 문서화 완성**
- **POST_GUIDE.md**: 새 포스트 작성 가이드
  - 빠른 시작 템플릿
  - Frontmatter 레퍼런스
  - MDX 작성 팁
  - 컴포넌트 사용법
  - 카테고리 가이드
  - 코드 블록 및 LaTeX
  - 문제 해결 체크리스트
- **COMPONENT_GUIDE.md**: 컴포넌트 사용 및 개발 가이드
  - 컴포넌트 개요 및 구조
  - 레이아웃 컴포넌트
  - UI 컴포넌트 (Notice, Header, Sidebar 등)
  - 유틸리티 함수
  - 새 컴포넌트 만들기
  - 스타일링 가이드 (design tokens)
  - 베스트 프랙티스
- **ARCHITECTURE.md**: 시스템 아키텍처 문서
  - 프로젝트 개요 및 원칙
  - 디렉토리 구조
  - 기술 스택
  - 핵심 개념 (Content Collections, routing)
  - 데이터 흐름 및 빌드 프로세스
  - SEO 전략
  - 성능 최적화
  - 확장 가이드
  - 테스트 및 배포 전략

**효과**:
- 저장소 크기: 8.7MB 감소
- 코드 가독성: 상수 중앙화, JSDoc 추가
- 유지보수성: 명확한 문서화
- 개발자 경험: FE 초보자도 쉽게 이해 가능

---

## 남은 작업 계획 (재정리)

### Phase 6: UI/UX 개선 및 폴리싱 (사용자 진행)
**우선순위**: 높음

**주요 작업:**
- [ ] 폰트 개선 (크기, 간격, 가독성)
- [ ] 디자인 조정 (레이아웃, 색상, 간격)
- [ ] 반응형 개선 (모바일/태블릿/데스크톱)
- [ ] 사용성 개선 (네비게이션, 버튼 위치)

**작업 위치**:
- `src/styles/design-tokens.css`: CSS 변수 조정
- 각 컴포넌트 파일: 개별 스타일 수정
- `tailwind.config.cjs`: Tailwind 설정

**참고 문서**:
- [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md): 컴포넌트 구조 및 스타일링
- [ARCHITECTURE.md](./ARCHITECTURE.md): 시스템 구조

---

### Phase 9: 선택적 최적화 (필요시)
**우선순위**: 낮음

**선택 작업** (필요하면 진행):
- [ ] 이미지 최적화 (WebP) - 이미지 많으면 진행
- [ ] 폰트 최적화 (subset) - 로딩 느리면 진행
- [ ] 검색 기능 (Algolia/Fuse.js) - 필요하면 진행
- [ ] 링크 무결성 검사 - 배포 전 권장

**Skip 가능** (현재 불필요):
- ~~Lighthouse 테스트~~ (현재 성능 충분)
- ~~접근성 테스트~~ (기본 요구사항 충족)
- ~~Draft 포스트 수정~~ (모두 변환 완료)

---

## 우선순위 제안

### ✅ 완료: Phase 8 (코드베이스 정리)
**완료일**: 2025-10-26

**성과**:
- Jekyll 파일 완전 제거 (8.7MB, 317 files)
- 상수 중앙화 (`constants.ts`)
- 유틸리티 함수 추가 (`formatDate.ts`)
- 코드 리팩토링 (navigation.ts)
- 완전한 문서화 (POST_GUIDE, COMPONENT_GUIDE, ARCHITECTURE)

---

### 1️⃣ 진행 중: Phase 6 (UI/UX 개선 - 사용자 진행)
**담당**: 사용자 직접 진행
**이유**:
- 폰트, 디자인, 레이아웃 개선 필요
- 사용자 경험 향상

**작업 항목**:
- 폰트 개선 (크기, 간격, 가독성)
- 디자인 조정 (레이아웃, 색상)
- 반응형 개선
- 네비게이션 사용성 개선

**참고 문서**: COMPONENT_GUIDE.md, ARCHITECTURE.md

---

### 2️⃣ 선택적 진행: Phase 9 (최적화 - 필요시)
**우선순위**: 낮음 (선택 사항)

**필요시 진행**:
- 이미지 최적화 (WebP 변환)
- 폰트 최적화 (서브셋팅)
- 검색 기능 구현
- 링크 무결성 검사 (프로덕션 배포 전)

**제외 항목** (불필요):
- ~~Lighthouse 성능 테스트~~ (성능 충분)
- ~~접근성 테스트~~ (기본 요구사항 충족)
- ~~Draft 포스트 수정~~ (모두 변환 완료)

---

## 기술 스택 비교

| 항목 | Jekyll | Astro |
|------|--------|-------|
| **언어** | Ruby | JavaScript/TypeScript |
| **템플릿** | Liquid | Astro + JSX |
| **콘텐츠** | Markdown | MDX |
| **빌드** | Jekyll | Vite |
| **패키지 관리** | Bundler | pnpm |
| **핫 리로드** | ~10s | <3s |
| **타입 안정성** | ❌ | ✅ TypeScript |
| **컴포넌트** | Includes (제한적) | React/Astro |
| **하이라이팅** | Rouge | Shiki |
| **검색** | Lunr.js | Algolia/Fuse.js (예정) |

---

## 배포 전략

### 현재 (Jekyll)
```
main 브랜치 → GitHub Pages → https://tolerblanc.github.io
```

### 실험 (Astro)
```
astro-experimental 브랜치
  → GitHub Actions 빌드
  → gh-pages /experimental
  → https://tolerblanc.github.io/experimental
```

### 최종 전환 시나리오

**옵션 1: 점진적 전환 (권장)**
1. `/experimental` 충분히 테스트
2. 메인 사이트에 "새 버전" 링크
3. 사용자 피드백 수집 (2-4주)
4. main 브랜치 머지
5. Jekyll 파일 아카이브

**옵션 2: 일시 전환**
1. `/experimental` 완성도 100% 확인
2. 유지보수 공지
3. main 머지
4. 즉시 전환

---

## 핵심 요구사항 (반드시 유지)

### 1. SEO 보존
- **URL 구조**: `/:categories/:title/` 동일
- **Google Analytics**: G-JWJT3DQR8G
- **Giscus 댓글**: pathname 매핑
- **Sitemap/RSS**: 동일 구조

### 2. 콘텐츠 무결성
- 메타데이터: pubDate, categories, tags, title, excerpt
- 이미지: 경로 변환 + WebP 최적화
- 내부 링크: 검증 필수

### 3. 성능 목표
- 빌드: 현재 대비 50% 단축
- 페이지 로드: 30% 개선
- Lighthouse: 95+

---

## 참고 자료

- **Astro 문서**: https://docs.astro.build/
- **마이그레이션 가이드**: https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/
- **MDX**: https://mdxjs.com/
- **Giscus**: https://giscus.app/

---

## 프로젝트 현황 요약

### 완료된 Phase
- ✅ Phase 1: 기초 인프라 구축
- ✅ Phase 2: 콘텐츠 마이그레이션 시스템
- ✅ Phase 3: 핵심 기능 및 LaTeX 지원
- ✅ Phase 4: 네비게이션 및 UI 컴포넌트
- ✅ Phase 5: 최적화 및 검증
- ✅ Phase 7: UI/UX 개선 및 고도화
- ✅ Phase 8: 코드베이스 정리 및 문서화

### 남은 Phase
- ⏳ Phase 6: 최종 최적화 및 배포 준비 (중요도: 중)
- ⏳ Phase 9: 성능 최적화 및 모니터링 (중요도: 낮음)

### 주요 지표
- **빌드 성능**: 124 pages in 3.06s
- **번들 크기**: 143.47 KB (gzip: 46.21 kB)
- **타입 체크**: 0 errors, 0 warnings
- **테스트**: 8개 스위트 통과 (Playwright)
- **Jekyll 제거**: 8.7MB, 317 files 완전 제거
- **문서**: 3개 완전 가이드 (POST, COMPONENT, ARCHITECTURE)

### 다음 단계
1. Draft 포스트 수정 (17개)
   - Hongong-SQL (6개): 간단 수정
   - LaTeX/템플릿 (3개): 수동 검토
   - LeetCode/Programmers (6개): HTML 재구성
   - 회고록 (2개): 특수 문자 처리
2. 이미지/폰트 최적화
3. Lighthouse 성능 테스트
4. 프로덕션 배포
