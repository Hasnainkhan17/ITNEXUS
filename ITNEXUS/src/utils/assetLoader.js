import logoHorizontalColor from '../assets/itnexus-logo-horizontal-color@2x.png';
import logoHorizontalReversed from '../assets/itnexus-logo-horizontal-reversed@2x.png';
import logoVerticalColor from '../assets/itnexus-logo-vertical-color@2x.png';
import logoVerticalReversed from '../assets/itnexus-logo-vertical-reversed@2x.png';
import markColor from '../assets/itnexus-mark-color-512px.png';
import markReversed from '../assets/itnexus-mark-reversed-512px.png';

/**
 * Dynamic branding asset loader.
 * Can fall back to a database CDN URL if configured, otherwise loads from local assets.
 */
export const getBrandingAsset = (variant, useCDN = false, cdnBaseUrl = '') => {
  // If CDN is active and custom URL is provided by database configurations
  if (useCDN && cdnBaseUrl) {
    return `${cdnBaseUrl}/branding/${variant}.png`;
  }

  // Fall back to local bundled assets
  switch (variant) {
    case 'logo-horizontal-color':
      return logoHorizontalColor;
    case 'logo-horizontal-reversed':
      return logoHorizontalReversed;
    case 'logo-vertical-color':
      return logoVerticalColor;
    case 'logo-vertical-reversed':
      return logoVerticalReversed;
    case 'mark-color':
      return markColor;
    case 'mark-reversed':
      return markReversed;
    default:
      return logoHorizontalColor;
  }
};

/**
 * Resolves database image references or filenames to actual bundled asset imports
 * or falls back to absolute HTTP URLs.
 */
export const resolveAssetUrl = (name) => {
  if (!name) return markColor;
  if (typeof name !== 'string') return name;
  if (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('data:') || name.startsWith('/')) {
    return name;
  }
  const lower = name.toLowerCase();
  if (lower.includes('logo-horizontal-color') || lower.includes('horizontal-color')) return logoHorizontalColor;
  if (lower.includes('logo-horizontal-reversed') || lower.includes('horizontal-reversed')) return logoHorizontalReversed;
  if (lower.includes('logo-vertical-color') || lower.includes('vertical-color')) return logoVerticalColor;
  if (lower.includes('logo-vertical-reversed') || lower.includes('vertical-reversed')) return logoVerticalReversed;
  if (lower.includes('mark-reversed') || lower.includes('reversed')) return markReversed;
  if (lower.includes('mark-color') || lower.includes('color') || lower.includes('mark')) return markColor;
  return markColor;
};
