import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock quote data structure
const getMockQuote = (requestData: any) => {
  return {
    quote_id: `MOCK-${Date.now()}`,
    status: "pending",
    items: requestData.items || [],
    pricing: {
      subtotal: 299.99,
      shipping: 15.00,
      tax: 31.50,
      total: 346.49,
      currency: "USD"
    },
    estimated_delivery: {
      min_days: 3,
      max_days: 5
    },
    created_at: new Date().toISOString(),
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const apiKey = Deno.env.get('PRESSMASTER_API_KEY');

    // If no API key is present, return mock data
    if (!apiKey) {
      console.log('No PRESSMASTER_API_KEY found, returning mock quote data');
      const mockQuote = getMockQuote(requestData);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: mockQuote,
          mock: true,
          message: "Using mock data. Add PRESSMASTER_API_KEY to use real API."
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Call real Pressmaster API
    console.log('PRESSMASTER_API_KEY found, calling real API');
    const response = await fetch('https://api.pressmaster.com/v1/quotes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pressmaster API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Pressmaster API request failed',
          details: errorText
        }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        }
      );
    }

    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        mock: false
      }), 
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
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
