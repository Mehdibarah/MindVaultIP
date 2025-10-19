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
 * Get current locale from localStorage or default to English
 * COMPLETELY IGNORES browser language detection
 * @returns {string} Current locale
 */
export function getCurrentLocale() {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }
  
  // ONLY check localStorage - completely ignore browser language
  const savedLocale = localStorage.getItem('lang');
  if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
    return savedLocale;
  }
  
  // ALWAYS default to English for new users
  // NO browser language detection whatsoever
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
 * Clear any existing language settings and force English
 */
export function forceEnglishDefault() {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Clear any existing language settings
  localStorage.removeItem('lang');
  sessionStorage.removeItem('lang');
  
  // Force English
  localStorage.setItem('lang', DEFAULT_LOCALE);
  
  // Update DOM immediately
  document.documentElement.lang = DEFAULT_LOCALE;
  document.documentElement.dir = 'ltr';
  
  console.log('🌐 Forced English as default language');
}

/**
 * Debug function to check language sources
 */
export function debugLanguageSources() {
  if (typeof window === 'undefined') {
    return;
  }
  
  console.log('🔍 Language Debug Info:');
  console.log('- localStorage lang:', localStorage.getItem('lang'));
  console.log('- sessionStorage lang:', sessionStorage.getItem('lang'));
  console.log('- navigator.language:', navigator.language);
  console.log('- navigator.languages:', navigator.languages);
  console.log('- document.documentElement.lang:', document.documentElement.lang);
  console.log('- document.documentElement.dir:', document.documentElement.dir);
  console.log('- DEFAULT_LOCALE:', DEFAULT_LOCALE);
}

/**
 * Initialize i18n on app startup
 * FORCES English as the default language for new users
 */
export function initializeI18n() {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Debug language sources
  debugLanguageSources();
  
  // FORCE English as default for new users - ignore any browser language detection
  const savedLocale = localStorage.getItem('lang');
  let currentLocale;
  
  if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
    // User has explicitly set a language, use it
    currentLocale = savedLocale;
    console.log(`🌐 Using saved language: ${currentLocale}`);
  } else {
    // New user - FORCE English regardless of browser language
    currentLocale = DEFAULT_LOCALE;
    localStorage.setItem('lang', DEFAULT_LOCALE);
    console.log(`🌐 Forcing English default: ${currentLocale}`);
  }
  
  // Set the locale and update DOM
  setLocale(currentLocale);
  
  console.log(`🌐 Language initialized: ${currentLocale} (${getLanguageName(currentLocale)}) - Browser language ignored`);
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
