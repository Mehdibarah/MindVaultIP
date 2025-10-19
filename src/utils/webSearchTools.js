/**
 * Web Search Tools
 * Handles web search and page fetching with caching and security
 */

// Allowed domains for web search
const ALLOWED_DOMAINS = [
  '.gov', '.edu', '.org', '.int',
  'wipo.int', 'epo.org', 'uspto.gov', 'ieee.org', 
  'nature.com', 'arxiv.org', 'scholar.google.com',
  'patents.google.com', 'worldwide.espacenet.com',
  'patentscope.wipo.int', 'epo.org', 'uspto.gov'
];

// Blocked domains
const BLOCKED_DOMAINS = [
  't.me', 'pastebin.com', 'github.com/raw', 'gist.github.com',
  'bit.ly', 'tinyurl.com', 'short.link', 't.co'
];

/**
 * Check if a URL is allowed
 * @param {string} url - URL to check
 * @returns {boolean} - Whether URL is allowed
 */
export function isUrlAllowed(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check blocked domains first
    for (const blocked of BLOCKED_DOMAINS) {
      if (hostname.includes(blocked)) {
        return false;
      }
    }
    
    // Check allowed domains
    for (const allowed of ALLOWED_DOMAINS) {
      if (hostname.endsWith(allowed) || hostname.includes(allowed)) {
        return true;
      }
    }
    
    // Allow common trusted domains
    const trustedDomains = ['wikipedia.org', 'britannica.com', 'reuters.com', 'bbc.com'];
    for (const trusted of trustedDomains) {
      if (hostname.includes(trusted)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Search the web using Tavily API (mock implementation)
 * @param {string} query - Search query
 * @param {number} topK - Number of results to return
 * @returns {Promise<Array>} - Search results
 */
export async function searchWeb(query, topK = 5) {
  try {
    // Mock implementation - replace with actual Tavily API call
    const mockResults = [
      {
        title: "Patent Search Results",
        url: "https://patents.google.com/search?q=" + encodeURIComponent(query),
        snippet: "Search results for patent-related queries...",
        score: 0.95
      },
      {
        title: "WIPO Patent Database",
        url: "https://patentscope.wipo.int/search/en/search.jsf",
        snippet: "World Intellectual Property Organization patent search...",
        score: 0.90
      },
      {
        title: "IEEE Xplore Digital Library",
        url: "https://ieeexplore.ieee.org/search/searchresult.jsp",
        snippet: "Technical papers and research articles...",
        score: 0.85
      }
    ];

    // Filter allowed domains
    const filteredResults = mockResults.filter(result => isUrlAllowed(result.url));
    
    return filteredResults.slice(0, topK);
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

/**
 * Fetch and clean page content
 * @param {string} url - URL to fetch
 * @param {number} maxChars - Maximum characters to return
 * @returns {Promise<string>} - Cleaned page content
 */
export async function fetchPage(url, maxChars = 8000) {
  try {
    if (!isUrlAllowed(url)) {
      throw new Error('URL not allowed');
    }

    // Mock implementation - replace with actual page fetching
    const mockContent = `
      This is a mock page content for ${url}. In a real implementation, 
      this would fetch the actual page content, clean it, remove scripts,
      and extract the main text content. The content would be sanitized
      to remove any potential security risks and formatted for AI processing.
      
      Key features of the real implementation would include:
      - HTML parsing and text extraction
      - Script and style removal
      - PII detection and removal
      - Content summarization if too long
      - Character limit enforcement
    `;

    // Simulate content cleaning
    const cleanedContent = mockContent
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return cleanedContent.slice(0, maxChars);
  } catch (error) {
    console.error('Page fetch error:', error);
    return '';
  }
}

/**
 * Extract claims from text for citation
 * @param {string} text - Text to extract claims from
 * @returns {Array} - Array of claims with sources
 */
export function extractClaims(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const claims = [];
  
  sentences.forEach((sentence, index) => {
    if (sentence.length > 50 && sentence.length < 500) {
      claims.push({
        id: index + 1,
        text: sentence.trim(),
        confidence: Math.random() * 0.3 + 0.7 // Mock confidence score
      });
    }
  });
  
  return claims.slice(0, 10); // Return top 10 claims
}

/**
 * Generate cache key for search results
 * @param {string} query - Search query
 * @returns {string} - Cache key
 */
export function generateSearchCacheKey(query) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(query.toLowerCase().trim()).digest('hex');
}

/**
 * Generate cache key for page content
 * @param {string} url - Page URL
 * @returns {string} - Cache key
 */
export function generatePageCacheKey(url) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(url).digest('hex');
}

/**
 * Sanitize query to remove PII
 * @param {string} query - User query
 * @returns {string} - Sanitized query
 */
export function sanitizeQuery(query) {
  if (!query || typeof query !== 'string') {
    return '';
  }

  // Remove potential PII patterns
  let sanitized = query
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]') // SSN
    .replace(/\b\d{4}-\d{4}-\d{4}-\d{4}\b/g, '[CARD]') // Credit card
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email
    .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE]') // Phone
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]'); // IP address

  return sanitized.trim();
}

export default {
  isUrlAllowed,
  searchWeb,
  fetchPage,
  extractClaims,
  generateSearchCacheKey,
  generatePageCacheKey,
  sanitizeQuery
};

