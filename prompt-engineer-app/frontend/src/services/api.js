/**
 * API Service Layer
 * Handles all backend communication using Axios
 * Falls back to mockApi in DEMO mode (no backend)
 */
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';
import * as mockApi from './mockApi';

// Check if we're in demo mode (backend not available)
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('[API Error]', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('[API No Response]', error.request);
    } else {
      // Error in request setup
      console.error('[API Setup Error]', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Analyze API
 */
export const analyzePrompt = async (prompt, contextId = null) => {
  // Use mock API in demo mode
  if (DEMO_MODE) {
    return mockApi.analyzePrompt(prompt, contextId);
  }

  try {
    const response = await api.post(API_ENDPOINTS.analyze, {
      prompt,
      context_id: contextId,
    });
    return response.data;
  } catch (error) {
    // Fallback to mock if backend unavailable
    console.warn('Backend unavailable, using demo mode');
    return mockApi.analyzePrompt(prompt, contextId);
  }
};

export const optimizePrompt = async (prompt, answers, contextId = null) => {
  if (DEMO_MODE) {
    return mockApi.optimizePrompt(prompt, answers, contextId);
  }

  try {
    const response = await api.post(API_ENDPOINTS.optimize, {
      prompt,
      answers,
      context_id: contextId,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using demo mode');
    return mockApi.optimizePrompt(prompt, answers, contextId);
  }
};

/**
 * Library API
 */
export const savePromptToLibrary = async (promptData) => {
  if (DEMO_MODE) {
    return mockApi.savePromptToLibrary(promptData);
  }

  try {
    const response = await api.post(API_ENDPOINTS.library, promptData);
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using demo mode');
    return mockApi.savePromptToLibrary(promptData);
  }
};

export const getLibrary = async (tags = null, search = null) => {
  if (DEMO_MODE) {
    return mockApi.getLibrary(tags, search);
  }

  try {
    const params = {};
    if (tags) params.tags = Array.isArray(tags) ? tags.join(',') : tags;
    if (search) params.search = search;

    const response = await api.get(API_ENDPOINTS.library, { params });
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using demo mode');
    return mockApi.getLibrary(tags, search);
  }
};

export const getPromptById = async (promptId) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.library}/${promptId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch prompt'
    );
  }
};

export const updatePrompt = async (promptId, promptData) => {
  try {
    const response = await api.put(
      `${API_ENDPOINTS.library}/${promptId}`,
      promptData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to update prompt'
    );
  }
};

export const deletePrompt = async (promptId) => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.library}/${promptId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to delete prompt'
    );
  }
};

export const getAllTags = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.tags);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch tags'
    );
  }
};

/**
 * Context API
 */
export const uploadContext = async (name, file) => {
  if (DEMO_MODE) {
    return mockApi.uploadContext(name, file);
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      `${API_ENDPOINTS.contexts}?name=${encodeURIComponent(name)}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using demo mode');
    return mockApi.uploadContext(name, file);
  }
};

export const getContexts = async () => {
  if (DEMO_MODE) {
    return mockApi.getContexts();
  }

  try {
    const response = await api.get(API_ENDPOINTS.contexts);
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using demo mode');
    return mockApi.getContexts();
  }
};

export const deleteContext = async (contextName) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.contexts}/${encodeURIComponent(contextName)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to delete context'
    );
  }
};

/**
 * Health Check
 */
export const checkHealth = async () => {
  if (DEMO_MODE) {
    return mockApi.checkHealth();
  }

  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, using demo mode');
    return mockApi.checkHealth();
  }
};

export default api;
