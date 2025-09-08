import React from 'react'
import { useParams } from 'react-router-dom'

export default function ProductsReview() {
  const { id } = useParams<{ id: string }>()
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Review</h1>
        <p className="text-gray-600">Review and moderate product listing (ID: {id})</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  Product details will be loaded here...
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md min-h-24">
                  Product description will be loaded here...
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">SAR 0.00</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">Category name</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Review Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Review Actions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Review Status</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option>Pending Review</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Needs Modification</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Review Notes</label>
                <textarea 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Add review comments..."
                />
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Approve Product
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  Reject Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}