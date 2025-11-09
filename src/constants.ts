/**
 * 사이트 전역 상수 정의
 *
 * 이 파일은 프로젝트 전반에서 사용되는 상수값들을 중앙 집중화합니다.
 * 매직 넘버와 하드코딩된 문자열을 제거하여 유지보수성을 향상시킵니다.
 */

// ===== 사이트 설정 =====
export const SITE_CONFIG = {
  TITLE: '인생은 B와 D사이 Code다',
  DESCRIPTION: 'Tolerblanc의 기술 블로그',
  URL: 'https://tolerblanc.github.io',
  BASE_PATH: '',
  AUTHOR: 'Tolerblanc',
  LANG: 'ko' as const,
} as const;

// ===== Google Analytics =====
export const ANALYTICS = {
  GA_ID: 'G-JWJT3DQR8G',
} as const;

// ===== Giscus 댓글 시스템 =====
export const GISCUS_CONFIG = {
  REPO: 'Tolerblanc/Tolerblanc.github.io',
  REPO_ID: 'R_kgDOJ01EaQ',
  CATEGORY: 'Announcements',
  CATEGORY_ID: 'DIC_kwDOJ01Eac4Cerab',
  THEME_LIGHT: 'light',
  THEME_DARK: 'dark_dimmed',
  MAPPING: 'pathname' as const,
  REACTIONS_ENABLED: true,
  EMIT_METADATA: false,
  INPUT_POSITION: 'bottom' as const,
  LANG: 'ko' as const,
} as const;

// ===== 페이지 설정 =====
export const PAGE_CONFIG = {
  POSTS_PER_PAGE: 10,
  RECENT_POSTS_COUNT: 5,
  TOC_DEPTH: 3,
  EXCERPT_LENGTH: 160,
} as const;

// ===== 카테고리 레이블 =====
export const CATEGORY_LABELS: Record<string, string> = {
  '9oormthon_challenge': '9oormthon',
  'algorithm': 'Algorithm',
  'boj': 'BOJ',
  'cpp': 'C++',
  'dl': 'Deep Learning',
  'docker': 'Docker',
  'graphics': 'Graphics',
  'javascript': 'JavaScript',
  'leetcode': 'LeetCode',
  'os': 'OS',
  'programmers': 'Programmers',
  'python': 'Python',
  'retrospective': 'Retrospective',
  'review': 'Review',
  'unix': 'Unix',
  'web_fundamentals': 'Web Fundamentals',
  '혼공학습단': '혼공학습단',
} as const;

// ===== 카테고리 그룹 =====
export const CATEGORY_GROUPS: Record<string, string[]> = {
  'programming': ['cpp', 'python', 'javascript'],
  'algorithm': ['algorithm', 'boj', 'leetcode', 'programmers'],
  'web': ['web_fundamentals', 'graphics'],
  'learning': ['9oormthon_challenge', '혼공학습단', 'retrospective', 'review'],
  'ai': ['dl'],
  'system': ['os', 'unix', 'docker'],
} as const;

export const GROUP_LABELS: Record<string, string> = {
  'programming': 'Programming',
  'algorithm': 'Algorithm',
  'web': 'Web',
  'learning': 'Learning',
  'ai': 'AI & ML',
  'system': 'System',
} as const;

// ===== 네비게이션 메뉴 =====
export const NAV_MENU = [
  { label: 'Home', href: `${SITE_CONFIG.BASE_PATH}/` },
  { label: 'Blog', href: `${SITE_CONFIG.BASE_PATH}/` },
  { label: 'Tags', href: `${SITE_CONFIG.BASE_PATH}/tags` },
  { label: 'About', href: `${SITE_CONFIG.BASE_PATH}/about` },
] as const;

// ===== 테마 설정 =====
export const THEME = {
  DEFAULT: 'dark' as const,
  STORAGE_KEY: 'theme',
} as const;

// ===== 날짜 포맷 =====
export const DATE_FORMAT = {
  FULL: 'YYYY년 MM월 DD일',
  SHORT: 'YYYY.MM.DD',
  ISO: 'YYYY-MM-DD',
} as const;
