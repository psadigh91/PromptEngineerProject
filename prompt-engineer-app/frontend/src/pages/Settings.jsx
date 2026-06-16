/**
 * Settings Page
 * Manage context files and application preferences
 */
import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Upload,
  Trash2,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import ContextUpload from '../components/ContextUpload';
import { getContexts, uploadContext, deleteContext } from '../services/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('contexts');
  const [contexts, setContexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getContexts();
      setContexts(result.contexts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const name = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      await uploadContext(name, file);
      setSuccess('Context file uploaded successfully!');
      await loadContexts();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (contextName) => {
    if (!window.confirm(`Delete context "${contextName}"?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await deleteContext(contextName);
      setSuccess('Context deleted successfully!');
      await loadContexts();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-gray-600">
              Manage context files and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex space-x-1 rounded-xl bg-gray-100 p-1">
        <button
          onClick={() => setActiveTab('contexts')}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'contexts'
              ? 'bg-white text-indigo-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Context Files
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'general'
              ? 'bg-white text-indigo-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          General
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start space-x-3 rounded-xl border-2 border-green-200 bg-green-50 p-4">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start space-x-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Context Files Tab */}
      {activeTab === 'contexts' && (
        <div className="space-y-6">
          {/* Upload section */}
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Upload Context File
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Context files help the analyzer understand your specific domain,
              guidelines, or requirements. Upload documentation, style guides, or
              example prompts.
            </p>
            <ContextUpload onUpload={handleUpload} disabled={uploading} />
          </div>

          {/* Context list */}
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Uploaded Contexts
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : contexts.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-3 font-medium text-gray-900">
                  No context files uploaded
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Upload files above to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {contexts.map((context) => (
                  <div
                    key={context.name}
                    className="flex items-center justify-between rounded-lg border-2 border-gray-200 bg-gray-50 p-4 transition-all hover:border-indigo-300 hover:bg-white"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {context.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(context.size)} • Uploaded{' '}
                          {formatDate(context.created_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(context.name)}
                      className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete context"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900">
              💡 How Context Files Work
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>
                  Context files are loaded during prompt analysis to provide
                  domain-specific insights
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>
                  Upload company style guides, technical documentation, or example
                  prompts
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>
                  Supported formats: .txt, .md, .json, .csv (max 5MB per file)
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <span>
                  Context helps generate more relevant recommendations and
                  optimizations
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              General Settings
            </h2>
            <p className="text-gray-600">
              General settings coming soon. Future features will include:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-indigo-500">•</span>
                <span>Default prompt analysis preferences</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-500">•</span>
                <span>Export/import library data</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-500">•</span>
                <span>Custom tags management</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-500">•</span>
                <span>API key configuration for external AI services</span>
              </li>
            </ul>
          </div>

          {/* About section */}
          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-purple-900">
              About PromptPro
            </h3>
            <p className="mt-2 text-sm text-purple-800">
              Version 1.0.0
            </p>
            <p className="mt-4 text-sm text-purple-700">
              PromptPro uses the PROMPT framework to analyze and optimize AI
              prompts. Our systematic approach evaluates six key dimensions:
              Purpose, Role, Organization, Model Guidance, Precision, and Testing.
            </p>
            <div className="mt-4 flex space-x-4">
              <button className="text-sm font-medium text-purple-900 underline hover:text-purple-700">
                Documentation
              </button>
              <button className="text-sm font-medium text-purple-900 underline hover:text-purple-700">
                GitHub
              </button>
              <button className="text-sm font-medium text-purple-900 underline hover:text-purple-700">
                Report Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
