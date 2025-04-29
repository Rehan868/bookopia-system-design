
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Creating demo users...");
    
    // Create a Supabase client with the Admin key (service role)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    // Define demo users
    const demoUsers = [
      { email: 'admin@example.com', password: 'password', role: 'admin', name: 'Admin User' },
      { email: 'manager@example.com', password: 'password', role: 'manager', name: 'Manager User' },
      { email: 'staff@example.com', password: 'password', role: 'staff', name: 'Staff User' },
      { email: 'owner@example.com', password: 'password', role: 'owner', name: 'Property Owner' },
    ];

    const results = [];

    // Create each demo user
    for (const user of demoUsers) {
      try {
        console.log(`Processing user: ${user.email}`);
        
        // Check if user already exists in auth
        const { data: existingAuthUsers, error: authLookupError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (authLookupError) {
          console.error(`Error checking if user exists: ${authLookupError.message}`);
          results.push({ 
            email: user.email, 
            status: 'error',
            message: `Failed to check if user exists: ${authLookupError.message}` 
          });
          continue;
        }
        
        const authUserExists = existingAuthUsers.users.some(u => u.email === user.email);
        
        if (authUserExists) {
          console.log(`User ${user.email} already exists in auth`);
          results.push({ email: user.email, status: 'already exists' });
          continue;
        }
        
        // Create the user in auth schema
        console.log(`Creating auth user: ${user.email}`);
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            role: user.role,
            name: user.name,
          }
        });

        if (authError) {
          console.error(`Error creating auth user: ${authError.message}`);
          results.push({ email: user.email, status: 'error', message: authError.message });
          continue;
        }

        // Since we have a trigger that creates a profile, we don't need to explicitly create it
        results.push({ email: user.email, status: 'created' });
        console.log(`Successfully created user: ${user.email}`);
      } catch (userError) {
        console.error(`Unexpected error processing user ${user.email}:`, userError);
        results.push({ 
          email: user.email, 
          status: 'error', 
          message: userError instanceof Error ? userError.message : 'Unknown error'
        });
      }
    }

    console.log("Demo users creation completed");
    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Global error in create-demo-users function:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
