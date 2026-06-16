/**
 * Mock API Service for Frontend-Only Deployment
 * Use this when backend is not available (demo/portfolio)
 */

// Simulated delay for realistic feel
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockAnalysis = {
  success: true,
  analysis: {
    original_prompt: '',
    strengths: [
      'Clear action verb present',
      'Question format encourages specific response',
    ],
    issues: [
      {
        severity: 'critical',
        category: 'Purpose',
        message: 'No clear output format specified',
        recommendation: 'Add explicit format requirements',
      },
      {
        severity: 'important',
        category: 'Role',
        message: 'No role or persona assigned',
        recommendation: "Consider: 'You are an expert in [domain]...'",
      },
    ],
    missing_info: [
      'Output format/structure not specified',
      'Length or size constraints not defined',
      'Target audience not specified',
    ],
    recommended_techniques: [
      'Output Structure Specification',
      'Persona Pattern - Assign specific expertise role',
      'Clear Syntax - Use XML tags or Markdown structure',
    ],
    score: {
      Purpose: 6,
      Role: 4,
      Organization: 5,
      Model_Guidance: 4,
      Precision: 6,
      Testing: 3,
    },
    overall_score: 47,
    questions_to_ask: [
      {
        question: 'What format should the output be in?',
        why: 'Format specification helps the model structure the response appropriately.',
        examples: ['Bullet points', 'Numbered list', 'Paragraph', 'Table', 'JSON'],
      },
      {
        question: 'What length should the output be?',
        why: 'Length constraints help balance detail vs. brevity.',
        examples: ['1-2 sentences', 'One paragraph (100-150 words)', '3-5 bullet points'],
      },
      {
        question: 'Who is the target audience?',
        why: 'Audience determines appropriate complexity and terminology.',
        examples: ['Beginners', 'Technical experts', 'General audience', 'Executives'],
      },
    ],
  },
};

const mockOptimization = {
  success: true,
  optimization: {
    optimized_prompt: `You are a content analyst helping executives make informed decisions.

Task: Analyze the following information and provide key insights.

Requirements:
- Length: 3-5 bullet points
- Format: Clear, actionable takeaways
- Tone: Professional and concise
- Focus: Business impact and recommendations

Output format:
• [Key insight 1]
• [Key insight 2]
• [Key insight 3]

Provide your analysis below:`,
    improvements: [
      {
        change: 'Added role assignment',
        rationale: 'Persona Pattern (Vanderbilt) - Assigning expertise improves response quality',
      },
      {
        change: 'Specified clear requirements',
        rationale: 'Clear constraints (Microsoft) - Helps model understand boundaries',
      },
      {
        change: 'Defined output format',
        rationale: 'Output Structure Specification (Anthropic) - Ensures consistent formatting',
      },
    ],
    techniques_applied: [
      'Persona Pattern (Vanderbilt)',
      'Clear Constraints (Microsoft Azure)',
      'Output Structure Specification (Anthropic)',
      'Instructions First (Microsoft Best Practice)',
    ],
    recommended_settings: {
      temperature: 0.3,
      reasoning: 'Lower temperature for factual/analytical tasks',
      model: 'claude-sonnet',
      model_reasoning: 'Sonnet for balanced speed and quality',
    },
    sources: [
      'Anthropic Claude Prompt Engineering Guidelines',
      'Microsoft Azure OpenAI Techniques',
      'Prompt Pattern Catalog (Vanderbilt University)',
    ],
  },
};

const mockLibrary = {
  success: true,
  count: 3,
  prompts: [
    {
      id: 1,
      title: 'Customer Email Response',
      original_prompt: 'Write an email to a customer',
      optimized_prompt: 'You are a customer service specialist...',
      tags: ['customer-service', 'email'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Code Review',
      original_prompt: 'Review this code',
      optimized_prompt: 'You are an experienced software engineer...',
      tags: ['code', 'review'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Data Analysis',
      original_prompt: 'Analyze this data',
      optimized_prompt: 'You are a data analyst...',
      tags: ['data', 'analysis'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

/**
 * Mock API Functions
 */

export const analyzePrompt = async (prompt, contextId = null) => {
  await delay(1500); // Simulate network delay
  return {
    ...mockAnalysis,
    analysis: {
      ...mockAnalysis.analysis,
      original_prompt: prompt,
    },
  };
};

export const optimizePrompt = async (prompt, answers, contextId = null) => {
  await delay(2000);
  return mockOptimization;
};

export const savePromptToLibrary = async (promptData) => {
  await delay(800);
  return {
    success: true,
    message: 'Prompt saved to library',
    id: Date.now(),
  };
};

export const getLibrary = async (tags = null, search = null) => {
  await delay(600);
  return mockLibrary;
};

export const getPromptById = async (promptId) => {
  await delay(500);
  const prompt = mockLibrary.prompts.find((p) => p.id === parseInt(promptId));
  return {
    success: true,
    prompt: prompt || mockLibrary.prompts[0],
  };
};

export const updatePrompt = async (promptId, promptData) => {
  await delay(800);
  return {
    success: true,
    message: 'Prompt updated',
  };
};

export const deletePrompt = async (promptId) => {
  await delay(500);
  return {
    success: true,
    message: 'Prompt deleted',
  };
};

export const getAllTags = async () => {
  await delay(400);
  return {
    success: true,
    tags: ['customer-service', 'email', 'code', 'review', 'data', 'analysis'],
  };
};

export const uploadContext = async (name, file) => {
  await delay(1000);
  return {
    success: true,
    message: 'Context uploaded successfully (Demo Mode)',
    context: {
      name: name,
      type: 'custom',
      filename: file.name,
    },
  };
};

export const getContexts = async () => {
  await delay(500);
  return {
    success: true,
    contexts: [
      {
        id: 1,
        name: 'Healthcare',
        type: 'industry',
        filename: 'healthcare.yaml',
        uploaded_at: new Date().toISOString(),
        is_active: false,
      },
      {
        id: 2,
        name: 'Finance',
        type: 'industry',
        filename: 'finance.yaml',
        uploaded_at: new Date().toISOString(),
        is_active: false,
      },
    ],
  };
};

export const deleteContext = async (contextName) => {
  await delay(500);
  return {
    success: true,
    message: `Context '${contextName}' deleted`,
  };
};

export const checkHealth = async () => {
  await delay(300);
  return {
    status: 'healthy',
    app: 'Prompt Engineer API (Demo Mode)',
    version: '1.0.0',
  };
};

export default {
  analyzePrompt,
  optimizePrompt,
  savePromptToLibrary,
  getLibrary,
  getPromptById,
  updatePrompt,
  deletePrompt,
  getAllTags,
  uploadContext,
  getContexts,
  deleteContext,
  checkHealth,
};
