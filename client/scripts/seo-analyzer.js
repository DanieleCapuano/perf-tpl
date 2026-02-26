/**
 * SEO Analyzer
 * 
 * Runs Lighthouse and analyzes SEO metrics
 * Run with: node scripts/seo-analyzer.js
 */

import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'node:url';

const URL = process.env.ANALYZE_URL || 'http://localhost:5173';

async function runLighthouse(url) {
  console.log(`Running Lighthouse analysis on: ${url}`);

  const chrome = await launch({ chromeFlags: ['--headless'] });

  try {
    const options = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse(url, options);

    // Extract scores
    const { lhr } = runnerResult;
    const scores = {
      performance: lhr.categories.performance.score * 100,
      accessibility: lhr.categories.accessibility.score * 100,
      bestPractices: lhr.categories['best-practices'].score * 100,
      seo: lhr.categories.seo.score * 100,
    };

    console.log('\n📊 Lighthouse Scores:');
    console.log(`  Performance:    ${scores.performance.toFixed(0)}%`);
    console.log(`  Accessibility:  ${scores.accessibility.toFixed(0)}%`);
    console.log(`  Best Practices: ${scores.bestPractices.toFixed(0)}%`);
    console.log(`  SEO:            ${scores.seo.toFixed(0)}%`);

    // Core Web Vitals
    const metrics = lhr.audits;
    console.log('\n⚡ Core Web Vitals:');
    console.log(`  LCP: ${metrics['largest-contentful-paint']?.displayValue || 'N/A'}`);
    console.log(`  FID: ${metrics['max-potential-fid']?.displayValue || 'N/A'}`);
    console.log(`  CLS: ${metrics['cumulative-layout-shift']?.displayValue || 'N/A'}`);

    // Save detailed report
    const reportPath = resolve(process.cwd(), 'lighthouse-report.html');
    writeFileSync(reportPath, runnerResult.report);
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    // Check for SEO issues
    console.log('\n🔍 SEO Analysis:');

    const seoAudits = [
      'document-title',
      'meta-description',
      'http-status-code',
      'link-text',
      'crawlable-anchors',
      'is-crawlable',
      'robots-txt',
      'image-alt',
      'hreflang',
      'canonical',
    ];

    seoAudits.forEach(auditId => {
      const audit = metrics[auditId];
      if (audit) {
        const status = audit.score === 1 ? '✓' : '✗';
        console.log(`  ${status} ${audit.title}`);
        if (audit.score !== 1 && audit.description) {
          console.log(`    └─ ${audit.description}`);
        }
      }
    });

    return scores;
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    throw error;
  } finally {
    await chrome.kill();
  }
}

/**
 * Analyze meta tags
 */
function analyzeMeta() {
  console.log('\n📋 SEO Checklist:');

  const checklist = [
    '☐ Title tag (50-60 characters)',
    '☐ Meta description (150-160 characters)',
    '☐ Open Graph tags (og:title, og:description, og:image)',
    '☐ Twitter Card tags',
    '☐ Canonical URL',
    '☐ Alt text for all images',
    '☐ Structured data (JSON-LD)',
    '☐ XML Sitemap',
    '☐ Robots.txt',
    '☐ Mobile-friendly design',
    '☐ Fast page load (< 3s)',
    '☐ HTTPS enabled',
    '☐ Valid HTML',
    '☐ Internal linking',
    '☐ Heading hierarchy (H1, H2, etc.)',
  ];

  checklist.forEach(item => console.log(`  ${item}`));
}

// Run if called directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('🚀 Starting SEO Analysis...\n');

  runLighthouse(URL)
    .then(() => {
      analyzeMeta();
      console.log('\n✓ Analysis complete!\n');
    })
    .catch(err => {
      console.error('Analysis failed:', err);
      process.exit(1);
    });
}

export { runLighthouse, analyzeMeta };
