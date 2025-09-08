import React from 'react'

export default function VerificationComplianceCheck() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Check</h1>
        <p className="text-gray-600">Saudi Arabia regulatory compliance verification and monitoring</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Compliance Status Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">98%</p>
            <p className="text-sm text-gray-600">Compliance Rate</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">45</p>
            <p className="text-sm text-gray-600">Active Checks</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">3</p>
            <p className="text-sm text-gray-600">Pending Issues</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-red-600 text-xl">🚫</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">1</p>
            <p className="text-sm text-gray-600">Critical Issues</p>
          </div>
        </div>
      </div>
      
      {/* Compliance Checks Table */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Regulatory Compliance Checks</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                Run All Checks
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                Export Report
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Compliance Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Check</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Next Review</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">VAT Registration</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Tax Compliance</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Compliant
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">2024-01-20</td>
                  <td className="px-4 py-3 text-sm text-gray-500">2024-04-20</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800">Review</button>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">CITC License</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Telecom Compliance</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Review Required
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">2024-01-15</td>
                  <td className="px-4 py-3 text-sm text-gray-500">2024-02-15</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-orange-600 hover:text-orange-800">Action Required</button>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Data Protection Compliance</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Privacy</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Non-Compliant
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">2024-01-18</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Immediate</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-red-600 hover:text-red-800">Urgent Action</button>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500" colSpan={6}>
                    Additional compliance checks will be loaded here...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Compliance Guidelines */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Saudi Arabia Compliance Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Commercial Registration</h3>
              <p className="text-sm text-gray-600">All businesses must maintain valid CR with Ministry of Commerce</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">VAT Compliance</h3>
              <p className="text-sm text-gray-600">VAT registration required for revenue above SAR 375,000</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Labor Law</h3>
              <p className="text-sm text-gray-600">Compliance with Saudi Labor Law and Nitaqat program</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Data Protection</h3>
              <p className="text-sm text-gray-600">Adherence to Personal Data Protection Law (PDPL)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}