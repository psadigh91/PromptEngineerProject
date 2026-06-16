/**
 * Prompt Input Component
 * Textarea with character count and helpful hints
 */
import { FileText, AlertCircle } from 'lucide-react';
import { PROMPT_LIMITS } from '../utils/constants';

const PromptInput = ({ value, onChange, placeholder, disabled = false }) => {
  const charCount = value?.length || 0;
  const isOverLimit = charCount > PROMPT_LIMITS.max;
  const isBelowRecommended = charCount > 0 && charCount < PROMPT_LIMITS.recommended.min;
  const isAboveRecommended = charCount > PROMPT_LIMITS.recommended.max;

  const getCharCountColor = () => {
    if (isOverLimit) return 'text-red-600';
    if (isAboveRecommended) return 'text-amber-600';
    if (isBelowRecommended) return 'text-blue-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter your prompt here...\n\nExample: 'Create a summary of...' or 'You are an expert in...'"}
          disabled={disabled}
          className={`w-full rounded-xl border-2 p-4 pr-12 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
            isOverLimit
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
          } ${disabled ? 'cursor-not-allowed bg-gray-50' : 'bg-white'}`}
          rows={8}
          style={{ resize: 'vertical', minHeight: '200px' }}
        />
        <div className="absolute right-4 top-4">
          <FileText className="h-5 w-5 text-gray-300" />
        </div>
      </div>

      {/* Character count and hints */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {isBelowRecommended && charCount > 0 && (
            <div className="flex items-start space-x-2 rounded-lg bg-blue-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
              <p className="text-xs text-blue-700">
                Consider adding more detail. Prompts with 50+ characters tend to perform better.
              </p>
            </div>
          )}
          {isAboveRecommended && !isOverLimit && (
            <div className="flex items-start space-x-2 rounded-lg bg-amber-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <p className="text-xs text-amber-700">
                Long prompt detected. Consider breaking it into sections for clarity.
              </p>
            </div>
          )}
          {isOverLimit && (
            <div className="flex items-start space-x-2 rounded-lg bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
              <p className="text-xs text-red-700">
                Prompt exceeds maximum length of {PROMPT_LIMITS.max.toLocaleString()} characters.
              </p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <div className={`text-right text-sm font-medium ${getCharCountColor()}`}>
            {charCount.toLocaleString()} / {PROMPT_LIMITS.max.toLocaleString()}
          </div>
          {charCount > 0 && !isOverLimit && (
            <div className="mt-1 text-right text-xs text-gray-400">
              {charCount >= PROMPT_LIMITS.recommended.min &&
              charCount <= PROMPT_LIMITS.recommended.max
                ? '✓ Optimal length'
                : 'characters'}
            </div>
          )}
        </div>
      </div>

      {/* Quick tips */}
      {charCount === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Quick Tips:</p>
          <ul className="space-y-1 text-xs text-gray-600">
            <li className="flex items-start space-x-2">
              <span className="text-indigo-500">•</span>
              <span>Start with a clear action verb (create, analyze, summarize)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-500">•</span>
              <span>Specify the desired output format and length</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-500">•</span>
              <span>Include context about your audience and purpose</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-500">•</span>
              <span>Add examples when possible to guide the model</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PromptInput;
