import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog Collection Schema
 *
 * Jekyll에서 마이그레이션된 블로그 포스트를 위한 타입 안전 스키마
 *
 * 주요 개선사항:
 * 1. SEO 최적화: description, ogImage, keywords 추가
 * 2. 콘텐츠 품질: readingTime, featured 플래그 추가
 * 3. 다국어 지원: lang 필드 추가 (기본값: 'ko')
 * 4. 성능: draft 상태로 빌드 제외 가능
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    // 필수 필드 (Jekyll과 호환)
    title: z.string()
      .min(1, 'Title is required')
      .max(100, 'Title should be under 100 characters'),

    excerpt: z.string()
      .min(10, 'Excerpt should be at least 10 characters')
      .max(200, 'Excerpt should be under 200 characters'),

    date: z.coerce.date(),

    categories: z.array(z.string())
      .min(1, 'At least one category is required'),

    tags: z.array(z.string())
      .default([]),

    // 선택적 필드
    updatedDate: z.coerce.date().optional(),

    // SEO 최적화 필드
    description: z.string()
      .max(160, 'Meta description should be under 160 characters')
      .optional()
      .transform((val) => val || undefined), // 빈 문자열 처리

    ogImage: z.string()
      .url('OG image must be a valid URL')
      .optional(),

    keywords: z.array(z.string())
      .optional()
      .transform((val) => {
        // tags가 없으면 keywords 사용, 둘 다 없으면 빈 배열
        return val && val.length > 0 ? val : undefined;
      }),

    // 콘텐츠 품질 필드
    draft: z.boolean()
      .default(false),

    featured: z.boolean()
      .default(false)
      .describe('Featured posts shown on homepage'),

    readingTime: z.number()
      .positive()
      .optional()
      .describe('Estimated reading time in minutes'),

    // TOC 설정 (Jekyll 호환)
    toc: z.boolean()
      .default(true)
      .describe('Show table of contents'),

    tocDepth: z.number()
      .min(1)
      .max(6)
      .default(3)
      .describe('TOC heading depth (1-6)'),

    // 다국어 지원
    lang: z.enum(['ko', 'en'])
      .default('ko')
      .describe('Content language'),

    // 관련 포스트 (Jekyll related 필드 대체)
    relatedPosts: z.array(z.string())
      .optional()
      .describe('Slugs of related posts'),

    // 작성자 정보 (다중 작성자 지원 가능)
    author: z.string()
      .default('Tolerblanc')
      .describe('Post author'),

    // 시리즈 정보 (예: NestJS 해체분석기 시리즈)
    series: z.object({
      name: z.string(),
      order: z.number().positive(),
    }).optional(),
  }),
});

export const collections = { blog };
