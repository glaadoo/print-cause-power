import { supabase } from "@/integrations/supabase/client";

export interface PressmasterQuoteRequest {
  project: string;
  specs: string;
  quantity: number;
  donationId?: string;
}

export interface PressmasterQuoteResponse {
  mock: boolean;
  quote: {
    amount: number;
    currency: string;
  };
  turnaround: string;
  notes: string;
  quote_id?: string;
  status?: string;
  items?: any[];
  pricing?: any;
  estimated_delivery?: any;
  created_at?: string;
  valid_until?: string;
}

export async function requestPressmasterQuote(
  payload: PressmasterQuoteRequest
): Promise<PressmasterQuoteResponse> {
  const { data, error } = await supabase.functions.invoke('pressmaster-quote', {
    body: payload,
  });

  if (error) {
    throw new Error(`Pressmaster quote failed: ${error.message}`);
  }

  if (!data.success) {
    throw new Error(data.error || 'Pressmaster quote request failed');
  }

  return data.data;
}

export function isPressmasterLive(): boolean {
  // This will be determined by the backend response
  // The backend checks for PRESSMASTER_API_KEY
  return false; // Client can't know directly, will be shown in response
}

export async function getPressmasterRequests(limit = 5) {
  const { data, error } = await supabase
    .from('pressmaster_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching Pressmaster requests:', error);
    return [];
  }

  return data || [];
}
