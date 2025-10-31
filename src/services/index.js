/**
 * Service exports - unified interface for auth and proof operations
 */

import { getAuthClient } from './AuthClient.js';
import { getProofClient } from './ProofClient.js';

// Re-export functions and classes (not interfaces/types)
export { getAuthClient, Base44AuthClient, SupabaseAuthClient } from './AuthClient.js';
export { getProofClient, Base44ProofClient, SupabaseProofClient } from './ProofClient.js';

// Export singleton instances for convenience (async)
export async function authClient() {
  return await getAuthClient();
}

export async function proofClient() {
  return await getProofClient();
}
