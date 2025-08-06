/**
 * AutiMind Sales Knowledge Base
 * Revenue-focused business information for AI chatbot sales conversations
 * Extracted from official business documentation for accurate, truthful responses
 */

export interface SalesKnowledge {
  companyOverview: CompanyInfo;
  services: ServiceOffering[];
  team: TeamMember[];
  competitiveAdvantages: string[];
  targetMarkets: MarketSegment[];
  pricingGuidelines: PricingInfo[];
  successMessages: SalesMessage[];
  legalCompliance: ComplianceGuideline[];
}

export interface CompanyInfo {
  name: string;
  mission: string;
  founded: string;
  leadership: string;
  keyStats: Record<string, string>;
}

export interface ServiceOffering {
  service: string;
  description: string;
  valueProposition: string;
  targetMarket: string;
  keyFeatures: string[];
  businessBenefits: string[];
}

export interface TeamMember {
  name: string;
  title: string;
  expertise: string[];
  background: string;
  credibility: string;
}

export interface MarketSegment {
  industry: string;
  marketSize: string;
  specificNeeds: string[];
  autimindSolutions: string[];
  roi: string;
}

export interface PricingInfo {
  service: string;
  range: string;
  factors: string[];
  consultationRequired: boolean;
}

export interface SalesMessage {
  scenario: string;
  message: string;
  followUp: string[];
}

export interface ComplianceGuideline {
  topic: string;
  approach: string;
  deflectionMessage: string;
}

// AutiMind Sales Knowledge Base - Extracted from Official Documents
export const AUTIMIND_SALES_KNOWLEDGE: SalesKnowledge = {
  companyOverview: {
    name: "AutiMind, Inc.",
    mission: "Transform business and education through accessible, intelligent AI technology solutions",
    founded: "2023",
    leadership: "Co-CEOs Amy Cozart-Lundin (EdD, 20+ years learning technology) and Andrea Cozart-Lundin (15+ years full-stack AI engineering)",
    keyStats: {
      "Team Experience": "60+ years combined expertise",
      "Development Speed": "70% faster than traditional methods",
      "Infrastructure Cost": "60% lower than competitors",
      "Response Time": "Sub-50ms global performance",
      "Current Revenue": "$500,000+ (2024, bootstrapped)"
    }
  },

  services: [
    {
      service: "Custom AI Development",
      description: "Bespoke AI solutions built from scratch for specific business needs",
      valueProposition: "Tailored AI systems that deliver measurable ROI through automation, intelligence, and competitive advantages",
      targetMarket: "$136B enterprise AI solutions market",
      keyFeatures: [
        "Machine learning models and algorithms",
        "Natural language processing and chatbots",
        "Computer vision and image recognition",
        "Predictive analytics and forecasting",
        "Custom AI integration with existing systems"
      ],
      businessBenefits: [
        "Automate complex business processes",
        "Reduce operational costs by 30-60%",
        "Gain competitive intelligence advantages",
        "Improve decision-making accuracy",
        "Scale operations without proportional cost increases"
      ]
    },
    {
      service: "AI Integration Services",
      description: "Add intelligent capabilities to existing business systems and workflows",
      valueProposition: "Transform existing infrastructure into intelligent systems without full platform replacement",
      targetMarket: "Mid-market companies needing AI capabilities",
      keyFeatures: [
        "API development and integration",
        "Legacy system modernization",
        "Data pipeline optimization",
        "Cloud-based AI deployment",
        "Workflow automation"
      ],
      businessBenefits: [
        "Maximize existing technology investments",
        "Gradual AI adoption with immediate ROI",
        "Improve employee productivity",
        "Enhance customer experience",
        "Reduce manual processing costs"
      ]
    },
    {
      service: "AI Hardware Development",
      description: "Intelligent embedded systems and IoT devices with AI processing capabilities",
      valueProposition: "Edge-native AI processing for real-time intelligence without cloud dependency",
      targetMarket: "Manufacturing, healthcare, and IoT applications",
      keyFeatures: [
        "Custom AI-powered hardware devices",
        "Edge computing solutions",
        "Smart sensor systems",
        "IoT integration",
        "Real-time processing capabilities"
      ],
      businessBenefits: [
        "Real-time decision-making at device level",
        "Reduced cloud computing costs",
        "Enhanced privacy and security",
        "Improved system reliability",
        "Faster response times for critical applications"
      ]
    },
    {
      service: "AstroLMS - Corporate Learning Platform",
      description: "AI-powered learning management system for corporate training and development",
      valueProposition: "Increase training effectiveness by 40% through AI personalization and accessibility features",
      targetMarket: "$164B corporate learning market",
      keyFeatures: [
        "AI-powered personalization",
        "Blockchain credentialing",
        "Neurodiversity support",
        "SCORM compliance",
        "Real-time analytics"
      ],
      businessBenefits: [
        "Higher training completion rates",
        "Measurable skill development ROI",
        "Reduced training administration costs",
        "Improved employee retention",
        "Compliance and certification tracking"
      ]
    }
  ],

  team: [
    {
      name: "Amy Cozart-Lundin, EdD",
      title: "CEO & Chief Learning Technology Developer",
      expertise: ["Educational Technology (20+ years)", "Neurodiversity Research", "AI-Powered Learning", "Accessibility Compliance"],
      background: "EdD in Learning & Technology, published researcher, led three educational technology startups to acquisition",
      credibility: "Innovation in Education Technology Award (2022), keynote speaker at International Conference on Learning Technologies"
    },
    {
      name: "Andrea Cozart-Lundin",
      title: "CTO & Chief Technology Officer",
      expertise: ["Full-Stack Engineering (15+ years)", "AI/ML Development", "Edge Computing", "Enterprise Architecture"],
      background: "Built scalable AI systems, architect of AstroLMS and zServed platforms, holds 3 provisional patents",
      credibility: "Led technical teams at startups acquired by Fortune 100 companies, created systems serving 10,000+ concurrent users"
    },
    {
      name: "Amy Perry Tipton, MS, CCC-SLP",
      title: "Board Member & Strategic Advisor",
      expertise: ["Healthcare Leadership (25+ years)", "Accessibility Standards", "Clinical Excellence", "Regulatory Compliance"],
      background: "MS, CCC-SLP, expert in neurodiversity support and therapeutic intervention",
      credibility: "Healthcare leadership and speech-language pathology authority"
    }
  ],

  competitiveAdvantages: [
    "Edge-native architecture delivering sub-50ms global response times",
    "70% faster development cycles than traditional methods",
    "60% lower infrastructure costs through innovative architecture",
    "First-mover advantage in neurodiversity-focused AI platforms",
    "Proven technology with working prototypes and active users",
    "Strong team with 60+ years combined expertise",
    "Accessibility-first design serving underserved markets",
    "Transparent pricing without vendor lock-in"
  ],

  targetMarkets: [
    {
      industry: "Healthcare",
      marketSize: "Billions in AI healthcare market",
      specificNeeds: ["Patient diagnosis support", "Medical image analysis", "HIPAA compliance", "Clinical decision support"],
      autimindSolutions: ["Custom diagnostic AI", "Computer vision for medical imaging", "Compliant data processing", "AI-powered clinical tools"],
      roi: "Improved diagnostic accuracy and reduced processing time"
    },
    {
      industry: "Finance",
      marketSize: "$27.6B+ financial technology market",
      specificNeeds: ["Fraud detection", "Risk assessment", "Algorithmic trading", "Regulatory compliance"],
      autimindSolutions: ["Custom fraud detection AI", "Risk modeling systems", "Automated trading algorithms", "Compliance monitoring tools"],
      roi: "Reduced fraud losses and improved risk management"
    },
    {
      industry: "Manufacturing",
      marketSize: "Industrial AI transformation market",
      specificNeeds: ["Predictive maintenance", "Quality control", "Process automation", "Supply chain optimization"],
      autimindSolutions: ["AI-powered maintenance systems", "Computer vision quality control", "Intelligent automation", "Supply chain AI"],
      roi: "Reduced downtime and improved operational efficiency"
    },
    {
      industry: "Education",
      marketSize: "$164B corporate learning market",
      specificNeeds: ["Personalized learning", "Accessibility compliance", "Skills assessment", "Training effectiveness"],
      autimindSolutions: ["AstroLMS platform", "AI tutoring systems", "Accessibility features", "Learning analytics"],
      roi: "Higher training completion rates and measurable skill development"
    }
  ],

  pricingGuidelines: [
    {
      service: "Basic AI Integration",
      range: "$15,000 - $50,000",
      factors: ["System complexity", "Integration requirements", "Timeline"],
      consultationRequired: true
    },
    {
      service: "Custom AI Development",
      range: "$50,000 - $250,000",
      factors: ["Project scope", "AI complexity", "Data requirements", "Industry compliance needs"],
      consultationRequired: true
    },
    {
      service: "Enterprise AI Systems",
      range: "$250,000 - $1,000,000+",
      factors: ["Scale", "Multiple integrations", "Custom hardware", "Ongoing support"],
      consultationRequired: true
    },
    {
      service: "AstroLMS Subscriptions",
      range: "$19 - $99+ per month per user",
      factors: ["User count", "Feature requirements", "Customization needs"],
      consultationRequired: false
    }
  ],

  successMessages: [
    {
      scenario: "Budget Inquiry",
      message: "Our AI development pricing varies based on project complexity and business requirements. We've helped companies save 30-60% on operational costs through intelligent automation. Investment ranges from $15,000 for basic integrations to enterprise solutions over $1M, with most clients seeing ROI within 6-12 months.",
      followUp: ["What's your budget range for this project?", "What specific business outcomes are you hoping to achieve?", "When would you like to see results from your AI investment?"]
    },
    {
      scenario: "Technical Capabilities",
      message: "Our team specializes in custom AI development across machine learning, natural language processing, computer vision, and predictive analytics. With our edge-native architecture, we deliver 70% faster development cycles and sub-50ms response times globally.",
      followUp: ["What specific AI capabilities are you looking for?", "What technical challenges is your current system facing?", "How important is performance and response time for your use case?"]
    },
    {
      scenario: "Industry Expertise",
      message: "We've developed AI solutions across healthcare, finance, manufacturing, education, and more. Our team understands industry-specific compliance requirements like HIPAA, FERPA, and regulatory standards. Each solution is tailored to your industry's unique needs and challenges.",
      followUp: ["What industry is your business in?", "What specific compliance requirements do you need to meet?", "What are the biggest operational challenges in your industry?"]
    },
    {
      scenario: "ROI and Business Value",
      message: "Our clients typically see measurable ROI within 6-12 months through cost reduction, process automation, and competitive advantages. We've helped companies reduce operational costs by 30-60% while improving decision-making accuracy and customer experience.",
      followUp: ["What would successful AI implementation look like for your business?", "What's currently costing your company the most in manual processes?", "How do you measure success in technology investments?"]
    }
  ],

  legalCompliance: [
    {
      topic: "Specific Technical Capabilities",
      approach: "Qualify with consultation rather than make definitive claims",
      deflectionMessage: "That's an excellent technical question. Our engineering team can provide a detailed capability assessment based on your specific requirements. Let's schedule a consultation so we can give you accurate information about how we can address your needs."
    },
    {
      topic: "Project Timelines",
      approach: "Avoid specific delivery promises without assessment",
      deflectionMessage: "Project timelines depend on complexity, scope, and technical requirements. Our team can provide accurate timeline estimates after understanding your specific needs. Would you like to schedule a consultation to discuss your project in detail?"
    },
    {
      topic: "Guaranteed Outcomes",
      approach: "Focus on proven track record rather than guarantees",
      deflectionMessage: "While we can't guarantee specific outcomes without understanding your unique situation, we have a proven track record of delivering results for similar projects. Our team would be happy to share relevant case studies and discuss how we can help achieve your goals."
    },
    {
      topic: "Pricing Commitments",
      approach: "Provide ranges but require consultation for accurate pricing",
      deflectionMessage: "Our pricing depends on project scope, technical complexity, and specific requirements. We offer competitive rates and transparent pricing. Let's schedule a consultation so we can provide an accurate quote based on your needs."
    }
  ]
};

// Utility functions for sales conversations
export function getRelevantKnowledge(userQuery: string): {
  services: ServiceOffering[];
  markets: MarketSegment[];
  messages: SalesMessage[];
} {
  const query = userQuery.toLowerCase();
  
  const relevantServices = AUTIMIND_SALES_KNOWLEDGE.services.filter(service =>
    query.includes(service.service.toLowerCase()) ||
    service.keyFeatures.some(feature => query.includes(feature.toLowerCase())) ||
    service.targetMarket.toLowerCase().includes(query)
  );

  const relevantMarkets = AUTIMIND_SALES_KNOWLEDGE.targetMarkets.filter(market =>
    query.includes(market.industry.toLowerCase()) ||
    market.specificNeeds.some(need => query.includes(need.toLowerCase()))
  );

  const relevantMessages = AUTIMIND_SALES_KNOWLEDGE.successMessages.filter(msg =>
    query.includes('price') || query.includes('cost') || query.includes('budget') ? msg.scenario === 'Budget Inquiry' :
    query.includes('technical') || query.includes('capability') ? msg.scenario === 'Technical Capabilities' :
    query.includes('industry') ? msg.scenario === 'Industry Expertise' :
    msg.scenario === 'ROI and Business Value'
  );

  return { services: relevantServices, markets: relevantMarkets, messages: relevantMessages };
}

export function getPricingInfo(serviceType?: string): PricingInfo | PricingInfo[] {
  if (serviceType) {
    const pricing = AUTIMIND_SALES_KNOWLEDGE.pricingGuidelines.find(p => 
      p.service.toLowerCase().includes(serviceType.toLowerCase())
    );
    return pricing || AUTIMIND_SALES_KNOWLEDGE.pricingGuidelines[0];
  }
  return AUTIMIND_SALES_KNOWLEDGE.pricingGuidelines;
}

export function getComplianceGuidance(topic: string): ComplianceGuideline | null {
  return AUTIMIND_SALES_KNOWLEDGE.legalCompliance.find(guideline =>
    topic.toLowerCase().includes(guideline.topic.toLowerCase())
  ) || null;
}

export function getTeamCredibility(): TeamMember[] {
  return AUTIMIND_SALES_KNOWLEDGE.team;
}

export function getCompetitiveAdvantages(): string[] {
  return AUTIMIND_SALES_KNOWLEDGE.competitiveAdvantages;
}

export default AUTIMIND_SALES_KNOWLEDGE;