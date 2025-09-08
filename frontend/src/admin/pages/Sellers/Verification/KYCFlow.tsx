import React from 'react'

export default function VerificationKYCFlow() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KYC Verification Flow</h1>
        <p className="text-gray-600">Manage Know Your Customer verification process for Saudi businesses</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* KYC Status Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <div className="w-6 h-6 bg-yellow-600 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900">23</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">156</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <div className="w-6 h-6 bg-red-600 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">7</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* KYC Applications Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">KYC Applications</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by company name or CR number..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>All Status</option>
                <option>Pending</option>
                <option>Verified</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">CR Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact Person</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Submitted</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Al-Raed Trading Co.</td>
                  <td className="px-4 py-3 text-sm text-gray-500">1010123456</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Ahmed Al-Mahmoud</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending Review
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">2024-01-15</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">Review</button>
                    <button className="text-gray-600 hover:text-gray-800">Documents</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500" colSpan={6}>
                    Additional KYC applications will be loaded here...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}