import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const baseURL = 'http://localhost:4321/experimental';

test.describe('SEO Verification', () => {
  test('Home page has proper meta tags', async ({ page }) => {
    await page.goto(baseURL);

    // Title
    await expect(page).toHaveTitle('인생은 B와 D사이 Code다');

    // Meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBe('Tolerblanc의 기술 블로그 (Astro 실험 버전)');

    // Canonical URL (trailing slash is OK)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/https:\/\/tolerblanc\.github\.io\/experimental\/?/);

    // Google Analytics script exists in head
    const gaScript = await page.locator('script[src*="googletagmanager.com"]').count();
    expect(gaScript).toBeGreaterThan(0);

    console.log('✅ Home page meta tags verified');
  });

  test('Blog post has proper meta tags and structure', async ({ page }) => {
    await page.goto(`${baseURL}/blog/javascript/nestjs-dematerializer-4`);

    // Title should contain post title
    const title = await page.title();
    expect(title).toContain('NestJS 해체분석기 4');

    // Meta description exists
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    console.log('Description:', description);

    // Canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('/blog/javascript/nestjs-dematerializer-4');

    // Giscus comments section exists
    const giscus = page.locator('.giscus');
    await expect(giscus).toBeVisible();

    console.log('✅ Blog post meta tags verified');
  });

  test('Category page has proper meta tags', async ({ page }) => {
    await page.goto(`${baseURL}/blog/category/javascript`);

    // Title
    const title = await page.title();
    expect(title).toContain('JavaScript');

    // Meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();

    // Canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('/blog/category/javascript');

    console.log('✅ Category page meta tags verified');
  });

  test('Tags page has proper meta tags', async ({ page }) => {
    await page.goto(`${baseURL}/tags`);

    // Title
    const title = await page.title();
    expect(title).toContain('Tags');

    // Canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('/tags');

    console.log('✅ Tags page meta tags verified');
  });

  test('About page has proper meta tags', async ({ page }) => {
    await page.goto(`${baseURL}/about`);

    // Title
    const title = await page.title();
    expect(title).toContain('About');

    // Meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('Tolerblanc');

    // Canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('/about');

    console.log('✅ About page meta tags verified');
  });

  test('Sitemap is generated in dist', async () => {
    // Sitemap은 빌드 결과물에만 있고 dev 서버에서는 제공되지 않을 수 있음
    const distPath = join(process.cwd(), 'dist');
    const sitemapIndex = join(distPath, 'sitemap-index.xml');
    const sitemap0 = join(distPath, 'sitemap-0.xml');

    expect(existsSync(sitemapIndex)).toBe(true);
    expect(existsSync(sitemap0)).toBe(true);

    const sitemapContent = readFileSync(sitemapIndex, 'utf-8');
    expect(sitemapContent).toContain('<sitemapindex');
    expect(sitemapContent).toContain('sitemap-0.xml');

    console.log('✅ Sitemap generated in dist');
  });

  test('Robots.txt is accessible', async ({ page }) => {
    const response = await page.goto(`${baseURL}/robots.txt`);
    expect(response?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Allow: /');
    expect(content).toContain('Sitemap:');

    console.log('✅ Robots.txt accessible');
  });

  test('RSS feed is generated in dist', async () => {
    // RSS 피드도 빌드 결과물에만 있을 수 있음
    const distPath = join(process.cwd(), 'dist');
    const rssPath = join(distPath, 'rss.xml');

    expect(existsSync(rssPath)).toBe(true);

    const rssContent = readFileSync(rssPath, 'utf-8');
    expect(rssContent).toContain('<rss');
    expect(rssContent).toContain('Tolerblanc');

    console.log('✅ RSS feed generated in dist');
  });
});
