/**
 * Breakcold CRM API Client for AutiMind
 * Handles lead management, contact creation, and CRM integration
 */

// Breakcold API Error types
export class BreakcoldApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response,
    public data?: any
  ) {
    super(message);
    this.name = 'BreakcoldApiError';
  }
}

// Breakcold types
export interface BreakcoldLead {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  title?: string;
  source?: string;
  status?: string;
  tags?: string[];
  customAttributes?: Record<string, any>;
  notes?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BreakcoldLeadResponse {
  success: boolean;
  data?: BreakcoldLead;
  error?: string;
  message?: string;
}

export interface CreateLeadRequest {
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
  assignedTo?: string;
}

class BreakcoldAPI {
  private baseUrl = 'https://api.breakcold.com/v3';
  private apiKey: string;

  constructor(apiKey?: string) {
    // Try multiple sources for API key
    this.apiKey = apiKey || 
                  (typeof process !== 'undefined' ? process.env?.BREAKCOLD_API_KEY : '') || 
                  '';
    
    if (!this.apiKey) {
      console.warn('Breakcold API key not configured - some operations may fail');
    }
  }

  // Method to update API key at runtime
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    console.log('Breakcold API key updated');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const { method = 'GET', body, headers = {} } = options;

    if (!this.apiKey) {
      throw new BreakcoldApiError('Breakcold API key not configured');
    }

    const requestHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...headers
    };

    try {
      console.debug(`Making ${method} request to ${url}`);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error(`Breakcold API error: ${response.status} ${response.statusText}`, responseData);
        throw new BreakcoldApiError(
          responseData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response,
          responseData
        );
      }

      console.debug(`Request successful:`, responseData);
      return responseData;
    } catch (error) {
      if (error instanceof BreakcoldApiError) {
        throw error;
      }
      console.error('Network error making request to Breakcold API:', error);
      throw new BreakcoldApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        undefined,
        error
      );
    }
  }

  /**
   * Create a new lead in Breakcold CRM
   */
  async createLead(leadData: CreateLeadRequest): Promise<BreakcoldLeadResponse> {
    try {
      console.info('Creating new lead:', { email: leadData.email, company: leadData.company });

      // Add default source if not provided
      const enrichedLeadData = {
        source: 'AutiMind Website Chatbot',
        ...leadData,
      };

      const response = await this.makeRequest<BreakcoldLead>('/leads', {
        method: 'POST',
        body: enrichedLeadData,
      });

      return {
        success: true,
        data: response,
        message: 'Lead created successfully'
      };
    } catch (error) {
      console.error('Failed to create lead:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to create lead'
      };
    }
  }

  /**
   * Create or update lead (upsert functionality)
   */
  async upsertLead(leadData: CreateLeadRequest): Promise<BreakcoldLeadResponse> {
    try {
      // For now, just create new leads
      // In production, you'd implement find by email first
      console.info('Creating new lead via upsert:', leadData.email);
      return await this.createLead(leadData);
    } catch (error) {
      console.error('Failed to upsert lead:', error);
      return {
        success: false,
        error: error instanceof BreakcoldApiError ? error.message : 'Failed to upsert lead'
      };
    }
  }
}

// Export singleton instance
export const breakcoldAPI = new BreakcoldAPI();
export default breakcoldAPI;