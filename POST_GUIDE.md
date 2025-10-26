# 새 포스트 작성 가이드

> Tolerblanc 블로그에 새로운 기술 포스트를 작성하는 방법을 안내합니다.

---

## 📋 목차

1. [빠른 시작](#빠른-시작)
2. [포스트 구조](#포스트-구조)
3. [Frontmatter 작성법](#frontmatter-작성법)
4. [MDX 작성 팁](#mdx-작성-팁)
5. [컴포넌트 사용법](#컴포넌트-사용법)
6. [카테고리 가이드](#카테고리-가이드)
7. [이미지 추가](#이미지-추가)
8. [코드 블록 작성](#코드-블록-작성)
9. [수학 수식 (LaTeX)](#수학-수식-latex)
10. [체크리스트](#체크리스트)

---

## 빠른 시작

### 1. 새 파일 생성

```bash
# 카테고리 디렉토리로 이동
cd src/content/blog/[카테고리명]/

# 새 MDX 파일 생성 (날짜 없이 slug만 사용)
touch my-new-post.mdx
```

**예시**:
- JavaScript 포스트: `src/content/blog/javascript/typescript-basics.mdx`
- Algorithm 포스트: `src/content/blog/algorithm/dijkstra-algorithm.mdx`
- Retrospective: `src/content/blog/retrospective/2025-2q-retrospective.mdx`

### 2. 기본 템플릿 복사

```mdx
---
title: "포스트 제목"
excerpt: "포스트 요약 (160자 이내)"
date: 2025-10-26
categories: [javascript]
tags: [TypeScript, JavaScript]
toc: true
draft: false
lang: ko
author: Tolerblanc
---

## 서론

포스트 내용을 작성합니다...
```

### 3. 로컬 미리보기

```bash
pnpm dev
# http://localhost:4321/experimental/ 접속
```

---

## 포스트 구조

### 권장 구조

```mdx
---
# Frontmatter (메타데이터)
---

<Notice type="info">
이 포스트의 핵심 요약이나 독자에게 전달할 메시지
</Notice>

## 서론
배경 및 동기 설명

## 본론
### 소제목 1
내용

### 소제목 2
내용

## 결론
요약 및 마무리

## 참고 자료
- [링크1](URL)
- [링크2](URL)
```

---

## Frontmatter 작성법

### 필수 필드

```yaml
title: "포스트 제목"          # 필수
excerpt: "포스트 요약"        # 필수 (SEO, 카드 미리보기)
date: 2025-10-26             # 필수 (YYYY-MM-DD 형식)
categories: [javascript]      # 필수 (배열, 소문자)
tags: [TypeScript, Web]       # 필수 (배열)
draft: false                  # 필수 (true면 빌드 제외)
lang: ko                      # 필수 (ko 또는 en)
author: Tolerblanc            # 필수
```

### 선택 필드

```yaml
toc: true                     # 목차 표시 여부 (기본값: true)
updatedDate: 2025-11-01      # 최종 수정일
description: "SEO 설명"       # excerpt와 다른 경우
series:                       # 시리즈 포스트
  name: "NestJS 시리즈"
  order: 1
```

### 예제: 완전한 Frontmatter

```yaml
---
title: "TypeScript 타입 시스템 완벽 가이드"
excerpt: "TypeScript의 강력한 타입 시스템을 마스터하기 위한 완벽한 가이드입니다."
date: 2025-10-26
updatedDate: 2025-10-27
categories: [javascript]
tags: [TypeScript, JavaScript, 타입시스템, Generic]
toc: true
draft: false
lang: ko
author: Tolerblanc
description: "TypeScript 타입 시스템의 모든 것: 기본 타입부터 고급 Generic까지"
series:
  name: "TypeScript 마스터 시리즈"
  order: 2
---
```

---

## MDX 작성 팁

### 1. 마크다운 기본 문법

```markdown
# H1 제목 (포스트당 1개만 - Frontmatter title이 자동 생성)
## H2 제목 (주요 섹션)
### H3 제목 (소제목)

**굵게**, *기울임*, `인라인 코드`

[링크 텍스트](https://example.com)

![이미지 alt](https://example.com/image.png)

- 순서 없는 리스트
- 항목 2

1. 순서 있는 리스트
2. 항목 2

> 인용구
```

### 2. MDX 특별 기능

MDX는 JSX 컴포넌트를 마크다운에 사용할 수 있습니다:

```mdx
<Notice type="info">
정보성 알림
</Notice>

<details>
<summary>펼쳐보기</summary>
숨겨진 내용
</details>
```

### 3. 주의사항

- `{`, `}`, `<`, `>` 문자 사용 시 주의 (JSX와 충돌 가능)
- HTML 태그는 반드시 닫기: `<img />`, `<br />`
- 코드 블록 외부에서 특수 문자는 HTML 엔티티 사용:
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `<=` → `&lt;=`
  - `>=` → `&gt;=`

---

## 컴포넌트 사용법

### Notice 컴포넌트

4가지 타입의 알림 상자를 사용할 수 있습니다:

#### 1. Info (정보)

```mdx
<Notice type="info">
개인 공부 기록용 블로그입니다.
</Notice>
```

#### 2. Warning (경고)

```mdx
<Notice type="warning">
이 방법은 보안 취약점이 있을 수 있습니다.
</Notice>
```

#### 3. Danger (위험)

```mdx
<Notice type="danger">
프로덕션 환경에서는 절대 사용하지 마세요!
</Notice>
```

#### 4. Success (성공)

```mdx
<Notice type="success">
모든 테스트가 통과했습니다!
</Notice>
```

---

## 카테고리 가이드

### 사용 가능한 카테고리

현재 블로그에서 사용 중인 카테고리:

| 카테고리 ID | 표시 이름 | 설명 |
|-------------|-----------|------|
| `javascript` | JavaScript | JS, TS, Node.js, NestJS 등 |
| `python` | Python | Python 언어 및 생태계 |
| `cpp` | C++ | C++ 언어 및 STL |
| `algorithm` | Algorithm | 알고리즘 이론 |
| `boj` | BOJ | 백준 온라인 저지 문제 풀이 |
| `leetcode` | LeetCode | LeetCode 문제 풀이 |
| `programmers` | Programmers | 프로그래머스 문제 풀이 |
| `web_fundamentals` | Web Fundamentals | 웹 기초 (HTTP, Cookie 등) |
| `os` | OS | 운영체제 |
| `docker` | Docker | Docker 및 컨테이너 |
| `dl` | Deep Learning | 딥러닝 |
| `retrospective` | Retrospective | 회고록 |
| `review` | Review | 서비스/강의 리뷰 |
| `9oormthon_challenge` | 9oormthon | 9oormthon 챌린지 |

### 새 카테고리 추가

새로운 카테고리가 필요한 경우:

1. **디렉토리 생성**:
   ```bash
   mkdir -p src/content/blog/[새_카테고리]
   ```

2. **상수 파일 업데이트** (`src/constants.ts`):
   ```typescript
   export const CATEGORY_LABELS: Record<string, string> = {
     // ... 기존 카테고리
     'new_category': 'New Category',  // 추가
   };
   ```

3. **그룹에 추가** (선택):
   ```typescript
   export const CATEGORY_GROUPS: Record<string, string[]> = {
     'programming': ['cpp', 'python', 'javascript', 'new_category'],  // 추가
   };
   ```

---

## 이미지 추가

### 1. 외부 이미지 (권장)

```markdown
![설명](https://github.com/user/repo/assets/image.png)
```

### 2. public 디렉토리 이미지

```bash
# 이미지 저장
public/images/posts/[포스트명]/image.png
```

```markdown
![설명](/experimental/images/posts/[포스트명]/image.png)
```

### 3. 이미지 최적화 (Phase 6 예정)

현재는 원본 이미지를 그대로 사용합니다. Phase 6에서 WebP 변환 및 반응형 이미지 지원 예정.

---

## 코드 블록 작성

### 기본 코드 블록

````markdown
```javascript
function hello() {
  console.log('Hello, World!');
}
```
````

### 지원 언어

Shiki를 사용하여 200개 이상의 언어를 지원합니다:

- `javascript`, `typescript`, `python`, `cpp`, `java`
- `bash`, `shell`, `yaml`, `json`, `xml`
- `sql`, `graphql`, `dockerfile`, `markdown`
- 전체 목록: [Shiki Languages](https://shiki.style/languages)

### 코드 복사 버튼

모든 코드 블록에 자동으로 복사 버튼이 추가됩니다 (CodeCopyButton 컴포넌트).

---

## 수학 수식 (LaTeX)

KaTeX를 사용하여 LaTeX 수식을 렌더링합니다.

### 인라인 수식

```markdown
파이썬의 시간복잡도는 $O(n \log n)$입니다.
```

### 블록 수식

```markdown
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

### 주의사항

- 수식 내부에서 `{`, `}`, `\` 사용 시 이스케이프 불필요
- 수식과 일반 텍스트 사이에 공백 필요
- 복잡한 수식은 `$$..$$` 블록 수식 사용 권장

### 예제

```markdown
## 동적 계획법

점화식은 다음과 같습니다:

$$
dp[i] = \begin{cases}
  0 & \text{if } i = 0 \\
  dp[i-1] + arr[i] & \text{if } i > 0
\end{cases}
$$

시간복잡도는 $O(n)$입니다.
```

---

## 체크리스트

### 작성 전 체크

- [ ] 카테고리 디렉토리 확인
- [ ] 파일명은 slug만 (날짜 제외): `my-post.mdx`
- [ ] Frontmatter 템플릿 복사

### 작성 중 체크

- [ ] 제목 (H1) 사용 안 함 (Frontmatter title 사용)
- [ ] 모든 HTML 태그 닫기 (`<img />`, `<br />`)
- [ ] 코드 블록 언어 지정
- [ ] 이미지 alt 텍스트 작성

### 작성 후 체크

- [ ] `pnpm dev`로 로컬 미리보기
- [ ] 목차(TOC) 정상 작동 확인
- [ ] 코드 하이라이팅 확인
- [ ] LaTeX 수식 렌더링 확인 (있는 경우)
- [ ] 반응형 레이아웃 확인 (모바일/데스크톱)
- [ ] `draft: false` 확인 (배포 시)

### 빌드 전 체크

- [ ] `pnpm build` 에러 없음
- [ ] `pnpm astro check` 타입 에러 없음
- [ ] Git commit 메시지 작성

---

## 예제: 완성된 포스트

```mdx
---
title: "Docker 컨테이너 내부 동작 원리"
excerpt: "Docker 컨테이너가 어떻게 격리된 환경을 제공하는지 namespace와 cgroups를 중심으로 알아봅니다."
date: 2025-10-26
categories: [docker]
tags: [Docker, Container, Linux, Namespace, Cgroups]
toc: true
draft: false
lang: ko
author: Tolerblanc
---

<Notice type="info">
이 포스트는 Linux 기반 시스템에서 Docker가 동작하는 원리를 다룹니다.
</Notice>

## 서론

Docker는 어플리케이션을 격리된 환경에서 실행할 수 있게 해줍니다.
이번 포스트에서는 Docker 컨테이너의 핵심 기술인 **namespace**와 **cgroups**를 살펴봅니다.

## Namespace

Linux namespace는 프로세스를 격리합니다.

### PID Namespace

```bash
# 컨테이너 내부
ps aux
# PID 1부터 시작
```

<Notice type="warning">
PID namespace는 중첩이 가능하므로 주의가 필요합니다.
</Notice>

## Cgroups

Cgroups는 리소스를 제한합니다.

```bash
docker run --memory="512m" --cpus="1.5" nginx
```

## 결론

Docker는 Linux 커널의 기능을 활용하여 가벼운 가상화를 제공합니다.

## 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Linux Namespaces](https://man7.org/linux/man-pages/man7/namespaces.7.html)
```

---

## 문제 해결

### 빌드 에러

**증상**: `Unclosed tag` 에러

```
Error: Unclosed tag <img>
```

**해결**: HTML 태그 닫기

```mdx
<!-- 잘못된 예 -->
<img src="...">

<!-- 올바른 예 -->
<img src="..." />
```

---

**증상**: MDX 파싱 에러

```
Error: Could not parse expression
```

**해결**: 특수 문자 이스케이프

```mdx
<!-- 잘못된 예 -->
조건: x < 10

<!-- 올바른 예 -->
조건: x &lt; 10

<!-- 또는 코드 블록 사용 -->
조건: `x < 10`
```

---

### LaTeX 렌더링 안 됨

**증상**: 수식이 텍스트로 표시됨

**해결**: 수식 구분자 확인

```markdown
<!-- 잘못된 예 -->
$ x^2 $ (공백 없이)

<!-- 올바른 예 -->
$x^2$ (공백 제거)
또는
$$x^2$$ (블록 수식)
```

---

## 추가 리소스

- [Astro MDX 가이드](https://docs.astro.build/en/guides/markdown-content/)
- [KaTeX 지원 함수](https://katex.org/docs/supported.html)
- [Shiki 테마](https://shiki.style/themes)

---

**작성일**: 2025-10-26
**최종 수정**: 2025-10-26
