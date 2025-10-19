/**
 * Rate Limiting for AI Mentor
 * Simple in-memory rate limiting (replace with Redis in production)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (replace with Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_PER_DAY = 30;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check if user has exceeded rate limit
 * @param userId - User identifier (IP address or user ID)
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry || now > entry.resetTime) {
    // No entry or window expired, create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    };
    rateLimitStore.set(userId, newEntry);
    
    return {
      allowed: true,
      remaining: RATE_LIMIT_PER_DAY - 1,
      resetTime: newEntry.resetTime
    };
  }

  if (entry.count >= RATE_LIMIT_PER_DAY) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(userId, entry);

  return {
    allowed: true,
    remaining: RATE_LIMIT_PER_DAY - entry.count,
    resetTime: entry.resetTime
  };
}

/**
 * Get user's current rate limit status
 * @param userId - User identifier
 * @returns Rate limit status without incrementing
 */
export function getRateLimitStatus(userId: string): { remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry || now > entry.resetTime) {
    return {
      remaining: RATE_LIMIT_PER_DAY,
      resetTime: now + RATE_LIMIT_WINDOW
    };
  }

  return {
    remaining: Math.max(0, RATE_LIMIT_PER_DAY - entry.count),
    resetTime: entry.resetTime
  };
}

/**
 * Reset rate limit for a user (admin function)
 * @param userId - User identifier
 */
export function resetRateLimit(userId: string): void {
  rateLimitStore.delete(userId);
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [userId, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(userId);
    }
  }
}

// Clean up expired entries every hour
setInterval(cleanupExpiredEntries, 60 * 60 * 1000);

export default {
  checkRateLimit,
  getRateLimitStatus,
  resetRateLimit,
  cleanupExpiredEntries
};
