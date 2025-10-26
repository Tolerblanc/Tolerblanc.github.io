/**
 * 네비게이션 유틸리티
 *
 * 사이드바 및 카테고리 네비게이션을 위한 데이터를 제공합니다.
 * 카테고리 그룹화, 포스트 개수 계산, 최근 포스트 조회 등을 지원합니다.
 */

import { getCollection } from 'astro:content';
import {
  CATEGORY_LABELS,
  CATEGORY_GROUPS,
  GROUP_LABELS,
  SITE_CONFIG,
  PAGE_CONFIG,
} from '../constants';

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

export interface RecentPost {
  title: string;
  slug: string;
  date: Date;
  category: string;
}

/**
 * 모든 카테고리 정보를 포스트 개수와 함께 반환
 *
 * @returns 포스트 개수순으로 정렬된 카테고리 배열
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
      const name = CATEGORY_LABELS[id] || id;
      return {
        id,
        name,
        path: `${SITE_CONFIG.BASE_PATH}/blog/category/${id}`,
        postCount: count,
      };
    })
    .sort((a, b) => b.postCount - a.postCount); // 포스트 많은 순으로 정렬

  return categories;
}

/**
 * 그룹화된 카테고리 정보를 반환 (2-depth 구조)
 *
 * @returns 포스트 개수순으로 정렬된 카테고리 그룹 배열
 */
export async function getNavigationCategoryGroups(): Promise<NavCategoryGroup[]> {
  const allCategories = await getNavigationCategories();
  const categoryMap = new Map(allCategories.map(cat => [cat.id, cat]));

  const groups: NavCategoryGroup[] = [];

  for (const [groupId, categoryIds] of Object.entries(CATEGORY_GROUPS)) {
    const children = categoryIds
      .map(id => categoryMap.get(id))
      .filter((cat): cat is NavCategory => cat !== undefined);

    if (children.length > 0) {
      const totalPosts = children.reduce((sum, cat) => sum + cat.postCount, 0);
      groups.push({
        id: groupId,
        name: GROUP_LABELS[groupId] || groupId,
        children,
        totalPosts,
      });
    }
  }

  // 포스트가 많은 그룹 순으로 정렬
  return groups.sort((a, b) => b.totalPosts - a.totalPosts);
}

/**
 * 최근 포스트를 날짜순으로 반환
 *
 * @param count 반환할 포스트 개수 (기본값: PAGE_CONFIG.RECENT_POSTS_COUNT)
 * @returns 최근 포스트 배열
 */
export async function getRecentPosts(
  count: number = PAGE_CONFIG.RECENT_POSTS_COUNT
): Promise<RecentPost[]> {
  const allPosts = await getCollection('blog', ({ data }) => {
    return data.draft !== true;
  });

  return allPosts
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, count)
    .map(post => ({
      title: post.data.title,
      slug: post.id,
      date: post.data.date,
      category: post.id.split('/')[0],
    }));
}
