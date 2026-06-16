/**
 * Application Constants and Configuration
 */

// API Base URL - use environment variable or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  analyze: '/api/analyze',
  optimize: '/api/analyze/optimize',
  library: '/api/library',
  contexts: '/api/contexts',
  settings: '/api/settings',
  tags: '/api/library/tags/all',
};

// Severity levels with colors
export const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    badgeColor: 'bg-red-100 text-red-800',
  },
  important: {
    label: 'Important',
    color: 'amber',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  'nice-to-have': {
    label: 'Nice to Have',
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
};

// PROMPT Framework categories
export const PROMPT_CATEGORIES = {
  Purpose: {
    label: 'Purpose & Objective',
    description: 'Clear task definition and goals',
    color: 'purple',
    icon: '🎯',
  },
  Role: {
    label: 'Role & Context',
    description: 'Persona and domain expertise',
    color: 'blue',
    icon: '👤',
  },
  Organization: {
    label: 'Organization & Structure',
    description: 'Clear formatting and hierarchy',
    color: 'green',
    icon: '📋',
  },
  Model_Guidance: {
    label: 'Model Guidance',
    description: 'Examples and techniques',
    color: 'indigo',
    icon: '🧠',
  },
  Precision: {
    label: 'Precision & Clarity',
    description: 'Specific, unambiguous language',
    color: 'cyan',
    icon: '🎨',
  },
  Testing: {
    label: 'Testing & Safety',
    description: 'Edge cases and guardrails',
    color: 'orange',
    icon: '🛡️',
  },
};

// Score ranges
export const SCORE_RANGES = {
  excellent: { min: 80, max: 100, label: 'Excellent', color: 'green' },
  good: { min: 60, max: 79, label: 'Good', color: 'blue' },
  fair: { min: 40, max: 59, label: 'Fair', color: 'amber' },
  poor: { min: 0, max: 39, label: 'Needs Work', color: 'red' },
};

// Get score range label and color
export const getScoreInfo = (score) => {
  for (const [key, range] of Object.entries(SCORE_RANGES)) {
    if (score >= range.min && score <= range.max) {
      return range;
    }
  }
  return SCORE_RANGES.poor;
};

// Prompt length limits
export const PROMPT_LIMITS = {
  min: 10,
  max: 10000,
  recommended: { min: 50, max: 500 },
};

// Default tags for prompts
export const DEFAULT_TAGS = [
  'Content Creation',
  'Code Generation',
  'Data Analysis',
  'Summarization',
  'Translation',
  'Creative Writing',
  'Technical',
  'Business',
  'Educational',
  'Research',
];

// File upload settings
export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['.txt', '.md', '.json', '.csv'],
  acceptedMimeTypes: [
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv',
  ],
};

// Animation durations (ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Local storage keys
export const STORAGE_KEYS = {
  recentPrompts: 'prompt_engineer_recent_prompts',
  userSettings: 'prompt_engineer_user_settings',
  draftPrompt: 'prompt_engineer_draft',
};
