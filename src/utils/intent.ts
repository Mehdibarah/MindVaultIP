/**
 * Intent Detection for AI Mentor
 * Determines if query is GENERAL or IP-related
 */

export function detectIntent(q: string): 'GENERAL' | 'IP' {
  const s = q.toLowerCase();
  const ip = [
    'ثبت ایده', 'ثبت اختراع', 'مالکیت فکری', 'patent', 'wipo', 'claims', 
    'prior art', 'licensing', 'اختراع', 'پتنت', 'ثبت', 'مالکیت', 'حق اختراع',
    'intellectual property', 'trademark', 'copyright', 'filing', 'application',
    'invention', 'novelty', 'patentability', 'examination', 'grant', 'office action'
  ];
  
  return ip.some(k => s.includes(k)) ? 'IP' : 'GENERAL';
}

export function shouldSearch(q: string): boolean {
  const s = q.toLowerCase();
  const triggers = [
    // Persian triggers
    /خبر|قیمت|نسخه|قانون|آمار|کی|چه کسی|چه زمانی|چند|آخرین|امروز|جدید|نتیجه|هزینه|ارزش|بازار|سهام|ارز|بیت کوین|اخیراً|هفته گذشته|ماه گذشته|سال گذشته/,
    // English triggers  
    /who|when|price|version|law|stats|latest|today|news|score|cost|value|market|stock|crypto|bitcoin|recently|this week|last month|last year|current|update|release|changes/,
    // Date patterns
    /\d{4}/, // Years
    /\d{1,2}\/\d{1,2}\/\d{4}/, // Dates
    /(january|february|march|april|may|june|july|august|september|october|november|december)/i,
    /(ژانویه|فوریه|مارس|آوریل|مه|ژوئن|ژوئیه|اوت|سپتامبر|اکتبر|نوامبر|دسامبر)/i,
    // Version numbers
    /v?\d+\.\d+/i, // Version numbers like v1.2, 2.0
    // Price patterns
    /\$\d+/, /€\d+/, /£\d+/, /ریال\s*\d+/i, /تومان\s*\d+/i
  ];
  
  return triggers.some(r => r.test(s));
}

export function detectLanguage(q: string): 'fa' | 'en' {
  const persianChars = /[\u0600-\u06FF]/;
  return persianChars.test(q) ? 'fa' : 'en';
}

export function extractSearchTerms(q: string): string[] {
  // Remove common stop words
  const stopWords = {
    fa: ['چیست', 'چی', 'کدام', 'کجا', 'چرا', 'چگونه', 'که', 'از', 'در', 'به', 'با', 'برای', 'این', 'آن', 'یک'],
    en: ['what', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that']
  };
  
  const language = detectLanguage(q);
  const words = q.toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords[language].includes(word));
    
  return [...new Set(words)]; // Remove duplicates
}

export default {
  detectIntent,
  shouldSearch,
  detectLanguage,
  extractSearchTerms
};
