import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const quoteRequestSchema = z.object({
  project: z.string()
    .trim()
    .min(1, 'Project name required')
    .max(200, 'Project name too long'),
  specs: z.string()
    .trim()
    .min(1, 'Specs required')
    .max(1000, 'Specs too long'),
  quantity: z.number()
    .int('Quantity must be an integer')
    .positive('Quantity must be positive')
    .max(10000, 'Quantity too large'),
  donationId: z.string().uuid().optional()
});

// Mock data generator
function getMockQuote(requestData: any) {
  return {
    mock: true,
    quote: {
      amount: Math.floor(Math.random() * 5000) + 1000,
      currency: "USD"
    },
    turnaround: "5-7 business days",
    notes: "This is a mock quote. Configure PRESSMASTER_API_KEY for live quotes.",
    story: "🎉 Your donation powers positive change! Every contribution creates ripples of impact in our community.",
    image_url: null
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request data
    const requestData = await req.json();
    
    // Validate input
    const validation = quoteRequestSchema.safeParse(requestData);
    
    if (!validation.success) {
      console.error('Validation error:', validation.error.errors);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid input', 
          details: validation.error.errors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { project, specs, quantity, donationId } = validation.data;

    console.log('Pressmaster quote request:', { project, specs, quantity, donationId, userId: user.id });

    // Check for API key
    const PRESSMASTER_API_KEY = Deno.env.get('PRESSMASTER_API_KEY');
    const mode = PRESSMASTER_API_KEY ? 'live' : 'stub';

    let responseData;
    let status = 'success';
    let errorMessage = null;

    if (mode === 'stub') {
      // Return mock data
      console.log('Pressmaster: Running in STUB mode (no API key)');
      responseData = getMockQuote(requestData);
    } else {
      // Call real Pressmaster API
      console.log('Pressmaster: Running in LIVE mode');
      try {
        const pressmasterResponse = await fetch('https://api.pressmaster.com/v1/quotes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PRESSMASTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project,
            specs,
            quantity,
          }),
        });

        if (!pressmasterResponse.ok) {
          const errorText = await pressmasterResponse.text();
          console.error('Pressmaster API error:', pressmasterResponse.status, errorText);
          throw new Error(`Pressmaster API error: ${pressmasterResponse.status}`);
        }

        const apiData = await pressmasterResponse.json();
        responseData = {
          mock: false,
          ...apiData
        };
        console.log('Pressmaster API response:', responseData);
      } catch (error) {
        console.error('Pressmaster API call failed:', error);
        status = 'failed';
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        responseData = {
          ...getMockQuote(requestData),
          error: errorMessage
        };
      }
    }

    // Log request to database
    const { error: logError } = await supabaseClient
      .from('pressmaster_requests')
      .insert({
        user_id: user.id,
        donation_id: donationId || null,
        type: 'quote',
        mode,
        status,
        request_body: requestData,
        response_body: responseData,
        error_message: errorMessage,
      });

    if (logError) {
      console.error('Failed to log Pressmaster request:', logError);
    }

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in pressmaster-quote function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
