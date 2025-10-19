/**
 * Web Search Classifier
 * Determines if a user query requires web search based on content analysis
 */

// Keywords that indicate need for web search
const WEB_SEARCH_INDICATORS = {
  // Time-sensitive queries
  time: ['امروز', 'دیروز', 'فردا', 'هفته گذشته', 'ماه گذشته', 'سال گذشته', 'اخیراً', 'جدید', 'آخرین', 'current', 'latest', 'recent', 'today', 'yesterday', 'this week', 'last month', 'recently', 'newest'],
  
  // News and events
  news: ['خبر', 'رویداد', 'اتفاق', 'حوادث', 'اخبار', 'news', 'event', 'happening', 'incident', 'breaking'],
  
  // Prices and market data
  price: ['قیمت', 'هزینه', 'ارزش', 'بازار', 'سهام', 'ارز', 'بیت کوین', 'price', 'cost', 'value', 'market', 'stock', 'crypto', 'bitcoin'],
  
  // Laws and regulations
  law: ['قانون', 'مقررات', 'سیاست', 'دستورالعمل', 'law', 'regulation', 'policy', 'guideline', 'legal'],
  
  // Specific entities that change
  entities: ['نسخه', 'ورژن', 'آپدیت', 'تغییرات', 'version', 'update', 'changes', 'release'],
  
  // Statistics and data
  stats: ['آمار', 'تعداد', 'درصد', 'نرخ', 'statistics', 'count', 'percentage', 'rate', 'data'],
  
  // Who/What/When questions
  questions: ['کی', 'چه کسی', 'کجا', 'چرا', 'چگونه', 'who', 'what', 'when', 'where', 'why', 'how'],
  
  // Specific domains
  domains: ['پتنت', 'اختراع', 'ثبت', 'patent', 'invention', 'registration', 'trademark']
};

// Keywords that indicate internal knowledge is sufficient
const INTERNAL_KNOWLEDGE_INDICATORS = {
  // General questions
  general: ['چیست', 'تعریف', 'معنی', 'what is', 'definition', 'meaning', 'explain'],
  
  // How-to questions
  howto: ['چگونه', 'راهنمایی', 'مراحل', 'how to', 'guide', 'steps', 'tutorial'],
  
  // Conceptual questions
  concept: ['مفهوم', 'اصول', 'concept', 'principles', 'theory', 'basics']
};

/**
 * Classify if a query needs web search
 * @param {string} query - User query
 * @param {string} language - Query language ('fa' or 'en')
 * @returns {string} - 'SEARCH' or 'NO_SEARCH'
 */
export function shouldSearch(query, language = 'fa') {
  if (!query || typeof query !== 'string') {
    return 'NO_SEARCH';
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for web search indicators
  for (const [category, keywords] of Object.entries(WEB_SEARCH_INDICATORS)) {
    for (const keyword of keywords) {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        return 'SEARCH';
      }
    }
  }

  // Check for specific patterns
  const searchPatterns = [
    // Time-based patterns
    /\d{4}/, // Years
    /\d{1,2}\/\d{1,2}\/\d{4}/, // Dates
    /(january|february|march|april|may|june|july|august|september|october|november|december)/i,
    /(ژانویه|فوریه|مارس|آوریل|مه|ژوئن|ژوئیه|اوت|سپتامبر|اکتبر|نوامبر|دسامبر)/i,
    
    // Version numbers
    /v?\d+\.\d+/i, // Version numbers like v1.2, 2.0
    
    // Specific entities
    /patent\s+no\.?\s*\d+/i,
    /پتنت\s*شماره\s*\d+/i,
    
    // Price patterns
    /\$\d+/,
    /€\d+/,
    /£\d+/,
    /ریال\s*\d+/i,
    /تومان\s*\d+/i
  ];

  for (const pattern of searchPatterns) {
    if (pattern.test(normalizedQuery)) {
      return 'SEARCH';
    }
  }

  // Check for internal knowledge indicators
  for (const [category, keywords] of Object.entries(INTERNAL_KNOWLEDGE_INDICATORS)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    
    // If multiple internal knowledge indicators, likely no search needed
    if (matchCount >= 2) {
      return 'NO_SEARCH';
    }
  }

  // Default to search for ambiguous cases
  return 'SEARCH';
}

/**
 * Get search confidence score (0-1)
 * @param {string} query - User query
 * @param {string} language - Query language
 * @returns {number} - Confidence score
 */
export function getSearchConfidence(query, language = 'fa') {
  if (!query || typeof query !== 'string') {
    return 0;
  }

  const normalizedQuery = query.toLowerCase().trim();
  let score = 0;
  let totalChecks = 0;

  // Check web search indicators
  for (const [category, keywords] of Object.entries(WEB_SEARCH_INDICATORS)) {
    for (const keyword of keywords) {
      totalChecks++;
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
  }

  // Check internal knowledge indicators (negative score)
  for (const [category, keywords] of Object.entries(INTERNAL_KNOWLEDGE_INDICATORS)) {
    for (const keyword of keywords) {
      totalChecks++;
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        score -= 0.5;
      }
    }
  }

  // Normalize score
  const normalizedScore = Math.max(0, Math.min(1, (score / totalChecks) + 0.5));
  return normalizedScore;
}

/**
 * Extract search terms from query
 * @param {string} query - User query
 * @param {string} language - Query language
 * @returns {string[]} - Array of search terms
 */
export function extractSearchTerms(query, language = 'fa') {
  if (!query || typeof query !== 'string') {
    return [];
  }

  // Remove common stop words
  const stopWords = language === 'fa' 
    ? ['چیست', 'چی', 'کدام', 'کجا', 'چرا', 'چگونه', 'که', 'از', 'در', 'به', 'با', 'برای']
    : ['what', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];

  const words = query.toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ') // Keep Persian and English letters
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));

  return [...new Set(words)]; // Remove duplicates
}

export default {
  shouldSearch,
  getSearchConfidence,
  extractSearchTerms
};

