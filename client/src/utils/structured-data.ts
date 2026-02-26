/**
 * Structured Data (JSON-LD) for SEO
 * 
 * Helps search engines understand your content better
 * Include this in your HTML or generate dynamically
 */

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Performance Template App',
  description: 'High-performance web application with React, WebAssembly, and modern optimizations',
  url: 'https://yoursite.com',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Your Company',
    url: 'https://yoursite.com',
  },
  screenshot: 'https://yoursite.com/screenshot.png',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1234',
  },
};

/**
 * Breadcrumb structured data
 */
export const breadcrumbData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://yoursite.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Features',
      item: 'https://yoursite.com/features',
    },
  ],
};

/**
 * Organization structured data
 */
export const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Your Company',
  url: 'https://yoursite.com',
  logo: 'https://yoursite.com/logo.png',
  sameAs: [
    'https://twitter.com/yourcompany',
    'https://www.linkedin.com/company/yourcompany',
    'https://github.com/yourcompany',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-XXX-XXX-XXXX',
    contactType: 'Customer Service',
  },
};

/**
 * Insert structured data into page
 */
export function insertStructuredData(data: any): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}
