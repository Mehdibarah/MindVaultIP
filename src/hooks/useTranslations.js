import { useState, useEffect } from 'react';
import { getCurrentLocale, isRTL } from '@/utils/i18nConfig';

/**
 * Custom hook for accessing translations
 * @param {string} namespace - The translation namespace (e.g., 'whitepaper', 'common')
 * @returns {object} Translation object and current locale info
 */
export function useTranslations(namespace) {
  const [translations, setTranslations] = useState({});
  const [currentLocale, setCurrentLocale] = useState(getCurrentLocale());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        const locale = getCurrentLocale();
        
        // Try to load the specific namespace translation file
        const translationModule = await import(`@/locales/${locale}/${namespace}.json`);
        setTranslations(translationModule.default || translationModule);
        setCurrentLocale(locale);
      } catch (error) {
        console.warn(`Failed to load translations for ${namespace} in ${currentLocale}:`, error);
        
        // Fallback to English
        try {
          const fallbackModule = await import(`@/locales/en/${namespace}.json`);
          setTranslations(fallbackModule.default || fallbackModule);
          setCurrentLocale('en');
        } catch (fallbackError) {
          console.error(`Failed to load fallback translations for ${namespace}:`, fallbackError);
          setTranslations({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();

    // Listen for language changes
    const handleLanguageChange = () => {
      loadTranslations();
    };

    window.addEventListener('languageChange', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, [namespace, currentLocale]);

  return {
    t: translations,
    locale: currentLocale,
    isRTL: isRTL(currentLocale),
    isLoading
  };
}

export default useTranslations;

