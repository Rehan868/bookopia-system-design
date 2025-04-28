
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
export const supabase = createClient(
  'https://znymtaxntdenjoehoinu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpueW10YXhudGRlbmpvZWhvaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjIzMzYsImV4cCI6MjA2MTIzODMzNn0.sENLE0QL9jMerYetaxOB5Iyh1xGzSQuVnIXF4LfMt7c'
);
