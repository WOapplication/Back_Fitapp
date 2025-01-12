import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jplscnhnjzdccqozqqbd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwbHNjbmhuanpkY2Nxb3pxcWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MDE1NzUsImV4cCI6MjA1MjI3NzU3NX0.ITF-_nRDTELaby7UJBiLbXkbtDCArf8jPeD0wLZaU0c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
