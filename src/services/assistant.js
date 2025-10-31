/**
 * AI Assistant API Endpoint
 * Handles chat messages with optional web research
 */

import { shouldSearch, extractSearchTerms } from '@/utils/webSearchClassifier';
import { searchWeb, fetchPage, sanitizeQuery, generateSearchCacheKey, generatePageCacheKey } from '@/utils/webSearchTools';

// Mock Redis cache (replace with actual Redis in production)
const cache = new Map();

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {any} - Cached data or null
 */
function getCache(key) {
  const item = cache.get(key);
  if (item && Date.now() < item.expiry) {
    return item.data;
  }
  cache.delete(key);
  return null;
}

/**
 * Set cache data
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds
 */
function setCache(key, data, ttl = 3600) {
  cache.set(key, {
    data,
    expiry: Date.now() + (ttl * 1000)
  });
}

/**
 * Generate AI response with web research
 * @param {string} query - User query
 * @param {Array} sources - Web sources
 * @param {string} language - Response language
 * @returns {string} - AI response
 */
function generateResponseWithSources(query, sources, language = 'fa') {
  const sourceText = sources.map((source, index) => 
    `[${index + 1}] ${source.title}\n${source.content.slice(0, 1000)}...`
  ).join('\n\n');

  if (language === 'fa') {
    return `بر اساس منابع زیر، پاسخ شما:

${sourceText}

پاسخ: بر اساس اطلاعات موجود در منابع بالا، می‌توانم به سوال شما پاسخ دهم. لطفاً سوال مشخص‌تری بپرسید تا بتوانم پاسخ دقیق‌تری ارائه دهم.

منابع:
${sources.map((source, index) => `[${index + 1}] ${source.title} - ${source.url}`).join('\n')}`;
  } else {
    return `Based on the following sources:

${sourceText}

Answer: Based on the information available in the sources above, I can answer your question. Please ask a more specific question for a more detailed response.

Sources:
${sources.map((source, index) => `[${index + 1}] ${source.title} - ${source.url}`).join('\n')}`;
  }
}

/**
 * Generate AI response without web research
 * @param {string} query - User query
 * @param {string} language - Response language
 * @returns {string} - AI response
 */
function generateResponseWithoutSources(query, language = 'fa') {
  if (language === 'fa') {
    return `سلام! من دستیار هوش مصنوعی شما هستم. بر اساس دانش داخلی خود، می‌توانم به سوال شما پاسخ دهم.

سوال شما: ${query}

پاسخ: این یک پاسخ نمونه است که بر اساس دانش داخلی تولید شده است. در یک پیاده‌سازی واقعی، اینجا پاسخ دقیق و مفصل به سوال شما قرار می‌گیرد.

اگر نیاز به اطلاعات به‌روز دارید، لطفاً جستجوی وب را فعال کنید.`;
  } else {
    return `Hello! I'm your AI assistant. Based on my internal knowledge, I can answer your question.

Your question: ${query}

Answer: This is a sample response generated based on internal knowledge. In a real implementation, a detailed and accurate answer to your question would be provided here.

If you need up-to-date information, please enable web search.`;
  }
}

/**
 * Main assistant handler
 * @param {Request} request - HTTP request
 * @returns {Response} - Streaming response
 */
export async function POST(request) {
  try {
    const { message, language = 'fa', webResearchEnabled = true, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sanitize query
    const sanitizedQuery = sanitizeQuery(message);
    
    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let usedWeb = false;
          let sources = [];

          // Check if web search is needed
          if (webResearchEnabled && shouldSearch(sanitizedQuery, language) === 'SEARCH') {
            usedWeb = true;
            
            // Send metadata first
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'metadata',
              usedWeb: true,
              sources: []
            })}\n\n`));

            // Search the web
            const searchResults = await searchWeb(sanitizedQuery, 6);
            
            if (searchResults.length > 0) {
              // Pick top 3 diverse sources
              const selectedSources = searchResults.slice(0, 3);
              
              // Fetch page content for selected sources
              const sourcesWithContent = await Promise.all(
                selectedSources.map(async (source) => {
                  const pageContent = await fetchPage(source.url, 4000);
                  return {
                    ...source,
                    content: pageContent
                  };
                })
              );

              sources = sourcesWithContent.filter(source => source.content.length > 100);
              
              // Update metadata with sources
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                type: 'metadata',
                usedWeb: true,
                sources: sources.map(s => ({ title: s.title, url: s.url }))
              })}\n\n`));

              // Generate response with sources
              const response = generateResponseWithSources(sanitizedQuery, sources, language);
              
              // Stream response content
              const words = response.split(' ');
              for (let i = 0; i < words.length; i++) {
                const word = words[i] + (i < words.length - 1 ? ' ' : '');
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: 'content',
                  content: word
                })}\n\n`));
                
                // Add small delay for streaming effect
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            } else {
              // No sources found, fall back to internal knowledge
              const response = generateResponseWithoutSources(sanitizedQuery, language);
              const words = response.split(' ');
              for (let i = 0; i < words.length; i++) {
                const word = words[i] + (i < words.length - 1 ? ' ' : '');
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                  type: 'content',
                  content: word
                })}\n\n`));
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            }
          } else {
            // Use internal knowledge
            const response = generateResponseWithoutSources(sanitizedQuery, language);
            const words = response.split(' ');
            for (let i = 0; i < words.length; i++) {
              const word = words[i] + (i < words.length - 1 ? ' ' : '');
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                type: 'content',
                content: word
              })}\n\n`));
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }

          // Send final metadata
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'metadata',
            usedWeb,
            sources: sources.map(s => ({ title: s.title, url: s.url }))
          })}\n\n`));

          controller.close();
        } catch (error) {
          console.error('Assistant error:', error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            error: 'An error occurred while processing your request'
          })}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

