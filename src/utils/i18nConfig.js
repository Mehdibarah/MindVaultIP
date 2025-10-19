/**
 * i18n Configuration for MindVaultIP
 * Supports multiple locales with proper fallback and RTL support
 */

export const SUPPORTED_LOCALES = [
  'en', // English (default)
  'es', // Spanish
  'fr', // French
  'ar', // Arabic
  'de', // German
  'ur', // Urdu
  'ru', // Russian
  'sw', // Kiswahili
  'ha', // Hausa
  'yo', // Yoruba
  'tr', // Turkish
  'fa', // Persian (existing)
  'hi', // Hindi (existing)
  'ja', // Japanese (existing)
  'ko', // Korean (existing)
  'zh', // Chinese (existing)
];

export const DEFAULT_LOCALE = 'en';
export const FALLBACK_LOCALE = 'en';

// RTL languages
export const RTL_LOCALES = ['ar', 'ur', 'fa'];

// Language display names
export const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية',
  de: 'Deutsch',
  ur: 'اردو',
  ru: 'Русский',
  sw: 'Kiswahili',
  ha: 'Hausa',
  yo: 'Yorùbá',
  tr: 'Türkçe',
  fa: 'فارسی',
  hi: 'हिन्दी',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
};

// Language direction
export const LANGUAGE_DIRECTIONS = {
  en: 'ltr',
  es: 'ltr',
  fr: 'ltr',
  ar: 'rtl',
  de: 'ltr',
  ur: 'rtl',
  ru: 'ltr',
  sw: 'ltr',
  ha: 'ltr',
  yo: 'ltr',
  tr: 'ltr',
  fa: 'rtl',
  hi: 'ltr',
  ja: 'ltr',
  ko: 'ltr',
  zh: 'ltr',
};

/**
 * Get current locale from localStorage or browser
 * @returns {string} Current locale
 */
export function getCurrentLocale() {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  
  // Check localStorage first
  const savedLocale = localStorage.getItem('lang');
  if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
    return savedLocale;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LOCALES.includes(browserLang)) {
    return browserLang;
  }
  
  // Check browser languages array
  for (const lang of navigator.languages) {
    const langCode = lang.split('-')[0];
    if (SUPPORTED_LOCALES.includes(langCode)) {
      return langCode;
    }
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Set locale and save to localStorage
 * @param {string} locale - Locale to set
 */
export function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn(`Unsupported locale: ${locale}. Falling back to ${DEFAULT_LOCALE}`);
    locale = DEFAULT_LOCALE;
  }
  
  localStorage.setItem('lang', locale);
  
  // Update document attributes
  document.documentElement.lang = locale;
  document.documentElement.dir = LANGUAGE_DIRECTIONS[locale] || 'ltr';
  
  // Dispatch language change event
  window.dispatchEvent(new Event('languageChange'));
}

/**
 * Check if a locale is RTL
 * @param {string} locale - Locale to check
 * @returns {boolean} True if RTL
 */
export function isRTL(locale) {
  return RTL_LOCALES.includes(locale);
}

/**
 * Get language display name
 * @param {string} locale - Locale code
 * @returns {string} Display name
 */
export function getLanguageName(locale) {
  return LANGUAGE_NAMES[locale] || locale;
}

/**
 * Initialize i18n on app startup
 */
export function initializeI18n() {
  if (typeof window === 'undefined') {
    return;
  }
  
  const currentLocale = getCurrentLocale();
  setLocale(currentLocale);
}

export default {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  RTL_LOCALES,
  LANGUAGE_NAMES,
  LANGUAGE_DIRECTIONS,
  getCurrentLocale,
  setLocale,
  isRTL,
  getLanguageName,
  initializeI18n,
};
