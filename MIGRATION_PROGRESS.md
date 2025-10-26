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

## 완료된 작업 요약 (Phase 1-7)

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

## 남은 작업 계획 (Phase 6, 8, 9)

### Phase 6: 최종 최적화 및 배포 준비
**우선순위**: 중 | **예상 시간**: 8-12시간

**주요 작업:**
- [ ] Draft 포스트 수정 (17개)
  - **우선순위 1**: Hongong-SQL (6개) - `<img>` → `<img />`
  - **우선순위 2**: LaTeX/템플릿 (3개) - 수동 검토
  - **우선순위 3**: LeetCode/Programmers (6개) - HTML 재구성
  - **우선순위 4**: 회고록 (2개) - 특수 문자 이스케이프
- [ ] 이미지 최적화 (@astrojs/image 또는 Sharp)
- [ ] 한글 폰트 최적화 (subset, preload)
- [ ] Lighthouse 성능 테스트 (목표: 95+)
- [ ] 링크 무결성 검사 (linkinator)
- [ ] 접근성 테스트 (WCAG AA)
- [ ] 검색 기능 구현 (Algolia 또는 Fuse.js)
- [ ] 프로덕션 배포 및 A/B 테스트

---

### Phase 8: 코드베이스 정리 및 코드 퀄리티
**우선순위**: 높음 | **예상 시간**: 6-8시간

**주요 작업:**
- [ ] **Jekyll 파일 완전 제거** (15MB+ 예상)
  - [ ] 설정: `_config.yml`, `Gemfile`, `Gemfile.lock`
  - [ ] 디렉토리: `_includes`, `_layouts`, `_posts`, `_drafts`, `_sass`, `_site`, `.jekyll-cache`
  - [ ] `.gitignore` 업데이트
- [ ] **사용하지 않는 코드 제거**
  - [ ] 미사용 import, 함수, 변수, CSS 클래스
  - [ ] 중복 코드 통합
- [ ] **코드 가독성 개선**
  - [ ] 네이밍 컨벤션 (한글 주석, 영어 변수)
  - [ ] 함수 분리 (단일 책임)
  - [ ] 매직 넘버/문자열 상수화
  - [ ] 주석 개선
- [ ] **확장성 고려 리팩토링**
  - [ ] 컴포넌트 props 타입 명확화
  - [ ] 유틸리티 함수 분리
  - [ ] 설정값 중앙화 (`constants.ts`)
  - [ ] 디렉토리 구조 개선
- [ ] **문서화**
  - [ ] `POST_GUIDE.md` (새 포스트 작성법)
  - [ ] `COMPONENT_GUIDE.md` (컴포넌트 가이드)
  - [ ] `ARCHITECTURE.md` (구조 설명)
  - [ ] JSDoc 주석 추가

---

### Phase 9: 성능 최적화 및 모니터링
**우선순위**: 낮음 | **예상 시간**: 4-6시간

**주요 작업:**
- [ ] **이미지 최적화**
  - [ ] WebP, AVIF 포맷
  - [ ] 반응형 이미지
  - [ ] 지연 로딩
- [ ] **폰트 최적화**
  - [ ] Pretendard Variable
  - [ ] FOUT 방지
- [ ] **성능 모니터링**
  - [ ] Lighthouse CI
  - [ ] Core Web Vitals
  - [ ] 빌드 벤치마크

---

## 우선순위 제안

### 1️⃣ 즉시 진행: Phase 8 (코드베이스 정리)
**이유**:
- Jekyll 파일 혼재로 혼란 가능성
- 15MB+ 불필요한 파일 제거
- 향후 작업의 깔끔한 기반

**작업 순서**:
1. **Jekyll 완전 제거** (1-2시간)
   - 설정 및 디렉토리 삭제
   - `.gitignore` 업데이트
   - 커밋: "chore: Remove Jekyll legacy files"

2. **코드 정리** (2-3시간)
   - 미사용 코드 제거
   - 네이밍 통일
   - 상수화 및 함수 분리

3. **문서화** (2-3시간)
   - `POST_GUIDE.md`, `COMPONENT_GUIDE.md`, `ARCHITECTURE.md`
   - JSDoc 주석

---

### 2️⃣ 중기 진행: Phase 6 (최적화 및 배포 준비)
**이유**:
- SEO 및 성능 최적화 필수
- Draft 포스트 수정으로 콘텐츠 완성도 향상

**우선순위**:
1. Draft 포스트 수정 (17개)
2. Lighthouse 성능 테스트
3. 링크 무결성 검사
4. 이미지 최적화
5. 검색 기능 구현

---

### 3️⃣ 장기 진행: Phase 9 (성능 모니터링)
**이유**:
- 배포 후 실제 사용자 데이터 기반 최적화
- 지속적 개선 가능

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
