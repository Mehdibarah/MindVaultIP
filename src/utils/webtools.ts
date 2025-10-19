/**
 * Web Search Tools
 * Tavily for search, Jina Reader for clean content
 */

// Allowed domains for web search
const ALLOWED_DOMAINS = [
  '.gov', '.edu', '.org', '.int',
  'wipo.int', 'epo.org', 'uspto.gov', 'ieee.org', 
  'nature.com', 'arxiv.org', 'scholar.google.com',
  'patents.google.com', 'worldwide.espacenet.com',
  'patentscope.wipo.int', 'bbc.com', 'reuters.com',
  'wikipedia.org', 'britannica.com'
];

// Blocked domains
const BLOCKED_DOMAINS = [
  't.me', 'pastebin.com', 'github.com/raw', 'gist.github.com',
  'bit.ly', 'tinyurl.com', 'short.link', 't.co'
];

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  score?: number;
}

export interface Source {
  id: number;
  title: string;
  url: string;
  content?: string;
}

/**
 * Check if a URL is allowed
 */
export function isUrlAllowed(url: string): boolean {
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
    
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Web search using Tavily API
 */
export async function webSearch(query: string, k = 5): Promise<SearchResult[]> {
  try {
    // Mock implementation - replace with actual Tavily API call
    const mockResults: SearchResult[] = [
      {
        title: "Search Results for: " + query,
        url: "https://example.com/search?q=" + encodeURIComponent(query),
        snippet: "This is a mock search result. In production, this would be replaced with actual Tavily API results.",
        score: 0.95
      },
      {
        title: "Wikipedia: " + query,
        url: "https://en.wikipedia.org/wiki/" + encodeURIComponent(query),
        snippet: "Wikipedia article about " + query + ". This would contain actual search results from Wikipedia.",
        score: 0.90
      },
      {
        title: "News: " + query,
        url: "https://news.example.com/" + encodeURIComponent(query),
        snippet: "Latest news and updates about " + query + ". This would contain recent news articles.",
        score: 0.85
      }
    ];

    // Filter allowed domains
    const filteredResults = mockResults.filter(result => isUrlAllowed(result.url));
    
    return filteredResults.slice(0, k);
  } catch (error) {
    console.error('Web search error:', error);
    return [];
  }
}

/**
 * Fetch and clean page content using Jina Reader
 */
export async function fetchClean(url: string, max = 8000): Promise<string> {
  try {
    if (!isUrlAllowed(url)) {
      throw new Error('URL not allowed');
    }

    // Mock implementation - replace with actual Jina Reader API call
    const mockContent = `
      This is mock content for ${url}. In production, this would fetch the actual page content using Jina Reader API.
      
      The content would be:
      - Cleaned of HTML tags and scripts
      - Extracted main text content
      - Sanitized for security
      - Truncated to ${max} characters
      
      Key features of the real implementation:
      - HTML parsing and text extraction
      - Script and style removal
      - PII detection and removal
      - Content summarization if too long
      - Character limit enforcement
      
      This mock content simulates what would be returned from a real web page.
    `;

    // Simulate content cleaning
    const cleanedContent = mockContent
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return cleanedContent.slice(0, max);
  } catch (error) {
    console.error('Page fetch error:', error);
    return '';
  }
}

/**
 * Pick diverse sources from search results
 */
export function pickDiverseSources(results: SearchResult[], maxSources = 3): SearchResult[] {
  const domainMap = new Map<string, SearchResult>();
  
  // Group by domain and pick best from each
  for (const result of results) {
    try {
      const hostname = new URL(result.url).hostname;
      if (!domainMap.has(hostname) || (result.score || 0) > (domainMap.get(hostname)?.score || 0)) {
        domainMap.set(hostname, result);
      }
    } catch (error) {
      // Skip invalid URLs
      continue;
    }
  }
  
  return Array.from(domainMap.values()).slice(0, maxSources);
}

/**
 * Generate cache key for search results
 */
export function generateCacheKey(query: string): string {
  // Simple hash function for demo - use crypto.createHash in production
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    const char = query.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Sanitize query to remove PII
 */
export function sanitizeQuery(query: string): string {
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
  webSearch,
  fetchClean,
  pickDiverseSources,
  generateCacheKey,
  sanitizeQuery
};
