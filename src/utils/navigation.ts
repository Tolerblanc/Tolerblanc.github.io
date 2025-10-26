import { getCollection } from 'astro:content';

export interface NavCategory {
  id: string;
  name: string;
  path: string;
  postCount: number;
  children?: NavCategory[];
}

export interface NavCategoryGroup {
  id: string;
  name: string;
  children: NavCategory[];
  totalPosts: number;
}

// 카테고리별 한글 이름 매핑 (이모지 제거)
const categoryLabels: Record<string, string> = {
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
};

// 카테고리 그룹 정의 (토스페이먼츠 스타일)
const categoryGroups: Record<string, string[]> = {
  'programming': ['cpp', 'python', 'javascript'],
  'algorithm': ['algorithm', 'boj', 'leetcode', 'programmers'],
  'web': ['web_fundamentals', 'graphics'],
  'learning': ['9oormthon_challenge', '혼공학습단', 'retrospective', 'review'],
  'ai': ['dl'],
  'system': ['os', 'unix', 'docker'],
};

const groupLabels: Record<string, string> = {
  'programming': 'Programming',
  'algorithm': 'Algorithm',
  'web': 'Web',
  'learning': 'Learning',
  'ai': 'AI & ML',
  'system': 'System',
};

/**
 * 모든 카테고리 정보를 포스트 개수와 함께 반환
 */
export async function getNavigationCategories(): Promise<NavCategory[]> {
  const allPosts = await getCollection('blog', ({ data }) => {
    return data.draft !== true;
  });

  // 카테고리별 포스트 개수 계산
  const categoryCounts = new Map<string, number>();

  allPosts.forEach(post => {
    // slug의 첫 번째 부분이 카테고리
    const category = post.id.split('/')[0];
    categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
  });

  // NavCategory 객체 생성
  const categories: NavCategory[] = Array.from(categoryCounts.entries())
    .map(([id, count]) => {
      const name = categoryLabels[id] || id;
      return {
        id,
        name,
        path: `/experimental/blog/category/${id}`,
        postCount: count,
      };
    })
    .sort((a, b) => b.postCount - a.postCount); // 포스트 많은 순으로 정렬

  return categories;
}

/**
 * 그룹화된 카테고리 정보를 반환 (2-depth 구조)
 */
export async function getNavigationCategoryGroups(): Promise<NavCategoryGroup[]> {
  const allCategories = await getNavigationCategories();
  const categoryMap = new Map(allCategories.map(cat => [cat.id, cat]));

  const groups: NavCategoryGroup[] = [];

  for (const [groupId, categoryIds] of Object.entries(categoryGroups)) {
    const children = categoryIds
      .map(id => categoryMap.get(id))
      .filter((cat): cat is NavCategory => cat !== undefined);

    if (children.length > 0) {
      const totalPosts = children.reduce((sum, cat) => sum + cat.postCount, 0);
      groups.push({
        id: groupId,
        name: groupLabels[groupId] || groupId,
        children,
        totalPosts,
      });
    }
  }

  // 포스트가 많은 그룹 순으로 정렬
  return groups.sort((a, b) => b.totalPosts - a.totalPosts);
}

/**
 * 최근 포스트 5개 반환
 */
export async function getRecentPosts() {
  const allPosts = await getCollection('blog', ({ data }) => {
    return data.draft !== true;
  });

  return allPosts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 5)
    .map(post => ({
      title: post.data.title,
      slug: post.id,
      date: post.data.date,
      category: post.id.split('/')[0],
    }));
}
