// Import the function that lets us create a Supabase client
import { createClient } from '@supabase/supabase-js';

// Get your Supabase project URL from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Get your Supabase anon public API key from your .env.local file
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client using your URL and key
// This client lets you log users in, get data, and save info to the database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// lib/supabaseClient.ts

