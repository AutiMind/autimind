/**
 * Lead Creation API Endpoint for AutiMind
 * Creates leads in Breakcold CRM via server-side API
 */

interface Env {
  BREAKCOLD_API_KEY?: string;
  BREAKCOLD_SECRET_STORE_ID?: string;
}

interface CreateLeadRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  title?: string;
  source?: string;
  tags?: string[];
  customAttributes?: Record<string, any>;
  notes?: string;
  context?: string;
  leadScore?: number;
  conversationHistory?: string[];
}

// Retrieve API key from environment
const getBreakcoldApiKey = async (env: Env): Promise<string> => {
  if (env.BREAKCOLD_API_KEY) {
    return env.BREAKCOLD_API_KEY;
  }
  
  // In future, implement secret store retrieval
  const secretStoreId = env.BREAKCOLD_SECRET_STORE_ID || '383e46b47c2749a1804ba0c434b80b47';
  console.log(`API key not in environment, would retrieve from secret store: ${secretStoreId}`);
  
  throw new Error('Breakcold API key not available');
};

// Create lead in Breakcold via API
const createBreakcoldLead = async (leadData: CreateLeadRequest, apiKey: string) => {
  const breakcoldEndpoint = 'https://api.breakcold.com/v3/leads';
  
  const payload = {
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    email: leadData.email,
    phone: leadData.phone,
    company: leadData.company,
    website: leadData.website,
    title: leadData.title,
    source: leadData.source || 'AutiMind Website API',
    tags: leadData.tags || ['AutiMind Lead'],
    customAttributes: {
      ...leadData.customAttributes,
      leadScore: leadData.leadScore,
      capturedAt: new Date().toISOString(),
      conversationContext: leadData.conversationHistory?.join('\n'),
      source: 'AutiMind AI Chatbot'
    },
    notes: leadData.notes || `Lead captured via AutiMind website API. Context: ${leadData.context || 'unknown'}`
  };

  const response = await fetch(breakcoldEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Breakcold API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    // Get API key
    let apiKey: string;
    try {
      apiKey = await getBreakcoldApiKey(env);
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Breakcold API key not available',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    let leadData: CreateLeadRequest;
    
    try {
      leadData = await request.json();
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON payload'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields
    if (!leadData.email) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Email is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Creating AutiMind lead:', {
      email: leadData.email,
      company: leadData.company,
      source: leadData.source,
      leadScore: leadData.leadScore
    });

    // Create lead in Breakcold
    const breakcoldResult = await createBreakcoldLead(leadData, apiKey);
    console.log('AutiMind lead created successfully:', breakcoldResult.id);

    return new Response(JSON.stringify({
      success: true,
      data: breakcoldResult,
      message: 'AutiMind lead created successfully'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AutiMind lead creation error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create AutiMind lead',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Handle OPTIONS requests for CORS
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};