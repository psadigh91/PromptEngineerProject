/**
 * Question Flow Component
 * Interactive one-question-at-a-time UI for gathering user input
 */
import { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const QuestionFlow = ({ questions, onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [customAnswer, setCustomAnswer] = useState('');

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleSelectExample = (example) => {
    const questionText = currentQuestion.question;
    setAnswers({ ...answers, [questionText]: example });
    setCustomAnswer('');
  };

  const handleCustomAnswer = (value) => {
    setCustomAnswer(value);
    const questionText = currentQuestion.question;
    setAnswers({ ...answers, [questionText]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCustomAnswer(answers[questions[currentQuestionIndex + 1].question] || '');
    } else {
      onComplete(answers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCustomAnswer(answers[questions[currentQuestionIndex - 1].question] || '');
    } else if (onBack) {
      onBack();
    }
  };

  const canProceed = answers[currentQuestion.question];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl bg-gradient-to-br from-white to-indigo-50 p-8 shadow-xl border-2 border-indigo-200">
        <div className="mb-6 flex items-start space-x-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <HelpCircle className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {currentQuestion.question}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {currentQuestion.why}
            </p>
          </div>
        </div>

        {/* Example options */}
        {currentQuestion.examples && currentQuestion.examples.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Select an option or provide your own:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {currentQuestion.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectExample(example)}
                  className={`rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                    answers[currentQuestion.question] === example
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {example}
                    </span>
                    {answers[currentQuestion.question] === example && (
                      <Check className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom answer input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or provide a custom answer:
          </label>
          <textarea
            value={customAnswer}
            onChange={(e) => handleCustomAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full rounded-lg border-2 border-gray-200 p-3 text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            rows={3}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="flex items-center space-x-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>{isFirstQuestion ? 'Back to Analysis' : 'Previous'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex items-center space-x-2 rounded-lg px-6 py-3 font-medium shadow-lg transition-all duration-200 ${
            canProceed
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl'
              : 'cursor-not-allowed bg-gray-300 text-gray-500'
          }`}
        >
          <span>{isLastQuestion ? 'Generate Optimized Prompt' : 'Next Question'}</span>
          {isLastQuestion ? (
            <Check className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Quick skip option */}
      {!isLastQuestion && (
        <div className="text-center">
          <button
            onClick={() => setCurrentQuestionIndex(questions.length - 1)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Skip to last question
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionFlow;
