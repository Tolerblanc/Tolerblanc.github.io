/**
 * Jekyll to MDX Conversion Utility
 *
 * Jekyll 포스트(.md)를 Astro MDX 형식으로 변환하는 유틸리티
 *
 * 주요 기능:
 * 1. Frontmatter 변환 (Jekyll → Astro 스키마)
 * 2. Notice 블록 → MDX 컴포넌트 변환
 * 3. 이미지 경로 처리
 * 4. 파일명 기반 메타데이터 추출 (date, slug)
 */

import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface JekyllFrontmatter {
  title: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  date: string;
  last_modified_at?: string;
  toc?: boolean;
  toc_sticky?: boolean;
  related?: boolean;
  [key: string]: any;
}

interface AstroFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  updatedDate?: string;
  categories: string[];
  tags: string[];
  description?: string;
  toc: boolean;
  tocDepth: number;
  draft: boolean;
  lang: 'ko' | 'en';
  author: string;
  series?: {
    name: string;
    order: number;
  };
}

interface ConversionResult {
  frontmatter: AstroFrontmatter;
  content: string;
  slug: string;
  originalPath: string;
}

/**
 * Jekyll 파일명에서 날짜와 슬러그 추출
 * 예: 2025-01-19-nestjs-demeterializer-1.md
 * → { date: '2025-01-19', slug: 'nestjs-demeterializer-1' }
 */
export function parseJekyllFilename(filename: string): { date: string; slug: string } {
  const datePattern = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;
  const match = filename.match(datePattern);

  if (!match) {
    // 날짜가 없는 파일명 (예: README.md)
    return {
      date: new Date().toISOString().split('T')[0],
      slug: filename.replace('.md', ''),
    };
  }

  return {
    date: match[1],
    slug: match[2],
  };
}

/**
 * Jekyll frontmatter를 Astro 스키마로 변환
 */
export function convertFrontmatter(
  jekyllFm: JekyllFrontmatter,
  fileDate: string
): AstroFrontmatter {
  // 시리즈 정보 추출 (제목에서 패턴 매칭)
  const seriesPattern = /^(.+?)\s+(\d+)\s*-/;
  const seriesMatch = jekyllFm.title.match(seriesPattern);

  let series: AstroFrontmatter['series'] = undefined;
  if (seriesMatch) {
    series = {
      name: seriesMatch[1].trim(),
      order: parseInt(seriesMatch[2], 10),
    };
  }

  // undefined 값 필터링 (YAML 직렬화 오류 방지)
  const result: AstroFrontmatter = {
    title: jekyllFm.title,
    excerpt: jekyllFm.excerpt,
    date: jekyllFm.date || fileDate,
    categories: Array.isArray(jekyllFm.categories)
      ? jekyllFm.categories
      : [jekyllFm.categories].filter(Boolean),
    tags: Array.isArray(jekyllFm.tags)
      ? jekyllFm.tags.flat() // 중첩 배열 평탄화
      : [],
    toc: jekyllFm.toc !== false, // 기본값 true
    tocDepth: 3,
    draft: false,
    lang: 'ko', // 한국어 블로그
    author: 'Tolerblanc',
  };

  // 선택적 필드: undefined가 아닌 경우에만 추가
  if (jekyllFm.last_modified_at) {
    result.updatedDate = jekyllFm.last_modified_at;
  }
  if (jekyllFm.excerpt) {
    result.description = jekyllFm.excerpt.slice(0, 160);
  }
  if (series) {
    result.series = series;
  }

  return result;
}

/**
 * Notice 블록을 MDX 컴포넌트로 변환
 * 예: <div class="notice--info" markdown="1">...</div>
 * → <Notice type="info">...</Notice>
 */
export function convertNoticeBlocks(content: string): string {
  // notice--{type} 패턴 추출
  const noticePattern = /<div\s+class="notice--(\w+)"(?:\s+markdown="1")?>(.+?)<\/div>/gs;

  return content.replace(noticePattern, (_, type, innerContent) => {
    // 내부 HTML 태그 제거 (예: <br/>)
    const cleanContent = innerContent
      .replace(/<br\s*\/?>/gi, '\n')
      .trim();

    return `<Notice type="${type}">\n${cleanContent}\n</Notice>`;
  });
}

/**
 * GitHub raw 이미지 URL을 최적화
 * 예: https://github.com/Tolerblanc/Tolerblanc.github.io/assets/...
 * → /images/posts/[slug]/[filename] (추후 최적화 가능)
 */
export function optimizeImagePaths(content: string, _slug: string): string {
  // 현재는 원본 URL 유지 (Phase 4에서 최적화 예정)
  return content;
}

/**
 * MDX에서 문제가 될 수 있는 특수 문자 이스케이프
 * JSX 구문과 충돌할 수 있는 <, >, { } 등을 처리
 */
export function escapeMDXCharacters(content: string): string {
  // 코드 블록 내부는 제외하고 처리
  const codeBlockPattern = /(```[\s\S]*?```|`[^`]+`)/g;
  const codeBlocks: string[] = [];

  // 코드 블록을 임시로 저장
  let processedContent = content.replace(codeBlockPattern, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });

  // LaTeX 수식도 보호 (\\( ... \\) 형식)
  processedContent = processedContent.replace(/\\\\\([^)]*\\\\\)/g, (match) => {
    const placeholder = `__LATEX_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });

  // 텍스트에서 <= , >= 를 HTML 엔티티로 변환
  processedContent = processedContent
    .replace(/<=(?![^<]*?>)/g, '&lt;=')
    .replace(/>=(?![^<]*?>)/g, '&gt;=');

  // 코드 블록 및 LaTeX 복원
  codeBlocks.forEach((block, index) => {
    processedContent = processedContent.replace(
      new RegExp(`__(?:CODE_BLOCK|LATEX)_${index}__`, 'g'),
      block
    );
  });

  return processedContent;
}

/**
 * 단일 Jekyll 파일을 MDX로 변환
 */
export async function convertJekyllToMDX(
  filePath: string,
  outputDir: string
): Promise<ConversionResult> {
  // 파일 읽기
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const parsed = matter(fileContent);
  const jekyllFm = parsed.data as JekyllFrontmatter;
  const jekyllContent = parsed.content;

  // 파일명에서 날짜와 슬러그 추출
  const filename = path.basename(filePath);
  const { date: fileDate, slug } = parseJekyllFilename(filename);

  // Frontmatter 변환
  const astroFm = convertFrontmatter(jekyllFm, fileDate);

  // 콘텐츠 변환
  let convertedContent = jekyllContent;
  convertedContent = convertNoticeBlocks(convertedContent);
  convertedContent = escapeMDXCharacters(convertedContent);
  convertedContent = optimizeImagePaths(convertedContent, slug);

  // MDX 파일 생성
  const mdxFrontmatter = matter.stringify(convertedContent, astroFm);

  // 카테고리 기반 경로 생성 (예: Web/NestJS → src/content/blog/web/nestjs/)
  const categoryPath = astroFm.categories
    .map((cat) => cat.toLowerCase().replace(/\s+/g, '-'))
    .join('/');

  const outputPath = path.join(outputDir, categoryPath);
  const outputFile = path.join(outputPath, `${slug}.mdx`);

  // 디렉토리 생성
  await fs.mkdir(outputPath, { recursive: true });

  // MDX 파일 쓰기
  await fs.writeFile(outputFile, mdxFrontmatter, 'utf-8');

  return {
    frontmatter: astroFm,
    content: convertedContent,
    slug,
    originalPath: filePath,
  };
}

/**
 * 디렉토리의 모든 Jekyll 파일을 일괄 변환
 */
export async function convertAllJekyllPosts(
  inputDir: string,
  outputDir: string,
  options: {
    dryRun?: boolean;
    filter?: (filePath: string) => boolean;
  } = {}
): Promise<ConversionResult[]> {
  const { dryRun = false, filter = () => true } = options;

  // _posts 디렉토리 재귀 탐색
  async function findMarkdownFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return findMarkdownFiles(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          return [fullPath];
        }
        return [];
      })
    );
    return files.flat();
  }

  const allFiles = await findMarkdownFiles(inputDir);
  const filteredFiles = allFiles.filter(filter);

  console.log(`Found ${filteredFiles.length} Jekyll posts to convert`);

  if (dryRun) {
    console.log('[DRY RUN] No files will be modified');
    return [];
  }

  const results: ConversionResult[] = [];
  for (const file of filteredFiles) {
    try {
      const result = await convertJekyllToMDX(file, outputDir);
      results.push(result);
      console.log(`✅ Converted: ${path.basename(file)} → ${result.slug}.mdx`);
    } catch (error) {
      console.error(`❌ Failed to convert ${file}:`, error);
    }
  }

  return results;
}
