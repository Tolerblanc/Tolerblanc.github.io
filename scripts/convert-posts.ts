#!/usr/bin/env tsx
/**
 * Jekyll 포스트 변환 CLI 도구
 *
 * 사용법:
 * pnpm convert:posts             # 전체 변환
 * pnpm convert:posts --sample 3  # 샘플 3개만 변환
 * pnpm convert:posts --dry-run   # 미리보기
 */

import { convertAllJekyllPosts, convertJekyllToMDX } from '../src/utils/jekyll-to-mdx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// CLI 인자 파싱
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const sampleIndex = args.indexOf('--sample');
const sampleCount = sampleIndex !== -1 ? parseInt(args[sampleIndex + 1], 10) : null;

async function main() {
  const inputDir = path.join(PROJECT_ROOT, '_posts');
  const outputDir = path.join(PROJECT_ROOT, 'src/content/blog');

  console.log('🚀 Jekyll to MDX Conversion Started');
  console.log(`📂 Input: ${inputDir}`);
  console.log(`📂 Output: ${outputDir}`);
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN' : 'PRODUCTION'}\n`);

  try {
    const results = await convertAllJekyllPosts(inputDir, outputDir, {
      dryRun,
      filter: sampleCount
        ? (() => {
            let count = 0;
            return () => {
              if (count >= sampleCount) return false;
              count++;
              return true;
            };
          })()
        : undefined,
    });

    console.log(`\n✨ Conversion completed!`);
    console.log(`📊 Total converted: ${results.length} posts`);

    if (results.length > 0) {
      console.log('\n📝 Sample results:');
      results.slice(0, 3).forEach((result, i) => {
        console.log(`\n${i + 1}. ${result.frontmatter.title}`);
        console.log(`   Slug: ${result.slug}`);
        console.log(`   Categories: ${result.frontmatter.categories.join(', ')}`);
        console.log(`   Date: ${result.frontmatter.date}`);
        if (result.frontmatter.series) {
          console.log(
            `   Series: ${result.frontmatter.series.name} (${result.frontmatter.series.order})`
          );
        }
      });
    }
  } catch (error) {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  }
}

main();
