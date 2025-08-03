import { useState, useCallback, useEffect } from 'react';
import { breakcoldAPI, CreateLeadRequest, BreakcoldLead } from '../lib/breakcold-api';

export interface LeadData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  title?: string;
  interest?: string;
  budget?: string;
  timeline?: string;
  message?: string;
}

export interface LeadTrackingState {
  leadData: LeadData;
  leadScore: number;
  isQualified: boolean;
  conversationHistory: string[];
  lastUpdated: Date | null;
}

export interface UseLeadTrackingOptions {
  enableTracking?: boolean;
  autoQualifyThreshold?: number;
  context?: string;
  userId?: string;
  userEmail?: string;
}

export interface UseLeadTrackingReturn {
  // State
  leadData: LeadData;
  leadScore: number;
  isQualified: boolean;
  conversationHistory: string[];
  
  // Actions
  updateLeadData: (data: Partial<LeadData>) => void;
  addToConversation: (message: string, isBot?: boolean) => void;
  calculateScore: (message: string) => number;
  qualifyLead: () => boolean;
  resetLead: () => void;
  
  // CRM Integration
  createLead: () => Promise<{ success: boolean; lead?: BreakcoldLead; error?: string }>;
  
  // Utilities
  getLeadSummary: () => string;
  isReadyForCapture: () => boolean;
}

export const useLeadTracking = (options: UseLeadTrackingOptions = {}): UseLeadTrackingReturn => {
  const {
    enableTracking = true,
    autoQualifyThreshold = 50,
    context = 'general',
    userId,
    userEmail
  } = options;

  const [leadData, setLeadData] = useState<LeadData>({});
  const [leadScore, setLeadScore] = useState(0);
  const [isQualified, setIsQualified] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Update lead data
  const updateLeadData = useCallback((data: Partial<LeadData>) => {
    if (!enableTracking) return;
    
    setLeadData(prev => {
      const updated = { ...prev, ...data };
      setLastUpdated(new Date());
      return updated;
    });
  }, [enableTracking]);

  // Add message to conversation history
  const addToConversation = useCallback((message: string, isBot = false) => {
    if (!enableTracking) return;
    
    const prefix = isBot ? 'Bot: ' : 'User: ';
    setConversationHistory(prev => [...prev, `${prefix}${message}`]);
  }, [enableTracking]);

  // Calculate lead score based on message content (AI Development specific)
  const calculateScore = useCallback((message: string): number => {
    if (!enableTracking) return 0;
    
    let score = 0;
    const lowerMessage = message.toLowerCase();
    
    // Interest indicators for AI Development
    const interestTerms = [
      { terms: ['price', 'cost', 'budget', 'pricing'], score: 15 },
      { terms: ['quote', 'estimate', 'proposal'], score: 20 },
      { terms: ['when can', 'timeline', 'how soon', 'schedule'], score: 15 },
      { terms: ['ai', 'artificial intelligence', 'machine learning'], score: 20 },
      { terms: ['neural network', 'deep learning', 'computer vision'], score: 25 },
      { terms: ['nlp', 'natural language processing', 'chatbot'], score: 20 },
      { terms: ['automation', 'intelligent systems', 'predictive analytics'], score: 18 },
      { terms: ['custom software', 'development', 'integration'], score: 15 },
      { terms: ['api', 'sdk', 'platform'], score: 12 },
      { terms: ['hardware', 'embedded', 'iot'], score: 15 },
      { terms: ['healthcare', 'medical', 'fintech', 'financial'], score: 15 },
      { terms: ['manufacturing', 'retail', 'logistics'], score: 15 },
      { terms: ['security', 'fraud detection', 'cybersecurity'], score: 18 },
      { terms: ['business', 'company', 'organization'], score: 10 },
      { terms: ['enterprise', 'startup', 'corporation'], score: 12 },
      { terms: ['need help', 'looking for', 'interested in'], score: 10 }
    ];

    interestTerms.forEach(({ terms, score: termScore }) => {
      if (terms.some(term => lowerMessage.includes(term))) {
        score += termScore;
      }
    });

    // Urgency indicators
    const urgencyTerms = [
      { terms: ['urgent', 'asap', 'immediately'], score: 25 },
      { terms: ['deadline', 'launch date', 'go live'], score: 20 },
      { terms: ['this week', 'this month', 'soon'], score: 15 }
    ];

    urgencyTerms.forEach(({ terms, score: termScore }) => {
      if (terms.some(term => lowerMessage.includes(term))) {
        score += termScore;
      }
    });

    // Engagement indicators
    if (message.length > 100) score += 5;
    if (conversationHistory.length > 5) score += 10;
    
    // Contact information provided
    if (lowerMessage.includes('@')) score += 20;
    if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(message)) score += 15;

    // AI development context questions
    if (lowerMessage.includes('what do you charge') || lowerMessage.includes('rates')) score += 20;
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('examples') || lowerMessage.includes('case studies')) score += 10;
    if (lowerMessage.includes('experience') || lowerMessage.includes('how long') || lowerMessage.includes('expertise')) score += 10;
    if (lowerMessage.includes('proof of concept') || lowerMessage.includes('poc') || lowerMessage.includes('pilot')) score += 15;

    const newScore = Math.min(score, 100);
    setLeadScore(prev => Math.max(prev, newScore));
    
    return newScore;
  }, [enableTracking, conversationHistory.length]);

  // Qualify lead based on score and data completeness
  const qualifyLead = useCallback((): boolean => {
    if (!enableTracking) return false;
    
    const hasEmail = !!leadData.email;
    const hasBasicInfo = !!(leadData.firstName || leadData.lastName || leadData.company);
    const meetsScoreThreshold = leadScore >= autoQualifyThreshold;
    
    const qualified = hasEmail && (hasBasicInfo || meetsScoreThreshold);
    setIsQualified(qualified);
    
    return qualified;
  }, [enableTracking, leadData, leadScore, autoQualifyThreshold]);

  // Reset lead data
  const resetLead = useCallback(() => {
    setLeadData({});
    setLeadScore(0);
    setIsQualified(false);
    setConversationHistory([]);
    setLastUpdated(null);
  }, []);

  // Create lead in CRM
  const createLead = useCallback(async () => {
    if (!enableTracking || !leadData.email) {
      return { success: false, error: 'Email required for lead creation' };
    }

    try {
      const leadRequest: CreateLeadRequest = {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        company: leadData.company,
        website: leadData.website,
        title: leadData.title,
        source: `AutiMind Website - ${context}`,
        tags: [
          'AutiMind Lead',
          context.charAt(0).toUpperCase() + context.slice(1),
          leadData.interest || 'General Inquiry'
        ].filter(Boolean),
        customAttributes: {
          leadScore,
          interest: leadData.interest,
          budget: leadData.budget,
          timeline: leadData.timeline,
          conversationContext: conversationHistory.slice(-10).join('\n'),
          capturedAt: new Date().toISOString(),
          userId,
          userEmail,
          source: 'AutiMind AI Chatbot'
        },
        notes: [
          `Lead captured via AutiMind AI chatbot.`,
          `Interest: ${leadData.interest || 'General'}`,
          `Lead score: ${leadScore}/100`,
          `Budget: ${leadData.budget || 'Not specified'}`,
          `Timeline: ${leadData.timeline || 'Not specified'}`,
          leadData.message ? `Message: ${leadData.message}` : '',
          `Conversation summary: ${conversationHistory.slice(-3).join(' | ')}`
        ].filter(Boolean).join(' ')
      };

      const result = await breakcoldAPI.createLead(leadRequest);
      
      if (result.success) {
        return { success: true, lead: result.data };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Failed to create lead:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [enableTracking, leadData, leadScore, context, conversationHistory, userId, userEmail]);

  // Get lead summary
  const getLeadSummary = useCallback((): string => {
    const parts = [];
    
    if (leadData.firstName || leadData.lastName) {
      parts.push(`Name: ${[leadData.firstName, leadData.lastName].filter(Boolean).join(' ')}`);
    }
    
    if (leadData.email) parts.push(`Email: ${leadData.email}`);
    if (leadData.phone) parts.push(`Phone: ${leadData.phone}`);
    if (leadData.company) parts.push(`Company: ${leadData.company}`);
    if (leadData.interest) parts.push(`Interest: ${leadData.interest}`);
    if (leadData.budget) parts.push(`Budget: ${leadData.budget}`);
    if (leadScore > 0) parts.push(`Score: ${leadScore}/100`);
    
    return parts.join(', ');
  }, [leadData, leadScore]);

  // Check if lead is ready for capture
  const isReadyForCapture = useCallback((): boolean => {
    return !!(leadData.email && (leadScore >= 30 || leadData.firstName));
  }, [leadData, leadScore]);

  // Auto-qualify when conditions are met
  useEffect(() => {
    if (enableTracking) {
      qualifyLead();
    }
  }, [enableTracking, qualifyLead]);

  return {
    // State
    leadData,
    leadScore,
    isQualified,
    conversationHistory,
    
    // Actions
    updateLeadData,
    addToConversation,
    calculateScore,
    qualifyLead,
    resetLead,
    
    // CRM Integration
    createLead,
    
    // Utilities
    getLeadSummary,
    isReadyForCapture
  };
};