/**
 * Centralized Language Configuration
 * Ensures English is the default language across the entire platform
 */

// Default language configuration
export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  fa: 'فارسی',
  ar: 'العربية',
  tr: 'Türkçe',
  ru: 'Русский',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch'
};

// RTL languages
export const RTL_LANGUAGES = ['fa', 'ar', 'ur', 'bal'];

/**
 * Get the current language from localStorage or default to English
 * @returns {string} The current language code
 */
export function getCurrentLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  return localStorage.getItem('lang') || DEFAULT_LANGUAGE;
}

/**
 * Set the language and save to localStorage
 * @param {string} language - The language code to set
 */
export function setLanguage(language) {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Validate language
  if (!SUPPORTED_LANGUAGES[language]) {
    console.warn(`Unsupported language: ${language}. Falling back to ${DEFAULT_LANGUAGE}`);
    language = DEFAULT_LANGUAGE;
  }
  
  // Save to localStorage
  localStorage.setItem('lang', language);
  
  // Update document attributes
  document.documentElement.lang = language;
  document.documentElement.dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
  
  // Dispatch language change event
  window.dispatchEvent(new Event('languageChange'));
}

/**
 * Check if a language is RTL
 * @param {string} language - The language code
 * @returns {boolean} True if the language is RTL
 */
export function isRTL(language) {
  return RTL_LANGUAGES.includes(language);
}

/**
 * Initialize language on app startup
 * This should be called once when the app loads
 */
export function initializeLanguage() {
  if (typeof window === 'undefined') {
    return;
  }
  
  const currentLang = getCurrentLanguage();
  setLanguage(currentLang);
}

/**
 * Hook for React components to use language state
 * @returns {Object} Language state and utilities
 */
export function useLanguage() {
  const [language, setLanguageState] = useState(getCurrentLanguage());
  
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageState(getCurrentLanguage());
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  const changeLanguage = (newLang) => {
    setLanguage(newLang);
  };
  
  return {
    language,
    changeLanguage,
    isRTL: isRTL(language),
    supportedLanguages: SUPPORTED_LANGUAGES
  };
}

// Import React hooks for the useLanguage hook
import { useState, useEffect } from 'react';

export default {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  SUPPORTED_LANGUAGES,
  RTL_LANGUAGES,
  getCurrentLanguage,
  setLanguage,
  isRTL,
  initializeLanguage,
  useLanguage
};

