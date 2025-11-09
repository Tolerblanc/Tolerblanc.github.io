# 🚀 이중 배포 가이드 (Dual Deployment Guide)

> **목표**: Jekyll (main) + Astro (experimental)를 동시에 GitHub Pages에 배포

---

## 📋 배포 전략

### 배포 구조
```
GitHub Pages (tolerblanc.github.io)
├── /                    # Jekyll 사이트 (main 브랜치)
│   └── 기존 블로그 유지
└── /experimental/       # Astro 사이트 (astro-experimental 브랜치)
    └── 새로운 Astro 블로그
```

### 브랜치 구조
```
main                     # Jekyll 소스 → 루트(/) 배포
astro-experimental       # Astro 소스 → /experimental 배포
gh-pages                 # 통합 배포 브랜치 (자동 생성)
```

---

## 🔧 설정 방법

### 1. GitHub Pages 설정

```bash
# gh-pages 브랜치에서 배포하도록 설정
gh api -X PUT repos/Tolerblanc/Tolerblanc.github.io/pages \
  -f "build_type=legacy" \
  -f "source[branch]=gh-pages" \
  -f "source[path]=/"
```

**또는 GitHub 웹 인터페이스**:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: gh-pages / (root)

---

### 2. GitHub Actions 워크플로우

#### main 브랜치: Jekyll 배포 (루트)

**파일**: `.github/workflows/deploy-jekyll.yml` (main 브랜치)

```yaml
name: Deploy Jekyll to Root

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout main
        uses: actions/checkout@v4
        with:
          ref: main

      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true

      - name: Build Jekyll
        run: |
          bundle install
          bundle exec jekyll build

      - name: Deploy to gh-pages root
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
          publish_branch: gh-pages
          destination_dir: .
          keep_files: true  # /experimental 폴더 유지
```

---

#### astro-experimental 브랜치: Astro 배포 (/experimental)

**파일**: `.github/workflows/deploy.yml` (astro-experimental 브랜치)

```yaml
name: Deploy Astro to /experimental

on:
  push:
    branches: [astro-experimental]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout astro-experimental
        uses: actions/checkout@v4
        with:
          ref: astro-experimental

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build Astro
        run: pnpm run build

      - name: Deploy to gh-pages /experimental
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
          destination_dir: experimental
          keep_files: true  # 루트 파일 유지
```

---

## 🎯 핵심 설정 포인트

### 1. `keep_files: true`
- **필수**: 다른 브랜치의 배포 결과를 유지
- main 배포: 루트 파일 유지하면서 /experimental만 덮어쓰지 않음
- astro-experimental 배포: /experimental만 업데이트, 루트는 유지

### 2. `destination_dir`
- main: `.` (루트)
- astro-experimental: `experimental`

### 3. Astro Config (`astro.config.mjs`)
```javascript
export default defineConfig({
  site: 'https://tolerblanc.github.io',
  base: '/experimental',  // 중요!
  // ...
});
```

---

## 📝 배포 프로세스

### main 브랜치 푸시 시
```
main 브랜치 푸시
  ↓
Jekyll 빌드 (_site 생성)
  ↓
gh-pages 루트(/)에 배포
  ↓
/experimental 폴더는 유지됨 (keep_files: true)
  ↓
https://tolerblanc.github.io/ 업데이트
```

### astro-experimental 브랜치 푸시 시
```
astro-experimental 브랜치 푸시
  ↓
Astro 빌드 (dist 생성)
  ↓
gh-pages의 experimental 폴더에 배포
  ↓
루트(/) 파일은 유지됨 (keep_files: true)
  ↓
https://tolerblanc.github.io/experimental/ 업데이트
```

---

## ✅ 검증 체크리스트

### 초기 설정
- [ ] gh-pages 브랜치가 자동 생성되었는지 확인
- [ ] GitHub Pages 설정이 gh-pages 브랜치로 되어있는지 확인
- [ ] astro.config.mjs에 `base: '/experimental'` 설정 확인

### main 브랜치 배포 후
- [ ] https://tolerblanc.github.io/ 접속 가능
- [ ] Jekyll 사이트 정상 작동
- [ ] gh-pages 브랜치 루트에 Jekyll 파일들 존재

### astro-experimental 브랜치 배포 후
- [ ] https://tolerblanc.github.io/experimental/ 접속 가능
- [ ] Astro 사이트 정상 작동
- [ ] gh-pages 브랜치의 experimental 폴더에 Astro 파일들 존재
- [ ] 루트(/) Jekyll 파일들이 유지되고 있는지 확인

### 동시 배포 확인
- [ ] main 배포 후 /experimental이 유지되는지
- [ ] astro-experimental 배포 후 루트(/)가 유지되는지
- [ ] 두 사이트 모두 정상 작동

---

## 🔍 문제 해결

### 문제 1: 한쪽 사이트만 배포됨
**원인**: `keep_files: false` 또는 설정 누락
**해결**: 두 워크플로우 모두 `keep_files: true` 확인

### 문제 2: /experimental 접속 시 404
**원인**: `base: '/experimental'` 설정 누락
**해결**: astro.config.mjs 확인 및 재배포

### 문제 3: CSS/JS 리소스 404
**원인**: base path 설정 문제
**해결**:
- Astro: `import.meta.env.BASE_URL` 사용
- 모든 링크가 `/experimental/` prefix 포함하는지 확인

### 문제 4: 배포 후 이전 파일이 사라짐
**원인**: `keep_files: true` 누락 또는 잘못된 destination_dir
**해결**:
- main: destination_dir: `.` (루트)
- astro-experimental: destination_dir: `experimental`
- 두 워크플로우 모두 `keep_files: true`

---

## 📊 gh-pages 브랜치 구조 (예상)

```
gh-pages/
├── index.html              # Jekyll 메인
├── _posts/                 # Jekyll 포스트
├── assets/                 # Jekyll 에셋
├── ...                     # 기타 Jekyll 파일
│
└── experimental/           # Astro 사이트
    ├── index.html
    ├── blog/
    ├── _astro/
    ├── pagefind/
    └── ...
```

---

## 🚀 실제 배포 순서

### 1단계: GitHub Pages 설정 변경
```bash
# gh-pages 브랜치를 소스로 설정
gh api -X PUT repos/Tolerblanc/Tolerblanc.github.io/pages \
  -f "build_type=legacy" \
  -f "source[branch]=gh-pages" \
  -f "source[path]=/"
```

### 2단계: main 브랜치 워크플로우 생성/수정
```bash
# main 브랜치로 전환
git checkout main

# .github/workflows/deploy-jekyll.yml 생성
# (위의 Jekyll 배포 워크플로우 내용)

# 커밋 및 푸시
git add .github/workflows/deploy-jekyll.yml
git commit -m "ci: Add Jekyll deployment to gh-pages root"
git push origin main
```

### 3단계: astro-experimental 브랜치 워크플로우 수정
```bash
# astro-experimental 브랜치로 전환
git checkout astro-experimental

# .github/workflows/deploy.yml 수정
# (위의 Astro 배포 워크플로우 내용으로 변경)

# 커밋 및 푸시
git add .github/workflows/deploy.yml
git commit -m "ci: Update Astro deployment to gh-pages /experimental"
git push origin astro-experimental
```

### 4단계: 배포 확인
```bash
# GitHub Actions 로그 확인
gh run list --limit 5

# gh-pages 브랜치 확인
git fetch origin
git checkout gh-pages
ls -la
ls -la experimental/
```

---

## 📝 유지보수 가이드

### main 브랜치 업데이트 시
1. main 브랜치에서 작업
2. 커밋 및 푸시
3. GitHub Actions 자동 실행
4. https://tolerblanc.github.io/ 확인

### astro-experimental 브랜치 업데이트 시
1. astro-experimental 브랜치에서 작업
2. 커밋 및 푸시
3. GitHub Actions 자동 실행
4. https://tolerblanc.github.io/experimental/ 확인

### 두 사이트 동시 업데이트 시
1. main 브랜치 업데이트 → 푸시
2. astro-experimental 브랜치 업데이트 → 푸시
3. 순서 상관없음 (keep_files: true로 보호됨)

---

## 🔐 보안 고려사항

### GITHUB_TOKEN 권한
- `contents: write` 필수 (gh-pages 브랜치에 푸시)
- 기본 GITHUB_TOKEN 사용 (별도 PAT 불필요)

### 브랜치 보호
- main: 프로덕션 사이트이므로 보호 권장
- astro-experimental: 실험용이므로 보호 선택
- gh-pages: 자동 생성되므로 직접 수정 금지

---

## 📈 향후 계획

### 실험 완료 후
1. astro-experimental 검증 완료
2. main 브랜치를 Astro로 전환
3. `base: '/'`로 변경
4. /experimental 경로 제거
5. astro-experimental 브랜치 삭제

### 롤백이 필요한 경우
1. gh-pages 브랜치에서 이전 커밋으로 복원
2. 또는 main/astro-experimental에서 이전 버전 재배포

---

## 📚 참고 자료

### GitHub Actions
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)

### Astro
- [Base URL 설정](https://docs.astro.build/en/reference/configuration-reference/#base)
- [GitHub Pages 배포 가이드](https://docs.astro.build/en/guides/deploy/github/)

### Jekyll
- [GitHub Pages Jekyll 가이드](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)

---

**작성일**: 2025-11-09
**작성자**: Claude + Tolerblanc
**버전**: 1.0
**상태**: 구현 진행 중
