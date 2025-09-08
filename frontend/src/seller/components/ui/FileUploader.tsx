import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon, CheckCircleIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  title?: string;
  description?: string;
}

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedTypes = ['.csv', '.xlsx', '.xls'],
  maxSize = 10,
  multiple = false,
  title = 'Upload Files',
  description = 'Drag & drop files here, or click to select files'
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const uploadedFile: UploadedFile = {
        file,
        progress: 0,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.file === file && f.status === 'uploading') {
            const newProgress = Math.min(f.progress + 10, 100);
            if (newProgress === 100) {
              clearInterval(interval);
              onFileUpload(file);
              return { ...f, progress: 100, status: 'completed' };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    multiple
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-xs text-gray-500 mt-2">
            Accepted formats: {acceptedTypes.join(', ')} (max {maxSize}MB)
          </p>
        </div>
      </div>

      {/* File Rejection Errors */}
      {fileRejections.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Upload errors:</h4>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} className="text-sm text-red-700">
              <span className="font-medium">{file.name}:</span>
              {errors.map(error => (
                <span key={error.code} className="ml-2">{error.message}</span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
          {uploadedFiles.map((uploadedFile, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {uploadedFile.status === 'uploading' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {uploadedFile.progress}%
                      </span>
                    </div>
                  )}
                  
                  {uploadedFile.status === 'completed' && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                  
                  {uploadedFile.status === 'error' && (
                    <div className="text-xs text-red-600">
                      Error: {uploadedFile.error}
                    </div>
                  )}
                  
                  <button
                    onClick={() => removeFile(uploadedFile.file)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};