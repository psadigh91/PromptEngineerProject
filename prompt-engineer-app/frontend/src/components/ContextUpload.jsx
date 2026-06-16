/**
 * Context Upload Component
 * Drag & drop file upload for context files
 */
import { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';
import { FILE_UPLOAD } from '../utils/constants';

const ContextUpload = ({ onUpload, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > FILE_UPLOAD.maxSize) {
      return `File size exceeds ${FILE_UPLOAD.maxSize / 1024 / 1024}MB limit`;
    }

    // Check file type
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!FILE_UPLOAD.acceptedTypes.includes(extension)) {
      return `File type not supported. Accepted: ${FILE_UPLOAD.acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = (file) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile && onUpload) {
      onUpload(selectedFile);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          disabled
            ? 'cursor-not-allowed bg-gray-50 opacity-50'
            : isDragging
            ? 'border-indigo-500 bg-indigo-50 shadow-lg'
            : selectedFile
            ? 'border-green-300 bg-green-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          accept={FILE_UPLOAD.acceptedTypes.join(',')}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="space-y-3">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <div>
              <p className="font-medium text-green-900">File selected</p>
              <p className="mt-1 text-sm text-green-700">
                Click upload to add this context
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <div>
              <p className="font-medium text-red-900">Invalid file</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">
                Drop file here or click to browse
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Supports: {FILE_UPLOAD.acceptedTypes.join(', ')}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Max size: {FILE_UPLOAD.maxSize / 1024 / 1024}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected file info */}
      {selectedFile && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <File className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">{selectedFile.name}</p>
                <p className="text-sm text-green-700">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={disabled}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            Upload Context File
          </button>
        </div>
      )}

      {/* Help text */}
      <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
        <p className="text-sm font-medium text-blue-900">
          What are context files?
        </p>
        <p className="mt-1 text-sm text-blue-700">
          Context files help the analyzer understand domain-specific requirements,
          guidelines, or examples. Upload documentation, style guides, or example
          prompts to get more tailored recommendations.
        </p>
      </div>
    </div>
  );
};

export default ContextUpload;
