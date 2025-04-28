
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  'https://znymtaxntdenjoehoinu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueW10YXhudGRlbmpvZWhvaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjIzMzYsImV4cCI6MjA2MTIzODMzNn0.sENLE0QL9jMerYetaxOB5Iyh1xGzSQuVnIXF4LfMt7c'
);

// Optional: Helper function to check if the connection is working
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('bookings').select('count').limit(1);
    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to connect to Supabase:", err);
    return false;
  }
};
