/**
 * RSS Feed Generator
 *
 * Astro의 @astrojs/rss 패키지를 사용하여 RSS 피드 생성
 *
 * SEO 요구사항:
 * - 모든 블로그 포스트를 RSS 피드에 포함
 * - 제목, 설명, 발행일, 링크 포함
 * - 초안(draft) 포스트는 제외
 */

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // 블로그 포스트 가져오기 (초안 제외)
  const posts = await getCollection('blog', ({ data }) => {
    return data.draft !== true;
  });

  // 최신 순으로 정렬
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  return rss({
    title: '인생은 B와 D사이 Code다',
    description: 'Tolerblanc의 기술 블로그 - 프로그래밍, 알고리즘, 웹 개발',
    site: context.site || 'https://tolerblanc.github.io',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description || post.data.excerpt,
      link: `/${post.id}`,
      categories: post.data.categories,
    })),
    customData: `<language>ko</language>`,
    stylesheet: '/rss/styles.xsl',
  });
}
