/**
 * Prompt Card Component
 * Displays a saved prompt in the library with preview and actions
 */
import { useState } from 'react';
import { Calendar, Tag, Trash2, Eye, Copy, Check } from 'lucide-react';

const PromptCard = ({ prompt, onDelete, onClick }) => {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);

  const handleCopy = async (text, setIsCopied, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      onDelete(prompt.id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-lg"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="flex-1 text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
          {prompt.title}
        </h3>
        <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="rounded-lg p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600"
            title="Delete prompt"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Prompt previews */}
      <div className="space-y-3">
        {/* Original */}
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Original</span>
            <button
              onClick={(e) => handleCopy(prompt.original_prompt, setCopiedOriginal, e)}
              className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              title="Copy original"
            >
              {copiedOriginal ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-700">
            {truncateText(prompt.original_prompt)}
          </p>
        </div>

        {/* Optimized */}
        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-700">Optimized</span>
            <button
              onClick={(e) => handleCopy(prompt.optimized_prompt, setCopiedOptimized, e)}
              className="rounded p-1 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-700"
              title="Copy optimized"
            >
              {copiedOptimized ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-900">
            {truncateText(prompt.optimized_prompt)}
          </p>
        </div>
      </div>

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {prompt.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              +{prompt.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(prompt.created_at)}</span>
        </div>
        {prompt.context_id && (
          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
            Has Context
          </span>
        )}
      </div>
    </div>
  );
};

export default PromptCard;
