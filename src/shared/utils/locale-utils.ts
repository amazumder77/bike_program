const SUPPORTED_LOCALE_REGEXP = /^([a-zA-Z]{2})[-_]([a-zA-Z]{2})$/;

/**
 * Convert string to ll_UU format (en-us --> en_US)
 */
export const standardizeLocale = (locale: string): string =>
  locale === null
    ? locale
    : locale.replace(SUPPORTED_LOCALE_REGEXP, (match, p1, p2) => `${p1.toLowerCase()}_${p2.toUpperCase()}`);
