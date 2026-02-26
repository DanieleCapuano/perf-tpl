/**
 * Meta Tags Manager
 * 
 * Utility for dynamically updating meta tags for SEO
 */

interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
}

/**
 * Update page meta tags
 */
export function updateMetaTags(tags: MetaTags): void {
  // Title
  if (tags.title) {
    document.title = tags.title;
    updateMetaTag('og:title', tags.ogTitle || tags.title);
    updateMetaTag('twitter:title', tags.twitterTitle || tags.title);
  }

  // Description
  if (tags.description) {
    updateMetaTag('description', tags.description);
    updateMetaTag('og:description', tags.ogDescription || tags.description);
    updateMetaTag('twitter:description', tags.twitterDescription || tags.description);
  }

  // Keywords
  if (tags.keywords) {
    updateMetaTag('keywords', tags.keywords);
  }

  // Open Graph
  if (tags.ogImage) {
    updateMetaTag('og:image', tags.ogImage);
  }

  if (tags.ogUrl) {
    updateMetaTag('og:url', tags.ogUrl);
  }

  // Twitter
  if (tags.twitterCard) {
    updateMetaTag('twitter:card', tags.twitterCard);
  }

  const twitterImageUrl = tags.twitterImage || tags.ogImage;
  if (twitterImageUrl) {
    updateMetaTag('twitter:image', twitterImageUrl);
  }

  // Canonical URL
  if (tags.canonical) {
    updateLinkTag('canonical', tags.canonical);
  }
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(name: string, content: string): void {
  // Try property first (for og:* tags)
  let element = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    // Try name attribute
    element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  }

  if (element) {
    element.content = content;
  } else {
    // Create new meta tag
    const meta = document.createElement('meta');
    
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    
    meta.content = content;
    document.head.appendChild(meta);
  }
}

/**
 * Update or create a link tag
 */
function updateLinkTag(rel: string, href: string): void {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (element) {
    element.href = href;
  } else {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
  }
}

/**
 * Generate meta tags for a page
 */
export function generatePageMeta(
  title: string,
  description: string,
  path: string = '',
  image?: string
): MetaTags {
  const baseUrl = window.location.origin;
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/og-image.jpg`;

  return {
    title: `${title} | Performance Template`,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogUrl: url,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    canonical: url,
  };
}

/**
 * Get current page performance metrics for analytics
 */
export function getPerformanceMetrics(): Record<string, number> {
  if (!('performance' in window)) {
    return {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  const metrics: Record<string, number> = {
    // Navigation timing
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,
  };

  // Paint timing
  paint.forEach((entry) => {
    if (entry.name === 'first-paint') {
      metrics.fp = entry.startTime;
    } else if (entry.name === 'first-contentful-paint') {
      metrics.fcp = entry.startTime;
    }
  });

  // LCP (if available)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (_e) {
    // LCP not supported
  }

  return metrics;
}
