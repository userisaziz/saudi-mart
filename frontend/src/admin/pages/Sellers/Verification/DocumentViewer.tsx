import React from 'react'
import { useParams } from 'react-router-dom'

export default function VerificationDocumentViewer() {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Viewer</h1>
        <p className="text-gray-600">Review verification documents for application ID: {id}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Submitted Documents</h2>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-600 text-sm font-medium">PDF</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Commercial Registration</p>
                      <p className="text-xs text-gray-500">2.3 MB • PDF</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">IMG</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">National ID (Front)</p>
                      <p className="text-xs text-gray-500">1.8 MB • JPG</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">IMG</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">National ID (Back)</p>
                      <p className="text-xs text-gray-500">1.9 MB • JPG</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 text-sm font-medium">PDF</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Bank Statement</p>
                      <p className="text-xs text-gray-500">4.1 MB • PDF</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Document Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Document Preview</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Download
                  </button>
                  <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                    Print
                  </button>
                </div>
              </div>
              
              {/* Document Preview Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-2xl">📄</span>
                  </div>
                  <p className="text-gray-500">Select a document to preview</p>
                  <p className="text-sm text-gray-400 mt-1">Supported formats: PDF, JPG, PNG</p>
                </div>
              </div>
              
              {/* Verification Actions */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Document Verification</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                    Approve Document
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                    Reject Document
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm">
                    Request Resubmission
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}