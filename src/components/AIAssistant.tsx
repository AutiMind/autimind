import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Users, DollarSign } from 'lucide-react';
import { breakcoldAPI, CreateLeadRequest } from '../lib/breakcold-api';
import { AUTIMIND_SALES_KNOWLEDGE, getRelevantKnowledge, getPricingInfo, getComplianceGuidance } from '../lib/autimind-sales-knowledge';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  leadCapture?: boolean;
}

interface AIResponse {
  message: string;
  leadScore: number;
  shouldCaptureInfo: boolean;
  suggestedActions: string[];
  followUpQuestions: string[];
  businessContext: string;
}

interface LeadData {
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
}

interface AIAssistantProps {
  userId?: string;
  userEmail?: string;
  context?: 'onboarding' | 'technical' | 'general' | 'sales';
  enableLeadCapture?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  userId, 
  userEmail, 
  context = 'sales',
  enableLeadCapture = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({});
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadScore, setLeadScore] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage(context);
      setMessages([{
        id: Date.now().toString(),
        content: welcomeMessage,
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, context]);

  const getWelcomeMessage = (context: string): string => {
    const stats = AUTIMIND_SALES_KNOWLEDGE.companyOverview.keyStats;
    switch (context) {
      case 'sales':
        return `🚀 Hello! I'm here to help you discover how AutiMind's AI development services can drive revenue for your business. We're an AI software development company led by co-CEOs with ${stats['Team Experience']} who deliver solutions ${stats['Development Speed']} faster than traditional methods. We specialize in custom AI development, machine learning systems, and intelligent automation across healthcare, finance, manufacturing, and more. What business challenges could AI help you solve?`;
      case 'technical':
        return "🔧 Hi! I'm your technical AI consultant for AutiMind. Our engineering team has built scalable AI systems with sub-50ms global performance and 60% lower infrastructure costs. What technical AI challenges can we help you solve?";
      default:
        return `💡 Welcome! I'm AutiMind's AI business consultant. We help companies increase revenue through custom AI development, with clients typically seeing ROI within 6-12 months. Our team has ${stats['Team Experience']} building AI solutions that deliver measurable business results. What brings you here today?`;
    }
  };

  // Revenue-focused lead qualification scoring
  const calculateRevenueLeadScore = (message: string, history: Message[]): number => {
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
  };

  // Extract lead information from conversation
  const extractLeadInfo = (message: string): Partial<LeadData> => {
    const extracted: Partial<LeadData> = {};
    const lowerMessage = message.toLowerCase();
    
    // Email pattern
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) extracted.email = emailMatch[0];
    
    // Phone pattern
    const phoneMatch = message.match(/(\d{3}[-.]?)?\d{3}[-.]?\d{4}/);
    if (phoneMatch) extracted.phone = phoneMatch[0];
    
    // Company indicators
    if (lowerMessage.includes('company') || lowerMessage.includes('business') || lowerMessage.includes('organization')) {
      const companyMatch = message.match(/(?:company|business|organization)(?:\s+is|\s+called|\s+name)?\s+([A-Za-z0-9\s]+)/i);
      if (companyMatch) extracted.company = companyMatch[1].trim();
    }
    
    // Interest categorization for AI software development
    if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) extracted.interest = 'Machine Learning';
    else if (lowerMessage.includes('computer vision') || lowerMessage.includes('image recognition')) extracted.interest = 'Computer Vision';
    else if (lowerMessage.includes('nlp') || lowerMessage.includes('natural language')) extracted.interest = 'Natural Language Processing';
    else if (lowerMessage.includes('chatbot') || lowerMessage.includes('conversational ai')) extracted.interest = 'Conversational AI';
    else if (lowerMessage.includes('automation') || lowerMessage.includes('process automation')) extracted.interest = 'AI Automation';
    else if (lowerMessage.includes('hardware') || lowerMessage.includes('embedded') || lowerMessage.includes('iot')) extracted.interest = 'AI Hardware/IoT';
    else if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical')) extracted.interest = 'Healthcare AI';
    else if (lowerMessage.includes('fintech') || lowerMessage.includes('financial')) extracted.interest = 'Financial AI';
    else if (lowerMessage.includes('manufacturing') || lowerMessage.includes('industrial')) extracted.interest = 'Industrial AI';
    else if (lowerMessage.includes('retail') || lowerMessage.includes('e-commerce')) extracted.interest = 'Retail AI';
    else if (lowerMessage.includes('security') || lowerMessage.includes('fraud detection')) extracted.interest = 'AI Security';
    else if (lowerMessage.includes('education') || lowerMessage.includes('edtech')) extracted.interest = 'Educational AI';
    else if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) extracted.interest = 'AI Integration';
    else if (lowerMessage.includes('custom software') || lowerMessage.includes('development')) extracted.interest = 'Custom AI Development';
    
    return extracted;
  };

  // Create revenue-focused lead in Breakcold CRM
  const createLeadInCRM = async (data: LeadData, conversationContext: string, businessContext?: string) => {
    if (!enableLeadCapture || !data.email) return;

    try {
      const leadRequest: CreateLeadRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        website: data.website,
        title: data.title,
        source: `AutiMind AI Development - Revenue Chatbot`,
        tags: [
          'AutiMind Lead',
          'AI Development Services',
          'Revenue Qualified',
          businessContext || 'Business Interest',
          data.interest || 'Custom AI Solutions'
        ].filter(Boolean),
        customAttributes: {
          leadScore: leadScore,
          interest: data.interest,
          budget: data.budget,
          timeline: data.timeline,
          conversationContext: conversationContext,
          businessContext: businessContext,
          capturedAt: new Date().toISOString(),
          source: 'AutiMind Revenue AI Chatbot',
          contactEmail: 'andrea@autimind.com'
        },
        notes: `REVENUE LEAD captured via AutiMind AI chatbot. Business Context: ${businessContext || 'AI Interest'}. Lead Score: ${leadScore}/100. Interest: ${data.interest || 'Custom AI Development'}. Forward to andrea@autimind.com for immediate follow-up. Conversation: ${conversationContext}`
      };

      const result = await breakcoldAPI.upsertLead(leadRequest);
      
      if (result.success) {
        console.log('Revenue lead created in Breakcold:', result.data);
        
        const successMessage: Message = {
          id: Date.now().toString(),
          content: "Perfect! I've captured your information and Andrea from our AutiMind team (andrea@autimind.com) will reach out within 24 hours with detailed information about how our AI development services can drive revenue for your business. She'll also schedule a consultation to discuss your specific needs and provide a customized proposal. Is there anything else about our AI capabilities I can help clarify right now?",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Failed to create revenue lead in CRM:', error);
      
      // Fallback message with direct contact
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: "I want to make sure you connect with our team! Please reach out directly to Andrea at andrea@autimind.com and mention your interest in AutiMind's AI development services. She'll get back to you immediately with detailed information and can schedule a consultation to discuss your specific needs.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  // Call our Cloudflare Workers AI for real AI responses
  const callAutiMindAI = async (message: string, conversationHistory: Message[]): Promise<AIResponse> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.isBot ? 'assistant' : 'user',
            content: msg.content,
            timestamp: msg.timestamp.toISOString()
          })),
          context,
          leadData
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI API call failed:', error);
      
      // Fallback to sales-focused response
      const fallbackScore = calculateRevenueLeadScore(message, conversationHistory);
      return {
        message: "I'd love to discuss how AutiMind's AI development services can drive revenue for your business. Our team has helped companies reduce costs by 30-60% through intelligent automation. Could you share more about your specific business challenges so I can connect you with the right solutions?",
        leadScore: fallbackScore,
        shouldCaptureInfo: fallbackScore >= 40,
        suggestedActions: ['capture_contact_info'],
        followUpQuestions: ["What industry is your business in?", "What's your biggest operational challenge?"],
        businessContext: 'AI Interest - Direct Contact Recommended'
      };
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Extract lead information from message
    const extractedInfo = extractLeadInfo(currentInput);
    const updatedLeadData = { ...leadData, ...extractedInfo };
    setLeadData(updatedLeadData);

    try {
      // Call real AI for revenue-focused response
      const aiResponse = await callAutiMindAI(currentInput, messages);
      
      // Update lead score with AI's assessment
      const newLeadScore = Math.max(leadScore, aiResponse.leadScore);
      setLeadScore(newLeadScore);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      // Handle lead capture based on AI assessment
      if (enableLeadCapture && aiResponse.shouldCaptureInfo) {
        if (updatedLeadData.email) {
          // Create lead with conversation context
          const conversationSummary = [...messages, userMessage, botMessage]
            .slice(-6).map(m => `${m.isBot ? 'Bot' : 'User'}: ${m.content}`).join('\n');
          await createLeadInCRM(updatedLeadData, conversationSummary, aiResponse.businessContext);
        } else {
          // Prompt for contact information
          setShowLeadForm(true);
          const leadCaptureMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "I'd love to help you further! Our team at AutiMind specializes in exactly these types of AI challenges. Could you share your contact information so Andrea (andrea@autimind.com) can follow up with a personalized consultation and detailed information about how we can solve your specific needs?",
            isBot: true,
            timestamp: new Date(),
            leadCapture: true
          };
          setMessages(prev => [...prev, leadCaptureMessage]);
        }
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having a brief technical issue, but I don't want you to miss out on learning about AutiMind's AI development services! Please reach out to Andrea directly at andrea@autimind.com and mention your interest in AI solutions. Our team will get back to you immediately with detailed information about how we can help your business.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = context === 'sales' ? [
    { label: '💰 ROI Calculator', action: 'How much money could AI save my business annually?' },
    { label: '🚀 Custom AI Dev', action: 'I need custom AI development for competitive advantage' },
    { label: '⚡ Quick Integration', action: 'How fast can you integrate AI into our existing systems?' },
    { label: '📊 Get Pricing', action: 'What would custom AI development cost for our business?' }
  ] : [
    { label: '💡 AI Strategy', action: 'How can AI transform my business operations?' },
    { label: '🔧 Technical Consulting', action: 'I need technical consultation for AI implementation' },
    { label: '🏭 Industry Solutions', action: 'What AI solutions work best for my industry?' },
    { label: '📞 Schedule Call', action: 'I want to schedule a consultation with your team' }
  ];

  const handleLeadFormSubmit = async (formData: LeadData) => {
    const finalLeadData = { ...leadData, ...formData };
    setLeadData(finalLeadData);
    setShowLeadForm(false);
    
    const conversationSummary = messages.slice(-5).map(m => `${m.isBot ? 'Bot' : 'User'}: ${m.content}`).join('\n');
    await createLeadInCRM(finalLeadData, conversationSummary);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <h3 className="font-semibold">AutiMind Business AI</h3>
          </div>
          {enableLeadCapture && leadScore > 0 && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs">
              <Users className="w-3 h-3" />
              <span>{leadScore}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isBot ? 'items-start' : 'items-start justify-end'}`}
          >
            {message.isBot && (
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-teal-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white ml-auto'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {!message.isBot && (
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-teal-600" />
            </div>
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && !showLeadForm && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(action.action);
                  sendMessage();
                }}
                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 p-2 rounded border transition-colors text-left"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lead Capture Form */}
      {showLeadForm && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Let's Connect!
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const data: LeadData = {
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  company: formData.get('company') as string,
                };
                handleLeadFormSubmit(data);
              }}
              className="space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="firstName"
                  placeholder="First Name"
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                  defaultValue={leadData.firstName || ''}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                  defaultValue={leadData.lastName || ''}
                />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email Address *"
                required
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                defaultValue={leadData.email || ''}
              />
              <input
                name="phone"
                placeholder="Phone Number"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                defaultValue={leadData.phone || ''}
              />
              <input
                name="company"
                placeholder="Organization Name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                defaultValue={leadData.company || ''}
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white text-xs py-2 px-3 rounded transition-colors"
                >
                  Send Info
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="px-3 py-2 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How can AI drive revenue for your business? Ask about ROI, costs, or custom development..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;