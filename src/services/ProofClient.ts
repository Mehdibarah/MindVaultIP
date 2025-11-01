/**
 * Proof Client Interface
 * Abstracts proof operations for Base44 and Supabase
 */

export interface Proof {
  id?: string | number;
  title: string;
  category?: string;
  description?: string;
  file_hash: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  ipfs_hash?: string;
  is_public?: boolean;
  payment_hash?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface ProofClient {
  /**
   * Create a new proof
   */
  create(data: Partial<Proof>): Promise<Proof>;

  /**
   * Get a proof by ID
   */
  get(id: string | number): Promise<Proof | null>;

  /**
   * Update a proof
   */
  update(id: string | number, data: Partial<Proof>): Promise<Proof>;

  /**
   * Filter/search proofs
   */
  filter(query: any): Promise<Proof[]>;
}

/**
 * Base44 Proof Client
 */
export class Base44ProofClient implements ProofClient {
  // ✅ base44 parameter removed - not used (Base44 is disabled)
  constructor(_base44: any) {}

  async create(_data: Partial<Proof>): Promise<Proof> {
    // ✅ _data prefixed with _ - not used (Base44 is disabled)
    // Base44 is disabled - this should never be called
    throw new Error('Base44 is disabled. Use SupabaseProofClient instead.');
  }

  async get(_id: string | number): Promise<Proof | null> {
    // ✅ _id prefixed with _ - not used (Base44 is disabled)
    // Base44 is disabled - this should never be called
    console.warn('[Base44ProofClient] Base44 is disabled, returning null');
    return null;
  }

  async update(_id: string | number, _data: Partial<Proof>): Promise<Proof> {
    // Base44 is disabled - this should never be called
    throw new Error('Base44 is disabled. Use SupabaseProofClient instead.');
  }

  async filter(_query: any): Promise<Proof[]> {
    // ✅ _query prefixed with _ - not used (Base44 is disabled)
    // Base44 is disabled - this should never be called
    console.warn('[Base44ProofClient] Base44 is disabled, returning empty array');
    return [];
  }
}

/**
 * Supabase Proof Client
 */
export class SupabaseProofClient implements ProofClient {
  constructor(private supabase: any) {}

  async create(data: Partial<Proof>): Promise<Proof> {
    // Build insert data object, including id if provided
    const insertData: any = {
      title: data.title,
      category: data.category,
      description: data.description,
      file_hash: data.file_hash,
      file_name: data.file_name,
      file_size: data.file_size,
      file_type: data.file_type,
      ipfs_hash: data.ipfs_hash,
      is_public: data.is_public ?? true,
      payment_hash: data.payment_hash,
      created_by: data.created_by,
    };
    
    // Include id if provided (for idempotency)
    if (data.id) {
      insertData.id = data.id;
    }
    
    // Include transaction_id if provided
    if (data.transaction_id) {
      insertData.transaction_id = data.transaction_id;
    }
    
    const { data: result, error } = await this.supabase
      .from('proofs')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('[SupabaseProofClient] create() error:', error);
      throw new Error(`Failed to create proof: ${error.message}`);
    }

    if (!result) {
      throw new Error('Failed to create proof: No data returned');
    }

    console.log('[SupabaseProofClient] ✅ Proof created successfully:', result.id);
    return result;
  }

  async get(id: string | number): Promise<Proof | null> {
    const { data, error } = await this.supabase
      .from('proofs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[SupabaseProofClient] get() failed:', error);
      return null;
    }

    return data;
  }

  async update(id: string | number, data: Partial<Proof>): Promise<Proof> {
    const { data: result, error } = await this.supabase
      .from('proofs')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update proof: ${error.message}`);
    }

    return result;
  }

  async filter(query: any): Promise<Proof[]> {
    let queryBuilder = this.supabase
      .from('proofs')
      .select('*');

    // Handle simple filter queries
    if (query.id) {
      if (Array.isArray(query.id) || query.id.$in) {
        const ids = Array.isArray(query.id) ? query.id : query.id.$in;
        queryBuilder = queryBuilder.in('id', ids);
      } else {
        queryBuilder = queryBuilder.eq('id', query.id);
      }
    }

    if (query.is_public !== undefined) {
      queryBuilder = queryBuilder.eq('is_public', query.is_public);
    }

    if (query.created_by) {
      queryBuilder = queryBuilder.eq('created_by', query.created_by);
    }

    // Handle category filter
    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }

    // Handle file_hash filter
    if (query.file_hash) {
      queryBuilder = queryBuilder.eq('file_hash', query.file_hash);
    }

    // Default: order by created_at descending
    queryBuilder = queryBuilder.order('created_at', { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('[SupabaseProofClient] filter() failed:', error);
      return [];
    }

    return data || [];
  }
}

/**
 * Get the appropriate ProofClient based on VITE_USE_BASE44 flag
 */
export async function getProofClient(): Promise<ProofClient> {
  // Always use Supabase - Base44 is disabled
  const supabaseModule = await import('@/lib/supabaseClient');
  return new SupabaseProofClient(supabaseModule.supabase);
}

