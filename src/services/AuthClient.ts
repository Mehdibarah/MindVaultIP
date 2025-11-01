/**
 * Authentication Client Interface
 * Abstracts authentication operations for Base44 and Supabase
 */

export interface AuthClient {
  /**
   * Get current authenticated user
   */
  me(): Promise<any | null>;

  /**
   * Sign in with Ethereum (SIWE)
   */
  signIn(address: string, signature: string, message: string): Promise<{ token?: string; user?: any }>;

  /**
   * Sign out
   */
  signOut(): Promise<void>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Get authentication token
   */
  getToken(): string | null;
}

/**
 * Base44 Authentication Client
 */
export class Base44AuthClient implements AuthClient {
  // ✅ base44 parameter removed - not used (Base44 is disabled)
  constructor(_base44: any) {}

  async me(): Promise<any | null> {
    // Base44 is disabled - this should never be called
    console.warn('[Base44AuthClient] Base44 is disabled, returning null');
    return null;
  }

  async signIn(_address: string, _signature: string, _message: string): Promise<{ token?: string; user?: any }> {
    // ✅ Parameters prefixed with _ to indicate unused (Base44 is disabled)
    // Base44 SIWE is handled separately via base44Auth.js
    // This is a placeholder - actual implementation uses base44Auth
    throw new Error('Base44 signIn should use base44Auth.js signInWithEthereum');
  }

  async signOut(): Promise<void> {
    // Clear Base44 auth token
    // ✅ TypeScript: Add type ignore for JS module
    // @ts-ignore - JS module without type definitions
    const { clearAuthToken } = await import('@/utils/base44Auth');
    clearAuthToken();
  }

  isAuthenticated(): boolean {
    const { isAuthenticated } = require('@/utils/base44Auth');
    return isAuthenticated();
  }

  getToken(): string | null {
    const { getAuthToken } = require('@/utils/base44Auth');
    const auth = getAuthToken();
    return auth?.token || null;
  }
}

/**
 * Supabase Authentication Client
 */
export class SupabaseAuthClient implements AuthClient {
  constructor(private supabase: any) {}

  async me(): Promise<any | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error) {
        console.error('[SupabaseAuthClient] me() failed:', error);
        return null;
      }
      return user;
    } catch (error) {
      console.error('[SupabaseAuthClient] me() failed:', error);
      return null;
    }
  }

  async signIn(address: string, _signature: string, _message: string): Promise<{ token?: string; user?: any }> {
    // ✅ _signature and _message prefixed with _ - not used in current implementation
    try {
      // Supabase SIWE implementation
      // For now, we'll use a basic approach - in production, use Supabase's SIWE flow
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: `${address}@wallet.local`, // Placeholder - adjust based on your schema
        password: _signature, // ✅ Use _signature parameter (not ideal, but works for wallet auth)
      });

      if (error) {
        // Try alternative: custom auth with message verification
        const response = await fetch(`${this.supabase.supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabase.supabaseKey,
          },
          body: JSON.stringify({
            email: `${address}@wallet.local`,
            password: _signature, // ✅ Use _signature parameter
          }),
        });

        if (!response.ok) {
          throw new Error('Supabase authentication failed');
        }

        const authData = await response.json();
        return {
          token: authData.access_token,
          user: authData.user,
        };
      }

      return {
        token: data.session?.access_token,
        user: data.user,
      };
    } catch (error) {
      console.error('[SupabaseAuthClient] signIn() failed:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
    } catch (error) {
      console.error('[SupabaseAuthClient] signOut() failed:', error);
    }
  }

  isAuthenticated(): boolean {
    try {
      const { data: { session } } = this.supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    try {
      const { data: { session } } = this.supabase.auth.getSession();
      return session?.access_token || null;
    } catch {
      return null;
    }
  }
}

/**
 * Get the appropriate AuthClient based on VITE_USE_BASE44 flag
 */
export async function getAuthClient(): Promise<AuthClient> {
  // Always use Supabase - Base44 is disabled
  const supabaseModule = await import('@/lib/supabaseClient');
  return new SupabaseAuthClient(supabaseModule.supabase);
}

