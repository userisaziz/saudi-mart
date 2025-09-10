import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  DocumentIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  name: string;
  type: 'gst' | 'pan' | 'incorporation' | 'bank' | 'trade_license' | 'other';
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  expiryDate?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  verificationNotes?: string;
  version: number;
  isRequired: boolean;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'GST Registration Certificate',
    type: 'gst',
    fileName: 'GST_Certificate_2024.pdf',
    fileSize: 1024000,
    uploadDate: new Date('2024-02-15'),
    expiryDate: new Date('2025-02-15'),
    status: 'approved',
    version: 1,
    isRequired: true
  },
  {
    id: '2',
    name: 'PAN Card',
    type: 'pan',
    fileName: 'PAN_Card.pdf',
    fileSize: 512000,
    uploadDate: new Date('2024-02-10'),
    status: 'approved',
    version: 1,
    isRequired: true
  },
  {
    id: '3',
    name: 'Certificate of Incorporation',
    type: 'incorporation',
    fileName: 'Incorporation_Certificate.pdf',
    fileSize: 2048000,
    uploadDate: new Date('2024-02-08'),
    status: 'pending',
    verificationNotes: 'Document quality is poor. Please upload a clearer scan.',
    version: 1,
    isRequired: true
  },
  {
    id: '4',
    name: 'Bank Statement',
    type: 'bank',
    fileName: 'Bank_Statement_Jan2024.pdf',
    fileSize: 3072000,
    uploadDate: new Date('2024-02-01'),
    status: 'expired',
    expiryDate: new Date('2024-03-01'),
    version: 1,
    isRequired: false
  }
];

const documentTypes = [
  { value: 'gst', label: 'GST Registration Certificate', required: true },
  { value: 'pan', label: 'PAN Card', required: true },
  { value: 'incorporation', label: 'Certificate of Incorporation', required: true },
  { value: 'bank', label: 'Bank Statement', required: false },
  { value: 'trade_license', label: 'Trade License', required: false },
  { value: 'other', label: 'Other Document', required: false },
];

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: Partial<Document>, file: File) => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [selectedType, setSelectedType] = useState<Document['type']>('gst');
  const [documentName, setDocumentName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      if (!documentName) {
        const typeLabel = documentTypes.find(t => t.value === selectedType)?.label || 'Document';
        setDocumentName(typeLabel);
      }
    }
  }, [selectedType, documentName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile || !documentName) return;

    const newDocument: Partial<Document> = {
      name: documentName,
      type: selectedType,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      uploadDate: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      status: 'pending',
      version: 1,
      isRequired: documentTypes.find(t => t.value === selectedType)?.required || false
    };

    onUpload(newDocument, uploadedFile);
    onClose();
    
    // Reset form
    setDocumentName('');
    setExpiryDate('');
    setUploadedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type *
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as Document['type']);
                const typeLabel = documentTypes.find(t => t.value === e.target.value)?.label || '';
                setDocumentName(typeLabel);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} {type.required && '(Required)'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name *
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File *
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {uploadedFile ? (
                <div>
                  <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    {isDragActive
                      ? 'Drop the file here...'
                      : 'Drag & drop a file here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!uploadedFile || !documentName}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onDelete: (id: string) => void;
  onReupload: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDelete,
  onReupload
}) => {
  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'expired':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'expired':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      default:
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    }
  };

  const isExpiringSoon = document.expiryDate && 
    new Date(document.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <DocumentIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
            <p className="text-sm text-gray-500">{document.fileName}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
              <span>v{document.version}</span>
              <span>Uploaded {document.uploadDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {document.isRequired && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Required
            </span>
          )}
          {getStatusIcon(document.status)}
        </div>
      </div>

      <div className="space-y-3">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
        </div>

        {document.expiryDate && (
          <div className="flex items-center space-x-2 text-sm">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className={isExpiringSoon ? 'text-orange-600' : 'text-gray-600'}>
              Expires: {document.expiryDate.toLocaleDateString()}
              {isExpiringSoon && ' (Expiring Soon)'}
            </span>
          </div>
        )}

        {document.verificationNotes && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{document.verificationNotes}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={() => onView(document)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
            >
              <EyeIcon className="w-4 h-4" />
              <span>View</span>
            </button>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1">
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Download</span>
            </button>
            {document.status === 'rejected' || document.status === 'expired' ? (
              <button
                onClick={() => onReupload(document)}
                className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center space-x-1"
              >
                <DocumentDuplicateIcon className="w-4 h-4" />
                <span>Re-upload</span>
              </button>
            ) : null}
          </div>
          <button
            onClick={() => onDelete(document.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProfileDocuments: React.FC = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'required' | 'pending' | 'approved' | 'expired'>('all');

  const handleUpload = (newDocument: Partial<Document>, file: File) => {
    const document: Document = {
      id: Date.now().toString(),
      ...newDocument
    } as Document;
    
    setDocuments(prev => [...prev, document]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    }
  };

  const handleView = (document: Document) => {
    // In real app, this would open the document in a modal or new tab
    console.log('Viewing document:', document);
  };

  const handleReupload = (document: Document) => {
    // In real app, this would open upload modal with pre-filled data
    setShowUploadModal(true);
  };

  const filteredDocuments = documents.filter(doc => {
    switch (filter) {
      case 'required':
        return doc.isRequired;
      case 'pending':
        return doc.status === 'pending';
      case 'approved':
        return doc.status === 'approved';
      case 'expired':
        return doc.status === 'expired' || (doc.expiryDate && new Date(doc.expiryDate) < new Date());
      default:
        return true;
    }
  });

  const documentStats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    required: documents.filter(d => d.isRequired).length,
    expired: documents.filter(d => d.status === 'expired').length,
  };

  const requiredDocuments = documentTypes.filter(type => type.required);
  const missingRequired = requiredDocuments.filter(type => 
    !documents.some(doc => doc.type === type.value && doc.status === 'approved')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Upload and manage your business verification documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-50">
              <DocumentIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-semibold text-gray-900">{documentStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-50">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{documentStats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-50">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{documentStats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-50">
              <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Required</p>
              <p className="text-2xl font-semibold text-gray-900">{documentStats.required}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-orange-50">
              <ExclamationTriangleIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-semibold text-gray-900">{documentStats.expired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Required Documents Alert */}
      {missingRequired.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Missing Required Documents</h3>
              <p className="text-sm text-red-700 mt-1">
                You need to upload the following required documents: {missingRequired.map(doc => doc.label).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All Documents' },
              { key: 'required', label: 'Required' },
              { key: 'approved', label: 'Approved' },
              { key: 'pending', label: 'Pending' },
              { key: 'expired', label: 'Expired' },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onView={handleView}
            onDelete={handleDelete}
            onReupload={handleReupload}
          />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Upload your first document to get started'
              : `No documents match the "${filter}" filter`
            }
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Document
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default ProfileDocuments;