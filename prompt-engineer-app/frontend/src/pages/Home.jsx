/**
 * Home Page
 * Main prompt engineering workflow: input -> analyze -> questions -> optimize -> save
 */
import { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, RotateCcw } from 'lucide-react';
import PromptInput from '../components/PromptInput';
import AnalysisResults from '../components/AnalysisResults';
import QuestionFlow from '../components/QuestionFlow';
import OptimizedPrompt from '../components/OptimizedPrompt';
import { analyzePrompt, optimizePrompt, savePromptToLibrary } from '../services/api';
import { PROMPT_LIMITS } from '../utils/constants';

const WORKFLOW_STEPS = {
  INPUT: 'input',
  ANALYZING: 'analyzing',
  ANALYSIS: 'analysis',
  QUESTIONS: 'questions',
  OPTIMIZING: 'optimizing',
  OPTIMIZED: 'optimized',
};

const Home = () => {
  const [currentStep, setCurrentStep] = useState(WORKFLOW_STEPS.INPUT);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [error, setError] = useState(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveTags, setSaveTags] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!prompt || prompt.trim().length < PROMPT_LIMITS.min) {
      setError(`Prompt must be at least ${PROMPT_LIMITS.min} characters`);
      return;
    }

    if (prompt.length > PROMPT_LIMITS.max) {
      setError(`Prompt exceeds maximum length of ${PROMPT_LIMITS.max} characters`);
      return;
    }

    setError(null);
    setCurrentStep(WORKFLOW_STEPS.ANALYZING);

    try {
      const result = await analyzePrompt(prompt);
      setAnalysis(result.analysis);
      setCurrentStep(WORKFLOW_STEPS.ANALYSIS);
    } catch (err) {
      setError(err.message);
      setCurrentStep(WORKFLOW_STEPS.INPUT);
    }
  };

  const handleProceedToQuestions = () => {
    setCurrentStep(WORKFLOW_STEPS.QUESTIONS);
  };

  const handleBackToAnalysis = () => {
    setCurrentStep(WORKFLOW_STEPS.ANALYSIS);
  };

  const handleQuestionsComplete = async (answers) => {
    setCurrentStep(WORKFLOW_STEPS.OPTIMIZING);
    setError(null);

    try {
      const result = await optimizePrompt(prompt, answers);
      setOptimization(result.optimization);
      setCurrentStep(WORKFLOW_STEPS.OPTIMIZED);
    } catch (err) {
      setError(err.message);
      setCurrentStep(WORKFLOW_STEPS.QUESTIONS);
    }
  };

  const handleSavePrompt = () => {
    setSaveModalOpen(true);
  };

  const handleSaveConfirm = async () => {
    if (!saveTitle.trim()) {
      alert('Please enter a title for your prompt');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const tags = saveTags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await savePromptToLibrary({
        title: saveTitle,
        original_prompt: prompt,
        optimized_prompt: optimization.optimized_prompt,
        tags,
        analysis: analysis,
        optimization: optimization,
      });

      setSaveModalOpen(false);
      setSaveTitle('');
      setSaveTags('');
      alert('Prompt saved to library successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Start over? This will clear your current work.')) {
      setPrompt('');
      setAnalysis(null);
      setOptimization(null);
      setError(null);
      setCurrentStep(WORKFLOW_STEPS.INPUT);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center space-x-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 shadow-lg">
          <Sparkles className="h-6 w-6 text-white" />
          <h1 className="text-2xl font-bold text-white">AI Prompt Engineer</h1>
        </div>
        <p className="text-lg text-gray-600">
          Analyze, optimize, and perfect your AI prompts
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-200 sm:p-8">
        {/* Step: Input */}
        {currentStep === WORKFLOW_STEPS.INPUT && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Enter Your Prompt
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Paste or type the prompt you'd like to analyze and optimize
              </p>
            </div>

            <PromptInput value={prompt} onChange={setPrompt} />

            <button
              onClick={handleAnalyze}
              disabled={!prompt || prompt.length < PROMPT_LIMITS.min}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center justify-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span>Analyze Prompt</span>
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>
          </div>
        )}

        {/* Step: Analyzing */}
        {currentStep === WORKFLOW_STEPS.ANALYZING && (
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <Loader2 className="h-16 w-16 animate-spin text-indigo-600" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Analyzing Your Prompt...
              </h3>
              <p className="mt-2 text-gray-600">
                Evaluating against the PROMPT framework
              </p>
            </div>
          </div>
        )}

        {/* Step: Analysis Results */}
        {currentStep === WORKFLOW_STEPS.ANALYSIS && analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Analysis Results
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Review the findings and proceed to optimization
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Start Over</span>
              </button>
            </div>

            <AnalysisResults analysis={analysis} />

            {analysis.questions_to_ask && analysis.questions_to_ask.length > 0 && (
              <button
                onClick={handleProceedToQuestions}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Answer Questions & Optimize</span>
                  <ArrowRight className="h-5 w-5" />
                </span>
              </button>
            )}
          </div>
        )}

        {/* Step: Questions */}
        {currentStep === WORKFLOW_STEPS.QUESTIONS && analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Clarifying Questions
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Help us optimize your prompt with a few details
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Start Over</span>
              </button>
            </div>

            <QuestionFlow
              questions={analysis.questions_to_ask}
              onComplete={handleQuestionsComplete}
              onBack={handleBackToAnalysis}
            />
          </div>
        )}

        {/* Step: Optimizing */}
        {currentStep === WORKFLOW_STEPS.OPTIMIZING && (
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <Loader2 className="h-16 w-16 animate-spin text-indigo-600" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Generating Optimized Prompt...
              </h3>
              <p className="mt-2 text-gray-600">
                Applying best practices and your preferences
              </p>
            </div>
          </div>
        )}

        {/* Step: Optimized Result */}
        {currentStep === WORKFLOW_STEPS.OPTIMIZED && optimization && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your Optimized Prompt
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Compare and save your improved prompt
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Start Over</span>
              </button>
            </div>

            <OptimizedPrompt
              originalPrompt={prompt}
              optimizedPrompt={optimization.optimized_prompt}
              onSave={handleSavePrompt}
            />
          </div>
        )}
      </div>

      {/* Save modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900">
                Save to Library
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Add a title and tags to organize your prompt
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    placeholder="e.g., Blog Post Generator"
                    className="mt-1 w-full rounded-lg border-2 border-gray-200 p-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={saveTags}
                    onChange={(e) => setSaveTags(e.target.value)}
                    placeholder="e.g., content, marketing, creative"
                    className="mt-1 w-full rounded-lg border-2 border-gray-200 p-3 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setSaveModalOpen(false)}
                  disabled={saving}
                  className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfirm}
                  disabled={saving || !saveTitle.trim()}
                  className="flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 font-semibold text-white hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
