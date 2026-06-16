/**
 * Optimized Prompt Component
 * Shows before/after comparison with copy and save options
 */
import { useState } from 'react';
import { Copy, Check, Save, Download, ArrowRight } from 'lucide-react';

const OptimizedPrompt = ({ originalPrompt, optimizedPrompt, onSave }) => {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);

  const handleCopy = async (text, setIsCopied) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success message */}
      <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-2 border-green-200 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900">
              Optimization Complete!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Your prompt has been enhanced based on best practices
            </p>
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original Prompt */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Original Prompt
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() => handleCopy(originalPrompt, setCopiedOriginal)}
                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
                title="Copy original"
              >
                {copiedOriginal ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4 shadow-inner">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
              {originalPrompt}
            </pre>
          </div>
          <div className="text-xs text-gray-500">
            {originalPrompt.length} characters
          </div>
        </div>

        {/* Arrow indicator (hidden on mobile) */}
        <div className="hidden lg:flex lg:items-center lg:justify-center">
          <ArrowRight className="h-8 w-8 text-indigo-400" />
        </div>

        {/* Optimized Prompt */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              Optimized Prompt
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() => handleCopy(optimizedPrompt, setCopiedOptimized)}
                className="rounded-lg border border-indigo-300 bg-white p-2 text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:shadow"
                title="Copy optimized"
              >
                {copiedOptimized ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => handleDownload(optimizedPrompt, 'optimized-prompt.txt')}
                className="rounded-lg border border-indigo-300 bg-white p-2 text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 hover:shadow"
                title="Download optimized"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="rounded-xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 shadow-lg">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900">
              {optimizedPrompt}
            </pre>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {optimizedPrompt.length} characters
            </span>
            <span className="font-medium text-indigo-600">
              {optimizedPrompt.length > originalPrompt.length
                ? `+${optimizedPrompt.length - originalPrompt.length}`
                : `${optimizedPrompt.length - originalPrompt.length}`}{' '}
              characters
            </span>
          </div>
        </div>
      </div>

      {/* Full view side by side (for desktop) */}
      <div className="hidden xl:block">
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-lg">
          <h4 className="mb-4 text-lg font-semibold text-gray-900">
            Side-by-Side Comparison
          </h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700">Before</h5>
              <div className="rounded-lg bg-gray-50 p-4">
                <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700">
                  {originalPrompt}
                </pre>
              </div>
            </div>
            <div>
              <h5 className="mb-2 text-sm font-medium text-indigo-700">After</h5>
              <div className="rounded-lg bg-indigo-50 p-4">
                <pre className="whitespace-pre-wrap font-mono text-xs text-gray-900">
                  {optimizedPrompt}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {onSave && (
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            onClick={onSave}
            className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
          >
            <Save className="h-5 w-5" />
            <span>Save to Library</span>
          </button>
          <button
            onClick={() => handleCopy(optimizedPrompt, setCopiedOptimized)}
            className="flex flex-1 items-center justify-center space-x-2 rounded-lg border-2 border-indigo-300 bg-white px-6 py-4 font-semibold text-indigo-600 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:shadow"
          >
            {copiedOptimized ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span>Copy Optimized Prompt</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4 border border-purple-200">
        <p className="text-sm font-medium text-purple-900">
          💡 Pro Tip:
        </p>
        <p className="mt-1 text-sm text-purple-700">
          Test your optimized prompt in your AI application and compare results.
          You can always come back and refine it further!
        </p>
      </div>
    </div>
  );
};

export default OptimizedPrompt;
