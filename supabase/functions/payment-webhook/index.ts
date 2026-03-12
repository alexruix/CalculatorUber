import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Environment variables provided by Supabase Edge Functions
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// We use the Service Role key to bypass RLS and update user profiles directly
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    // MercadoPago sends a POST request with query params for the webhook
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || url.searchParams.get("topic");
    const id = url.searchParams.get("data.id") || url.searchParams.get("id");

    console.log(`Received Webhook: type=${type}, id=${id}`);

    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    if (type === 'payment') {
      // In a real scenario, you'd fetch the payment details from MP API using the ID
      // to verify the status (approved) and extract the external_reference (our user_id).
      // For this MVP/Sprint, we'll parse the body assuming the `external_reference` is passed.
      
      const body = await req.json();
      console.log('Webhook body:', body);

      // MercadoPago usually sends the user's ID in 'external_reference' when creating the preference
      // In subscriptions (preapproval), it might be inside 'payer' or a custom field.
      // Assuming a standard checkout where external_reference = user.id
      const userId = body.data?.external_reference || body.external_reference;

      // Simplification: We assume any 'payment' or 'subscription' webhook reaching here is successful for this phase
      // A production ready app MUST verify the signature and the status === 'approved'

      if (userId) {
        console.log(`Attempting to upgrade user: ${userId}`);
        const { error } = await supabase
          .from('profiles')
          .update({ subscription_tier: 'pro' })
          .eq('id', userId);

        if (error) {
           console.error('Error updating profile:', error);
           return new Response(`Error updating profile: ${error.message}`, { status: 500 });
        }
        
        console.log(`Successfully upgraded user ${userId} to PRO`);
        return new Response("Webhook processed & User Upgraded", { status: 200 });
      } else {
        console.log("No valid UserID (external_reference) found in payload.");
        // Still return 200 so MP stops retrying
        return new Response("Webhook received but no user to update", { status: 200 });
      }
    }

    return new Response("Webhook received (ignored type)", { status: 200 });

  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return new Response(`Error: ${error.message}`, { status: 400 });
  }
});
