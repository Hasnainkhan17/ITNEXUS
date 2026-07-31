import { useEffect } from 'react';

export default function useSeo({ title, description, keywords, ogImage, ogType = 'website', canonical }) {
  useEffect(() => {
    // 1. Browser Tab Title Tag
    let pageTitle = 'ITNEXUS | Innovative IT Solutions';
    if (title && title.toLowerCase() !== 'home') {
      pageTitle = `${title} | ITNEXUS`;
    }
    document.title = pageTitle;

    // Helper to get or create a head meta/link tag
    const updateOrCreateMeta = (nameAttr, nameVal, contentVal, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameVal}"]` : `meta[name="${nameVal}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', nameVal);
        } else {
          el.setAttribute('name', nameVal);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentVal || '');
    };

    // 2. Standard SEO Meta Tags
    updateOrCreateMeta('name', 'description', description || 'ITNEXUS delivers custom software, scalable cloud architectures, premium UI/UX, and robust system engineering to power global digital transformations.');
    if (keywords) {
      updateOrCreateMeta('name', 'keywords', keywords);
    }
    updateOrCreateMeta('name', 'robots', 'index, follow');

    // 3. Open Graph (OG) Meta Tags
    updateOrCreateMeta('property', 'og:title', pageTitle, true);
    updateOrCreateMeta('property', 'og:description', description || 'ITNEXUS delivers custom software, scalable cloud architectures, premium UI/UX, and robust system engineering.', true);
    updateOrCreateMeta('property', 'og:type', ogType, true);
    updateOrCreateMeta('property', 'og:url', window.location.href, true);
    if (ogImage) {
      updateOrCreateMeta('property', 'og:image', ogImage, true);
    }

    // 4. Twitter Card Meta Tags
    updateOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('name', 'twitter:title', pageTitle);
    updateOrCreateMeta('name', 'twitter:description', description || 'ITNEXUS delivers custom software, scalable cloud architectures, premium UI/UX, and robust system engineering.');
    if (ogImage) {
      updateOrCreateMeta('name', 'twitter:image', ogImage);
    }

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical || window.location.href);

  }, [title, description, keywords, ogImage, ogType, canonical]);
}
