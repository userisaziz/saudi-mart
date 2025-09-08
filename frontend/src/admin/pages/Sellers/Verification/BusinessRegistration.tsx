import React from 'react'

export default function VerificationBusinessRegistration() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Registration Verification</h1>
        <p className="text-gray-600">Verify and validate Saudi business registration details</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Verification Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">CR Verification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Commercial Registration Number</label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter CR number (e.g., 1010123456)"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                    Verify
                  </button>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Verification Status</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Ready to verify CR number with Ministry of Commerce database</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Registration Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Registration Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name (Arabic)</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md text-right">
                    شركة الرائد التجارية
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name (English)</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    Al-Raed Trading Company
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">CR Issue Date</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    1443/05/12 هـ
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CR Expiry Date</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    1453/05/12 هـ
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Activity</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  Wholesale and retail trade in electronics and accessories
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Legal Form</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  Limited Liability Company
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Registration History */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Verifications</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by CR number..."
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>All Status</option>
                <option>Verified</option>
                <option>Failed</option>
                <option>Expired</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">CR Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Verification Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Verified By</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">1010123456</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Al-Raed Trading Co.</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">Admin User</td>
                  <td className="px-4 py-3 text-sm text-gray-500">2024-01-20 14:30</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">View Details</button>
                    <button className="text-gray-600 hover:text-gray-800">Re-verify</button>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">1010789012</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Modern Tech Solutions</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Verification Failed
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">Admin User</td>
                  <td className="px-4 py-3 text-sm text-gray-500">2024-01-19 16:15</td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-orange-600 hover:text-orange-800 mr-2">Retry</button>
                    <button className="text-gray-600 hover:text-gray-800">Details</button>
                  </td>
                </tr>
                
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-500" colSpan={6}>
                    Additional verification records will be loaded here...
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