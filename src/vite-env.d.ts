/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_BUCKET: string
  readonly VITE_SUPABASE_PROOFS_BUCKET?: string
  readonly VITE_SUPABASE_AWARDS_BUCKET?: string
  readonly VITE_USE_BASE44?: string
  readonly VITE_CONTRACT_ADDRESS?: string
  readonly VITE_PAYMENT_ADDRESS?: string
  readonly VITE_NETWORK?: string
  readonly VITE_CHAIN_ID?: string
  readonly VITE_RPC_URL?: string
  readonly VITE_WC_PROJECT_ID?: string
  readonly VITE_TAVILY_API_KEY?: string
  readonly VITE_JINA_API_KEY?: string
  readonly VITE_OPENAI_API_KEY?: string
  readonly VITE_REG_FEE_ETH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

