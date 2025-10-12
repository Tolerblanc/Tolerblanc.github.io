# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고할 지침을 제공합니다.

## 저장소 개요

Tolerblanc의 한국어 기술 블로그 "인생은 B와 D사이 Code다"입니다. 현재 Jekyll과 minimal-mistakes 테마로 구축되어 GitHub Pages에 배포되고 있습니다. 75개 이상의 기술 포스트가 있으며 상당한 트래픽을 생성하므로 SEO 유지가 중요합니다.

## 현재 아키텍처 (Jekyll 기반)

### 사이트 설정
- **테마**: minimal-mistakes-jekyll (원격 테마 v4.24.0)
- **도메인**: https://tolerblanc.github.io
- **분석**: Google Analytics (G-JWJT3DQR8G) - **반드시 유지**
- **댓글**: Giscus 통합 - **반드시 유지**
- **검색**: Lunr 검색 (변경 가능)

### 콘텐츠 구조
- **포스트**: `_posts/` 디렉토리에 중첩된 카테고리 구조로 75개 이상의 기술 문서
- **카테고리**: Personal, PL (프로그래밍 언어), Web, DevOps, CS, Algorithm 등
- **언어**: 주로 한국어 콘텐츠에 영어 기술 용어
- **형식**: YAML frontmatter가 있는 Markdown, 커스텀 notice 블록

### 주요 의존성
- **Ruby**: GitHub Pages gem, Jekyll 플러그인 (sitemap, feed, gist, include-cache)
- **JavaScript**: 최소한 (jQuery, 테마 에셋)
- **스타일링**: minimal-mistakes 테마의 Sass/SCSS

### SEO 중요 요소 (반드시 보존)
- 커스텀 퍼머링크: `/:categories/:title/`
- 사이트맵 및 RSS 피드 생성
- Google Analytics 통합
- 메타 태그 및 Open Graph 지원
- 카테고리와 태그를 위한 구조화된 데이터

## 마이그레이션 계획: Jekyll → Astro + MDX

### 목표
1. **Ruby 의존성 제거** - JS/TS 생태계로 전환
2. **Astro 프레임워크 사용** - MDX로 커스텀 컴포넌트 구현
3. **SEO 보존** - URL, 메타데이터, 분석 도구 유지
4. **로컬 개발 개선** - 더 빠른 빌드, 더 나은 도구
5. **실험적 배포** - 별도 브랜치에서 작업 후 `{블로그주소}/experimental`에 배포

### 마이그레이션 전략

#### 1단계: 기초 설정
```bash
# 실험 브랜치 생성
git checkout -b astro-experimental

# Astro 프로젝트 초기화 (루트에서)
pnpm create astro@latest . -- --template minimal --typescript
pnpm add @astrojs/mdx @astrojs/sitemap @astrojs/rss @astrojs/react
pnpm add -D @types/react @types/react-dom
```

#### 2단계: 콘텐츠 마이그레이션
- Jekyll 포스트를 MDX 형식으로 변환
- 카테고리 구조를 Astro의 파일 기반 라우팅에 매핑
- frontmatter 메타데이터 보존 (date, categories, tags, excerpt)
- 커스텀 notice 블록을 MDX 컴포넌트로 마이그레이션

#### 3단계: 핵심 기능 보존
- **Google Analytics**: 동일한 tracking ID (G-JWJT3DQR8G) 사용
- **Giscus 댓글**: 기존 설정 그대로 이전
- **URL 구조**: 동일한 퍼머링크 패턴 (`/:categories/:title/`) 유지
- **사이트맵/RSS**: 기존과 동일한 구조로 생성

#### 4단계: 디자인 시스템 및 개선사항
- 재사용 가능한 MDX 컴포넌트 생성
- 다크 테마 구현 (현재: "dark" 스킨)
- 검색 기능 개선 (Algolia, Fuse.js 등으로 대체 가능)

### 개발 명령어

#### 현재 Jekyll 명령어
```bash
# 로컬 개발
bundle exec jekyll serve

# 프로덕션 빌드
bundle exec jekyll build

# 의존성 설치
bundle install
```

#### 미래 Astro 명령어 (pnpm 사용)
```bash
# 로컬 개발
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview

# 의존성 설치
pnpm install

# 타입 체크
pnpm type-check
```

### 파일 구조 매핑

**현재 Jekyll 구조:**
```
_posts/[Category]/[Subcategory]/YYYY-MM-DD-title.md
_config.yml (사이트 설정)
_includes/ (재사용 가능한 컴포넌트)
_layouts/ (페이지 템플릿)
_sass/ (스타일링)
```

**목표 Astro 구조:**
```
src/
├── content/
│   └── blog/[category]/[subcategory]/title.mdx
├── components/ (재사용 가능한 MDX 컴포넌트)
├── layouts/ (페이지 템플릿)
├── pages/ (라우팅)
└── styles/ (글로벌 스타일)
astro.config.mjs
package.json
```

### 중요한 SEO 고려사항

1. **URL 보존**: 404 방지를 위한 정확한 퍼머링크 구조 유지
2. **메타데이터 마이그레이션**: 모든 frontmatter 필드 보존
3. **Analytics 연속성**: Google Analytics 추적 ID 동일하게 유지
4. **댓글 연속성**: Giscus 설정 그대로 이전
5. **사이트맵/RSS**: 기존과 동일한 구조 생성
6. **성능**: 빌드 시간과 페이지 로드 속도 최적화

### 생성할 핵심 컴포넌트

#### Notice 컴포넌트
```jsx
// 현재 Jekyll liquid 구문
<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다.
</div>

// 목표 MDX 컴포넌트
<Notice type="info">
👨‍💻 개인 공부 기록용 블로그 입니다.
</Notice>
```

#### 기타 컴포넌트
- 코드 신택스 하이라이팅 (현재 rouge → Prism/Shiki)
- 목차 (TOC) 컴포넌트
- 관련 포스트 컴포넌트
- 카테고리/태그 네비게이션

### 배포 전략

1. **실험 브랜치**: `astro-experimental` 브랜치에서 작업
2. **GitHub Actions**: `experimental` 서브도메인 자동 배포 설정
3. **A/B 테스트**: 메인 사이트와 성능/SEO 메트릭 비교
4. **점진적 전환**: 검증 완료 후 메인 브랜치로 병합

### GitHub Pages 설정

#### 실험 배포용 GitHub Actions
```yaml
# .github/workflows/deploy-experimental.yml
name: Deploy Experimental
on:
  push:
    branches: [astro-experimental]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: latest
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          destination_dir: experimental
```

### 보존할 핵심 설정

#### Google Analytics
```js
// astro.config.mjs에서
export default defineConfig({
  integrations: [
    // Google Analytics 설정
    googleAnalytics({
      id: 'G-JWJT3DQR8G'
    })
  ]
});
```

#### Giscus 댓글
```jsx
// 기존 설정 그대로 유지
const giscusConfig = {
  repo: "Tolerblanc/Tolerblanc.github.io",
  repoId: "R_kgDOJ01EaQ",
  category: "Announcements",
  categoryId: "DIC_kwDOJ01Eac4Cerab",
  theme: "dark_dimmed"
};
```

### 성능 목표

- **빌드 시간**: <30초 (현재 Jekyll 빌드 대비)
- **개발 서버**: <3초 핫 리로드
- **번들 크기**: <500KB 초기 로드
- **Lighthouse 점수**: 성능, SEO, 접근성 95점 이상
- **패키지 관리**: pnpm 사용으로 더 빠른 의존성 관리