import { supabase } from "@/lib/supabaseClient";

export interface Profile {
  wallet_address: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export async function upsertProfile(wallet: string, name?: string, avatar?: string): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").upsert({
    wallet_address: wallet,
    display_name: name ?? wallet,
    avatar_url: avatar ?? `https://api.dicebear.com/6.x/identicon/svg?seed=${wallet}`
  }).select().single();
  
  if (error) throw error;
  return data;
}

export async function getProfile(wallet: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("wallet_address", wallet)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found
      return null;
    }
    throw error;
  }
  
  return data;
}

export async function updateProfile(wallet: string, updates: Partial<Pick<Profile, 'display_name' | 'avatar_url'>>): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("wallet_address", wallet)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function ensureProfile(wallet: string): Promise<Profile> {
  try {
    // First try to get existing profile
    const existingProfile = await getProfile(wallet);
    if (existingProfile) {
      // Profile exists, return it
      return existingProfile;
    }
    
    // Profile doesn't exist, create it with default values
    const newProfile = await upsertProfile(wallet);
    console.log('✅ Profile auto-created for wallet:', wallet);
    return newProfile;
  } catch (error) {
    console.error('❌ Error ensuring profile for wallet:', wallet, error);
    throw error;
  }
}
