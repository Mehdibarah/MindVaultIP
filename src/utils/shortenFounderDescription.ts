/**
 * Utility to shorten founder-related descriptions to a canonical short form
 * Detects founder/team phrases in multiple languages and returns standardized labels
 */

export function shortenFounderDescription(
  desc: string, 
  locale: string = (typeof document !== 'undefined' 
    ? document.documentElement.lang || 'en' 
    : 'en')
): string {
  // Regex patterns for detecting founder-related phrases in different languages
  const rules: Record<string, RegExp> = {
    fa: /بنیان[\u200c ]?گذار(?:ان)?(?:\s*و\s*تیم.*)?/i,
    ar: /المؤسس(?:ون|ين)?(?:\s*و\s*الفريق.*)?/i,
    en: /founder(?:s)?(?:\s*and\s*team.*)?/i,
    tr: /kurucu(?:lar)?(?:\s+ve\s+ekip.*)?/i,
    ru: /основател(?:ь|и)(?:\s+и\s+команда.*)?/i,
    es: /fundador(?:es)?(?:\s+y\s+equipo.*)?/i,
    fr: /fondateur(?:s)?(?:\s+et\s+équipe.*)?/i,
    de: /gr[üu]nder(?:innen|n)?(?:\s+und\s+team.*)?/i
  };

  // Standardized short labels for each language
  const labels: Record<string, string> = {
    fa: 'برای بنیانگذار',
    ar: 'للمؤسس',
    en: 'For founder',
    tr: 'Kurucu için',
    ru: 'Для основателя',
    es: 'Para fundador',
    fr: 'Pour le fondateur',
    de: 'Für Gründer'
  };

  // Determine the language to use (fallback to 'en' if not supported)
  const lang = (labels[locale] ? locale : 'en');
  const rx = rules[lang] || rules.en;

  // Test if the description matches founder-related patterns
  return rx.test(desc) ? labels[lang] : desc;
}

// Export for testing
export const founderPatterns = {
  fa: /بنیان[\u200c ]?گذار(?:ان)?(?:\s*و\s*تیم.*)?/i,
  ar: /المؤسس(?:ون|ين)?(?:\s*و\s*الفريق.*)?/i,
  en: /founder(?:s)?(?:\s*and\s*team.*)?/i,
  tr: /kurucu(?:lar)?(?:\s+ve\s+ekip.*)?/i,
  ru: /основател(?:ь|и)(?:\s+и\s+команда.*)?/i,
  es: /fundador(?:es)?(?:\s+y\s+equipo.*)?/i,
  fr: /fondateur(?:s)?(?:\s+et\s+équipe.*)?/i,
  de: /gr[üu]nder(?:innen|n)?(?:\s+und\s+team.*)?/i
};

export const founderLabels = {
  fa: 'برای بنیانگذار',
  ar: 'للمؤسس',
  en: 'For founder',
  tr: 'Kurucu için',
  ru: 'Для основателя',
  es: 'Para fundador',
  fr: 'Pour le fondateur',
  de: 'Für Gründer'
};

export default shortenFounderDescription;
