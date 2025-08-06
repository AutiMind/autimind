/**
 * AutiMind AI Sales Assistant - Revenue-Focused Chatbot
 * Powered by Cloudflare Workers AI for cost-effective, high-performance conversations
 * Mission: Generate qualified leads and win business for AutiMind's AI development services
 */

interface Env {
  AI: Ai;
  BREAKCOLD_API_KEY?: string;
  AUTIMIND_SALES_EMAIL?: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  userId?: string;
  context?: 'sales' | 'technical' | 'general';
  leadData?: {
    email?: string;
    company?: string;
    name?: string;
    phone?: string;
  };
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatResponse {
  message: string;
  leadScore: number;
  shouldCaptureInfo: boolean;
  suggestedActions: string[];
  followUpQuestions: string[];
  businessContext: string;
}

// AutiMind Sales Knowledge Base - Revenue-Focused Information
const AUTIMIND_SALES_KNOWLEDGE = `
AUTIMIND SALES KNOWLEDGE BASE:

COMPANY POSITIONING:
- AutiMind is a premium AI software development company
- We specialize in custom AI solutions, machine learning systems, and intelligent automation
- We serve businesses across healthcare, finance, manufacturing, retail, and education sectors
- Our competitive advantage: Rapid development cycles with enterprise-grade quality

CORE SERVICES & VALUE PROPOSITIONS:
1. Custom AI Development - Build tailored AI solutions from scratch
   - Machine learning models and algorithms
   - Computer vision and image recognition systems
   - Natural language processing and chatbot development
   - Predictive analytics and forecasting systems

2. AI Integration Services - Add intelligence to existing systems
   - API development and integration
   - Legacy system modernization with AI
   - Data pipeline and analytics integration
   - Cloud-based AI deployment

3. AI Hardware Development - Intelligent embedded systems
   - IoT devices with AI capabilities
   - Edge computing solutions
   - Smart sensor systems
   - Custom hardware with AI processing

4. Industry-Specific AI Solutions
   - Healthcare: Diagnostic AI, patient monitoring, HIPAA-compliant systems
   - Finance: Fraud detection, algorithmic trading, risk assessment
   - Manufacturing: Predictive maintenance, quality control, automation
   - Retail: Recommendation engines, inventory optimization, customer analytics
   - Education: Learning management systems, accessibility tools, personalized learning

SALES MESSAGING - REVENUE FOCUSED:
- "How much could AI automation save your company annually?"
- "What competitive advantages could custom AI development give you in your industry?"
- "Our clients typically see ROI within 6-12 months of AI implementation"
- "We deliver AI solutions faster than traditional development cycles"
- "Every AI project is tailored to maximize your specific business outcomes"

BUDGET QUALIFICATION RANGES:
- Basic AI Integration: $15,000 - $50,000
- Custom AI Development: $50,000 - $250,000
- Enterprise AI Systems: $250,000 - $1,000,000+
- AI Hardware Development: $100,000 - $500,000+

COMPETITIVE ADVANTAGES:
- Experienced team with proven track record
- Faster development cycles than competitors
- Industry-specific expertise and compliance knowledge
- End-to-end service from concept to deployment
- Ongoing support and optimization services

LEGAL COMPLIANCE MESSAGING (CRITICAL - NO EXCEPTIONS):
- "Our team can assess your specific technical requirements" (NEVER say "we can definitely do X")
- "Let's schedule a consultation to discuss your project timeline" (NEVER promise specific delivery dates)
- "We'll provide detailed capability assessment after understanding your needs" (NEVER make blanket capability claims)
- "Our team specializes in [industry] but let's discuss your specific use case" (ALWAYS qualify expertise claims)
- "Results vary by project - let's discuss your specific situation" (NEVER guarantee outcomes)
- ALWAYS route technical questions to andrea@autimind.com for accurate answers
- ALWAYS suggest consultation rather than making definitive statements
- FOCUS on proven track record and client success, NOT guaranteed results

CONTACT ROUTING:
- All qualified leads route to: andrea@autimind.com
- High-priority leads (enterprise, urgent, high-budget) get immediate notification
- Technical consultations scheduled through dedicated consultation request process
`;

// Revenue-focused lead scoring algorithm
function calculateRevenueScore(message: string, history: ChatMessage[]): number {
  let score = 0;
  const lowerMessage = message.toLowerCase();

  // High-value business indicators
  if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('investment')) score += 25;
  if (lowerMessage.includes('enterprise') || lowerMessage.includes('company') || lowerMessage.includes('business')) score += 20;
  if (lowerMessage.includes('timeline') || lowerMessage.includes('when') || lowerMessage.includes('how soon')) score += 20;
  if (lowerMessage.includes('roi') || lowerMessage.includes('return') || lowerMessage.includes('save money')) score += 25;

  // AI development indicators (high-value services)
  if (lowerMessage.includes('custom ai') || lowerMessage.includes('ai development') || lowerMessage.includes('machine learning')) score += 20;
  if (lowerMessage.includes('integration') || lowerMessage.includes('api') || lowerMessage.includes('system')) score += 15;
  if (lowerMessage.includes('automation') || lowerMessage.includes('intelligent') || lowerMessage.includes('predictive')) score += 18;
  
  // Industry-specific high-value terms
  if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical') || lowerMessage.includes('fintech')) score += 20;
  if (lowerMessage.includes('manufacturing') || lowerMessage.includes('retail') || lowerMessage.includes('enterprise')) score += 15;
  
  // Urgency and decision-making authority
  if (lowerMessage.includes('urgent') || lowerMessage.includes('immediate') || lowerMessage.includes('asap')) score += 25;
  if (lowerMessage.includes('decision') || lowerMessage.includes('approve') || lowerMessage.includes('ceo') || lowerMessage.includes('cto')) score += 20;
  
  // Project scale indicators
  if (lowerMessage.includes('large scale') || lowerMessage.includes('multiple') || lowerMessage.includes('comprehensive')) score += 15;
  if (lowerMessage.includes('million') || lowerMessage.includes('thousand')) score += 20;

  // Engagement level
  if (history.length > 3) score += 10;
  if (lowerMessage.length > 100) score += 5;

  return Math.min(score, 100);
}

// Generate revenue-focused AI responses
async function generateSalesResponse(
  userMessage: string, 
  history: ChatMessage[], 
  leadScore: number,
  ai: Ai
): Promise<{ message: string; actions: string[]; followUps: string[] }> {
  
  const conversationContext = history.length > 0 
    ? history.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')
    : '';

  const systemPrompt = `You are a sales assistant for AutiMind, a premium AI software development company. Your mission is to generate qualified leads and win business while maintaining strict legal compliance.

CRITICAL LEGAL COMPLIANCE REQUIREMENTS (NO EXCEPTIONS):
1. NEVER make definitive capability claims - always suggest consultation for technical questions
2. NEVER promise specific timelines - always direct to consultation for accurate estimates
3. NEVER guarantee specific outcomes - focus on track record and past client success
4. ALWAYS qualify statements with "Our team can assess..." or "Let's discuss your specific needs..."
5. ALWAYS route technical questions to andrea@autimind.com for accurate answers
6. NEVER make claims that could be construed as false advertising or guarantees

SALES APPROACH:
1. Focus on business value and ROI - connect AI to revenue/cost savings
2. Qualify leads aggressively - ask about budget, timeline, decision-making authority  
3. Position AutiMind as premium development partner with proven track record
4. Always suggest next steps (consultation, proposal, demo)
5. Never mention underlying technology (Cloudflare, specific tools)
6. Be truthful and helpful while driving toward business outcomes

${AUTIMIND_SALES_KNOWLEDGE}

Current conversation context:
${conversationContext}

User's latest message: ${userMessage}
Lead score: ${leadScore}/100

Respond as a sales-focused AI assistant. Be helpful but always drive toward a business outcome.`;

  try {
    const aiResponse = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 256,
      temperature: 0.7
    });

    const message = aiResponse.response || "I'd love to help you explore how AutiMind's AI development services can drive revenue for your business. What specific challenges are you facing?";

    // Generate suggested actions based on lead score
    const actions = [];
    const followUps = [];

    if (leadScore > 70) {
      actions.push('schedule_consultation', 'send_proposal_outline', 'priority_followup');
      followUps.push(
        "What's your budget range for this AI project?",
        "When would you like to start implementation?",
        "Who else is involved in the decision-making process?"
      );
    } else if (leadScore > 40) {
      actions.push('capture_contact_info', 'send_case_studies', 'schedule_demo');
      followUps.push(
        "What industry is your company in?",
        "How large is your organization?",
        "What's driving the need for AI in your business?"
      );
    } else {
      actions.push('educate_on_value', 'qualify_needs', 'capture_interest');
      followUps.push(
        "What business problems are you hoping AI could solve?",
        "Are you currently using any AI or automation tools?",
        "What would success look like for your AI project?"
      );
    }

    return { message, actions, followUps };

  } catch (error) {
    console.error('AI generation error:', error);
    
    // Fallback to sales-focused response
    const fallbackMessage = leadScore > 50 
      ? "I'd love to discuss how AutiMind's AI development services can drive revenue for your business. Our team specializes in custom AI solutions that deliver measurable ROI. Could you share more about your specific needs so we can explore how to help?"
      : "AutiMind develops custom AI solutions that help businesses increase revenue, reduce costs, and gain competitive advantages. What business challenges are you facing that AI might be able to solve?";

    return { 
      message: fallbackMessage, 
      actions: ['capture_interest'], 
      followUps: ["What industry is your business in?", "What's your biggest operational challenge?"] 
    };
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const chatRequest: ChatRequest = await request.json();
    const { message, conversationHistory = [], context: chatContext = 'sales' } = chatRequest;

    // Calculate revenue-focused lead score
    const leadScore = calculateRevenueScore(message, conversationHistory);

    // Generate AI response focused on sales and revenue
    const aiResult = await generateSalesResponse(
      message, 
      conversationHistory, 
      leadScore,
      env.AI
    );

    // Determine if we should capture lead information
    const shouldCaptureInfo = leadScore >= 40;
    
    // Add business context for CRM
    const businessContext = leadScore > 60 ? 'High-Intent Business Lead' :
                           leadScore > 30 ? 'Qualified Business Prospect' :
                           'Initial Business Interest';

    const response: ChatResponse = {
      message: aiResult.message,
      leadScore,
      shouldCaptureInfo,
      suggestedActions: aiResult.actions,
      followUpQuestions: aiResult.followUps,
      businessContext
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    return new Response(JSON.stringify({
      message: "I apologize for the technical issue. Let me connect you with our team directly. Please reach out to andrea@autimind.com and mention you were interested in AI development services. We'll get back to you immediately with detailed information about how we can help your business.",
      leadScore: 25,
      shouldCaptureInfo: true,
      suggestedActions: ['direct_contact'],
      followUpQuestions: [],
      businessContext: 'Technical Issue - Direct Contact Required'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
};

// Handle CORS preflight requests
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
};