
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the Auth admin API key
    const supabaseAdmin = createClient(
      // Supabase API URL - env var exported by default when deployed to Supabase
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase service_role key - env var exported by default when deployed to Supabase
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Demo users to create
    const demoUsers = [
      {
        email: "admin@example.com",
        password: "password",
        role: "admin",
        name: "Admin User",
        position: "Administrator"
      },
      {
        email: "manager@example.com",
        password: "password",
        role: "manager",
        name: "Manager User",
        position: "Hotel Manager"
      },
      {
        email: "staff@example.com",
        password: "password",
        role: "staff",
        name: "Front Desk Staff",
        position: "Front Desk"
      },
      {
        email: "owner@example.com",
        password: "password",
        role: "owner",
        name: "Property Owner",
        position: null
      }
    ];

    console.log("Starting to create demo users...");

    for (const user of demoUsers) {
      try {
        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({
          filter: {
            email: user.email
          }
        });

        if (existingUsers && existingUsers.users.length > 0) {
          console.log(`User ${user.email} already exists, skipping...`);
          continue;
        }

        // Create the user
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            name: user.name,
            role: user.role,
            position: user.position
          }
        });

        if (error) {
          console.error(`Error creating user ${user.email}:`, error);
        } else {
          console.log(`Created user: ${user.email} with role: ${user.role}`);
        }
      } catch (userError) {
        console.error(`Error processing user ${user.email}:`, userError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Demo users created successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating demo users:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
