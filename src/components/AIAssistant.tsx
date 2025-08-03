import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Users } from 'lucide-react';
import { breakcoldAPI, CreateLeadRequest } from '../lib/breakcold-api';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  leadCapture?: boolean;
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
    switch (context) {
      case 'onboarding':
        return "👋 Hi! I'm your AI assistant here to help you get started with AutiMind's AI development services. I can guide you through our AI solutions, custom software development, and hardware integration offerings. What would you like to learn about first?";
      case 'technical':
        return "🔧 Hi there! I'm your technical support assistant for AutiMind. I can help with AI integration questions, development support, and technical documentation. What technical challenge can I help you with?";
      case 'sales':
        return "🚀 Hello! I'm here to help you discover how AutiMind's AI software development expertise can transform your business. We specialize in AI integration, custom AI solutions, machine learning systems, and intelligent hardware development. Whether you need AI for healthcare, finance, manufacturing, retail, or any other industry, we can help. What brings you here today?";
      default:
        return "👋 Hello! I'm your AI assistant for AutiMind. We're an AI software development company that builds custom AI solutions, integrates AI into existing systems, and develops intelligent hardware. How can I help you today?";
    }
  };

  // Lead qualification scoring
  const calculateLeadScore = (message: string, history: Message[]): number => {
    let score = 0;
    const lowerMessage = message.toLowerCase();
    
    // Interest indicators for AI development services
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) score += 15;
    if (lowerMessage.includes('quote') || lowerMessage.includes('estimate') || lowerMessage.includes('proposal')) score += 20;
    if (lowerMessage.includes('when can') || lowerMessage.includes('timeline') || lowerMessage.includes('how soon')) score += 15;
    
    // AI-specific high-value terms
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence') || lowerMessage.includes('machine learning')) score += 20;
    if (lowerMessage.includes('neural network') || lowerMessage.includes('deep learning') || lowerMessage.includes('computer vision')) score += 25;
    if (lowerMessage.includes('natural language processing') || lowerMessage.includes('nlp') || lowerMessage.includes('chatbot')) score += 20;
    if (lowerMessage.includes('automation') || lowerMessage.includes('intelligent systems') || lowerMessage.includes('predictive analytics')) score += 18;
    
    // Development and integration terms
    if (lowerMessage.includes('custom software') || lowerMessage.includes('development') || lowerMessage.includes('integration')) score += 15;
    if (lowerMessage.includes('api') || lowerMessage.includes('sdk') || lowerMessage.includes('platform')) score += 12;
    if (lowerMessage.includes('hardware') || lowerMessage.includes('embedded') || lowerMessage.includes('iot')) score += 15;
    
    // Industry-specific terms
    if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical') || lowerMessage.includes('fintech')) score += 15;
    if (lowerMessage.includes('manufacturing') || lowerMessage.includes('retail') || lowerMessage.includes('logistics')) score += 15;
    if (lowerMessage.includes('security') || lowerMessage.includes('fraud detection') || lowerMessage.includes('cybersecurity')) score += 18;
    if (lowerMessage.includes('education') || lowerMessage.includes('edtech') || lowerMessage.includes('learning')) score += 12;
    
    // Business context
    if (lowerMessage.includes('business') || lowerMessage.includes('company') || lowerMessage.includes('organization')) score += 10;
    if (lowerMessage.includes('enterprise') || lowerMessage.includes('startup') || lowerMessage.includes('corporation')) score += 12;
    if (lowerMessage.includes('need help') || lowerMessage.includes('looking for') || lowerMessage.includes('interested in')) score += 10;
    
    // Urgency indicators
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('immediately')) score += 25;
    if (lowerMessage.includes('deadline') || lowerMessage.includes('launch') || lowerMessage.includes('go live')) score += 20;
    if (lowerMessage.includes('proof of concept') || lowerMessage.includes('poc') || lowerMessage.includes('pilot')) score += 15;
    
    // Technology stack mentions
    if (lowerMessage.includes('python') || lowerMessage.includes('tensorflow') || lowerMessage.includes('pytorch')) score += 10;
    if (lowerMessage.includes('aws') || lowerMessage.includes('azure') || lowerMessage.includes('cloud')) score += 10;
    if (lowerMessage.includes('data science') || lowerMessage.includes('big data') || lowerMessage.includes('analytics')) score += 15;
    
    // Engagement indicators
    if (history.length > 5) score += 10;
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

  // Create lead in Breakcold CRM
  const createLeadInCRM = async (data: LeadData, conversationContext: string) => {
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
        source: `AutiMind AI Development - ${context}`,
        tags: [
          'AutiMind Lead',
          'AI Development',
          context.charAt(0).toUpperCase() + context.slice(1),
          data.interest || 'AI Consultation'
        ].filter(Boolean),
        customAttributes: {
          leadScore: leadScore,
          interest: data.interest,
          budget: data.budget,
          timeline: data.timeline,
          conversationContext: conversationContext,
          capturedAt: new Date().toISOString(),
          source: 'AutiMind AI Chatbot'
        },
        notes: `Lead captured via AutiMind AI chatbot. Interest: ${data.interest || 'AI Development'}. Lead score: ${leadScore}/100. Context: ${conversationContext}`
      };

      const result = await breakcoldAPI.upsertLead(leadRequest);
      
      if (result.success) {
        console.log('Lead created/updated in Breakcold:', result.data);
        
        const successMessage: Message = {
          id: Date.now().toString(),
          content: "Thanks for your information! I've noted your details and someone from our AutiMind AI development team will reach out to you soon to discuss how we can help with your AI project. Is there anything else I can help you with right now?",
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Failed to create lead in CRM:', error);
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
    setInputValue('');
    setIsLoading(true);

    // Calculate lead score and extract information
    const messageScore = calculateLeadScore(inputValue, messages);
    const newLeadScore = Math.max(leadScore, messageScore);
    setLeadScore(newLeadScore);

    // Extract lead information from message
    const extractedInfo = extractLeadInfo(inputValue);
    const updatedLeadData = { ...leadData, ...extractedInfo };
    setLeadData(updatedLeadData);

    try {
      // Simulate AI response (in production, this would call your AI service)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate contextual response based on message content
      let botResponse = generateContextualResponse(inputValue, context, newLeadScore);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      // Check if we should capture the lead
      if (enableLeadCapture && newLeadScore >= 30 && updatedLeadData.email) {
        const conversationSummary = messages.slice(-5).map(m => `${m.isBot ? 'Bot' : 'User'}: ${m.content}`).join('\n');
        await createLeadInCRM(updatedLeadData, conversationSummary);
      } else if (enableLeadCapture && newLeadScore >= 50 && !updatedLeadData.email) {
        setShowLeadForm(true);
        const promptMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "I'd love to help you further with your AI project! Could you share your email so I can send you some detailed information about our AI development services and have our team follow up with a personalized consultation?",
          isBot: true,
          timestamp: new Date(),
          leadCapture: true
        };
        setMessages(prev => [...prev, promptMessage]);
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or contact our team directly at info@autimind.com for immediate assistance.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContextualResponse = (userMessage: string, context: string, score: number): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // High-intent responses
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Our AI development pricing varies based on project complexity and scope. Simple AI integrations start around $15,000, while comprehensive AI systems range from $50,000 to $500,000+. Enterprise AI solutions with custom hardware can exceed $1M. We'd be happy to provide a detailed quote based on your specific requirements. What type of AI solution are you considering?";
    }
    
    if (lowerMessage.includes('machine learning') || lowerMessage.includes('ml')) {
      return "Excellent! Machine learning is one of our core specialties. We develop custom ML models for predictive analytics, recommendation systems, fraud detection, demand forecasting, and more. Whether you need supervised, unsupervised, or reinforcement learning solutions, we can help. What specific business problem are you looking to solve with ML?";
    }
    
    if (lowerMessage.includes('computer vision') || lowerMessage.includes('image recognition')) {
      return "Computer vision is a fascinating area! We build CV solutions for quality control in manufacturing, medical image analysis, autonomous systems, security and surveillance, retail analytics, and more. Our team works with the latest deep learning frameworks and can handle everything from object detection to facial recognition. What's your use case?";
    }
    
    if (lowerMessage.includes('nlp') || lowerMessage.includes('natural language')) {
      return "Natural Language Processing is incredibly powerful for business applications. We develop chatbots, sentiment analysis systems, document processing automation, language translation services, and content generation tools. Our NLP solutions can process structured and unstructured text data at scale. What language processing challenges are you facing?";
    }
    
    if (lowerMessage.includes('hardware') || lowerMessage.includes('embedded') || lowerMessage.includes('iot')) {
      return "We love working on AI hardware and IoT projects! Our team develops intelligent embedded systems, edge AI devices, smart sensors, and IoT platforms with AI capabilities. We work with various hardware platforms including ARM, NVIDIA Jetson, and custom silicon. Are you looking to add intelligence to existing hardware or develop new AI-powered devices?";
    }
    
    if (lowerMessage.includes('healthcare') || lowerMessage.includes('medical')) {
      return "Healthcare AI is one of our most impactful areas. We develop diagnostic AI systems, medical image analysis, patient monitoring solutions, drug discovery algorithms, and clinical decision support tools. All our healthcare AI solutions are designed with HIPAA compliance and FDA requirements in mind. What healthcare challenge are you looking to address?";
    }
    
    if (lowerMessage.includes('fintech') || lowerMessage.includes('financial')) {
      return "Financial AI is a rapidly growing field! We build fraud detection systems, algorithmic trading platforms, credit scoring models, risk assessment tools, and automated financial advisors. Our solutions help financial institutions improve efficiency while maintaining regulatory compliance. What financial processes are you looking to enhance with AI?";
    }
    
    if (lowerMessage.includes('automation') || lowerMessage.includes('process automation')) {
      return "AI-powered automation can transform business operations! We develop intelligent process automation (IPA) solutions that combine RPA with AI for document processing, workflow optimization, predictive maintenance, and intelligent decision-making. Our automation solutions can handle complex, variable processes that traditional RPA cannot. What processes are you looking to automate?";
    }
    
    if (lowerMessage.includes('timeline') || lowerMessage.includes('when')) {
      return "AI project timelines vary significantly based on complexity: Proof of concepts typically take 4-8 weeks, basic AI integrations 2-4 months, custom AI systems 6-12 months, and enterprise AI platforms with hardware can take 12-24 months. We always start with a detailed project assessment to provide accurate timelines. What's your target deployment date?";
    }
    
    // Medium-intent responses
    if (lowerMessage.includes('chatbot') || lowerMessage.includes('conversational ai')) {
      return "Conversational AI is incredibly versatile! We build sophisticated chatbots and virtual assistants for customer service, sales support, internal operations, and specialized industry applications. Our solutions use advanced NLP and can integrate with existing systems and knowledge bases. Are you looking to improve customer engagement or internal efficiency?";
    }
    
    if (lowerMessage.includes('custom') || lowerMessage.includes('development')) {
      return "Custom AI development is our specialty! We build tailored AI solutions from the ground up, including custom neural networks, specialized algorithms, industry-specific AI platforms, and complete AI-powered applications. Our team has expertise across all major AI technologies and frameworks. What specific AI capabilities do you need developed?";
    }
    
    if (lowerMessage.includes('integration') || lowerMessage.includes('api')) {
      return "AI integration is crucial for maximizing ROI from existing systems. We specialize in integrating AI capabilities into existing platforms, developing AI APIs and microservices, creating AI-powered plugins, and building hybrid systems that combine traditional software with AI. What systems are you looking to enhance with AI?";
    }
    
    // General responses based on score
    if (score > 60) {
      return "It sounds like you have a compelling AI use case! AutiMind has extensive experience across industries including healthcare, finance, manufacturing, retail, and more. We'd love to discuss how our AI expertise can solve your specific challenges. What's the best way to reach you for a detailed consultation?";
    } else if (score > 30) {
      return "That's interesting! AutiMind develops custom AI solutions across many industries and use cases. From machine learning and computer vision to NLP and AI hardware, we can help organizations leverage AI for competitive advantage. What's your biggest challenge that AI might be able to solve?";
    } else {
      return "Thanks for your interest in AutiMind! We're an AI software development company that builds custom AI solutions, integrates AI into existing systems, and develops intelligent hardware. Our expertise spans machine learning, computer vision, NLP, and AI automation across industries. How can AI help transform your business?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = context === 'sales' ? [
    { label: 'Machine Learning', action: 'I need machine learning solutions for my business' },
    { label: 'AI Integration', action: 'How can you integrate AI into our existing systems?' },
    { label: 'Custom AI Development', action: 'Can you develop custom AI solutions for our industry?' },
    { label: 'Get Quote', action: 'What would AI development cost for our project?' }
  ] : [
    { label: 'AI Platform Help', action: 'How do I get started with AI integration?' },
    { label: 'Technical Issues', action: 'I need help with AI technical integration' },
    { label: 'Documentation', action: 'Where can I find your AI development documentation?' },
    { label: 'API Support', action: 'I have questions about your AI API integration' }
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
          <h3 className="font-semibold">AutiMind AI Assistant</h3>
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
            placeholder="Ask me about AI development, machine learning, or custom AI solutions..."
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