/**
 * Library Page
 * Browse, search, and filter saved prompts
 */
import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Loader2,
  BookOpen,
  Tag,
  X,
  AlertCircle,
} from 'lucide-react';
import PromptCard from '../components/PromptCard';
import { getLibrary, deletePrompt, getAllTags } from '../services/api';

const Library = () => {
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  useEffect(() => {
    loadLibrary();
    loadTags();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [prompts, searchQuery, selectedTags]);

  const loadLibrary = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getLibrary();
      setPrompts(result.prompts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const result = await getAllTags();
      setAllTags(result.tags || []);
    } catch (err) {
      console.error('Failed to load tags:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...prompts];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.original_prompt.toLowerCase().includes(query) ||
          p.optimized_prompt.toLowerCase().includes(query) ||
          (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter((p) =>
        p.tags && selectedTags.every((tag) => p.tags.includes(tag))
      );
    }

    setFilteredPrompts(filtered);
  };

  const handleDelete = async (promptId) => {
    try {
      await deletePrompt(promptId);
      await loadLibrary();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prompt Library</h1>
            <p className="mt-1 text-gray-600">
              Browse and manage your saved prompts
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 space-y-4 rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts by title, content, or tags..."
            className="w-full rounded-lg border-2 border-gray-200 py-3 pl-12 pr-4 text-gray-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Filter button and tags */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 rounded-lg border-2 px-4 py-2 font-medium transition-all ${
              showFilters || selectedTags.length > 0
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {selectedTags.length > 0 && (
              <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-xs text-white">
                {selectedTags.length}
              </span>
            )}
          </button>

          {selectedTags.length > 0 && (
            <>
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center space-x-1 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700"
                >
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 hover:text-indigo-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
              <h4 className="mb-3 font-medium text-gray-900">Filter by Tags</h4>
              {allTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-lg border-2 px-3 py-1.5 text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? 'border-indigo-500 bg-indigo-500 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No tags available. Save prompts with tags to filter by them.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredPrompts.length} of {prompts.length} prompt
            {prompts.length !== 1 ? 's' : ''}
          </span>
          {(searchQuery || selectedTags.length > 0) && (
            <button
              onClick={clearFilters}
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start space-x-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Error loading library</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={loadLibrary}
                className="mt-2 text-sm font-medium text-red-800 underline hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-gray-600">Loading your library...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && prompts.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            No prompts saved yet
          </h3>
          <p className="mt-2 text-gray-600">
            Start by analyzing and optimizing a prompt on the home page
          </p>
        </div>
      )}

      {/* No results state */}
      {!loading && prompts.length > 0 && filteredPrompts.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <Search className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            No prompts match your filters
          </h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your search or clearing filters
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 rounded-lg bg-indigo-500 px-6 py-2 font-medium text-white hover:bg-indigo-600"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Prompt grid */}
      {!loading && filteredPrompts.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onDelete={handleDelete}
              onClick={() => setSelectedPrompt(prompt)}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
          onClick={() => setSelectedPrompt(null)}
        >
          <div
            className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedPrompt.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Created {new Date(selectedPrompt.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {selectedPrompt.tags && selectedPrompt.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedPrompt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Original Prompt
                  </h3>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
                      {selectedPrompt.original_prompt}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Optimized Prompt
                  </h3>
                  <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900">
                      {selectedPrompt.optimized_prompt}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
