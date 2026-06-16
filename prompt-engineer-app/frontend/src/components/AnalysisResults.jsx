/**
 * Analysis Results Component
 * Displays comprehensive prompt analysis with scores, issues, and recommendations
 */
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  Target,
} from 'lucide-react';
import { SEVERITY_CONFIG, PROMPT_CATEGORIES, getScoreInfo } from '../utils/constants';

const AnalysisResults = ({ analysis }) => {
  if (!analysis) return null;

  const { strengths, issues, missing_info, recommended_techniques, score, overall_score } =
    analysis;

  const scoreInfo = getScoreInfo(overall_score);

  // Score color mapping
  const getScoreColor = (categoryScore) => {
    if (categoryScore >= 8) return 'text-green-600';
    if (categoryScore >= 6) return 'text-blue-600';
    if (categoryScore >= 4) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (categoryScore) => {
    if (categoryScore >= 8) return 'bg-green-500';
    if (categoryScore >= 6) return 'bg-blue-500';
    if (categoryScore >= 4) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Overall Score Card */}
      <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
            <p className="mt-1 text-sm text-gray-600">
              Based on the PROMPT framework analysis
            </p>
          </div>
          <div className="text-right">
            <div className={`text-5xl font-bold ${scoreInfo.color === 'green' ? 'text-green-600' : scoreInfo.color === 'blue' ? 'text-blue-600' : scoreInfo.color === 'amber' ? 'text-amber-600' : 'text-red-600'}`}>
              {overall_score}
            </div>
            <div className={`mt-1 text-sm font-medium ${scoreInfo.color === 'green' ? 'text-green-600' : scoreInfo.color === 'blue' ? 'text-blue-600' : scoreInfo.color === 'amber' ? 'text-amber-600' : 'text-red-600'}`}>
              {scoreInfo.label}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              scoreInfo.color === 'green'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : scoreInfo.color === 'blue'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                : scoreInfo.color === 'amber'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}
            style={{ width: `${overall_score}%` }}
          />
        </div>
      </div>

      {/* Category Scores */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
        <div className="mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Dimension Scores
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(score).map(([key, value]) => {
            const category = PROMPT_CATEGORIES[key];
            if (!category) return null;

            return (
              <div key={key} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{category.icon}</span>
                      <h4 className="font-medium text-gray-900">
                        {category.label}
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      {category.description}
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(value)}`}>
                    {value}
                    <span className="text-sm text-gray-400">/10</span>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full transition-all duration-700 ${getScoreBarColor(value)}`}
                    style={{ width: `${value * 10}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths */}
      {strengths && strengths.length > 0 && (
        <div className="rounded-2xl bg-green-50 p-6 shadow-lg border border-green-200">
          <div className="mb-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Strengths ({strengths.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 rounded-lg bg-white/50 p-3"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span className="text-sm text-green-900">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {issues && issues.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
          <div className="mb-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Issues & Recommendations ({issues.length})
            </h3>
          </div>
          <div className="space-y-3">
            {issues.map((issue, index) => {
              const severityConfig = SEVERITY_CONFIG[issue.severity];

              return (
                <div
                  key={index}
                  className={`rounded-lg border-2 ${severityConfig.borderColor} ${severityConfig.bgColor} p-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${severityConfig.badgeColor}`}>
                          {severityConfig.label}
                        </span>
                        <span className="text-xs font-medium text-gray-600">
                          {issue.category}
                        </span>
                      </div>
                      <p className={`mt-2 font-medium ${severityConfig.textColor}`}>
                        {issue.message}
                      </p>
                      <div className="mt-3 flex items-start space-x-2 rounded-md bg-white/70 p-3">
                        <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-700">
                            Recommendation:
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {issue.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Missing Information */}
      {missing_info && missing_info.length > 0 && (
        <div className="rounded-2xl bg-blue-50 p-6 shadow-lg border border-blue-200">
          <div className="mb-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">
              Missing Information ({missing_info.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {missing_info.map((info, index) => (
              <li
                key={index}
                className="flex items-start space-x-3 rounded-lg bg-white/50 p-3"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                <span className="text-sm text-blue-900">{info}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Techniques */}
      {recommended_techniques && recommended_techniques.length > 0 && (
        <div className="rounded-2xl bg-purple-50 p-6 shadow-lg border border-purple-200">
          <div className="mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">
              Recommended Techniques
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {recommended_techniques.map((technique, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 rounded-lg bg-white/50 p-4 border border-purple-200"
              >
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">
                  {technique}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
