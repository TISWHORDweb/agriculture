import React from 'react'
import { AlertTriangle } from 'lucide-react';

function ErrorModel() {
  return (
    <div>  <div className="bg-white shadow-xl rounded-lg p-6 max-w-2xl mx-auto flex items-center justify-center">
    <div className="text-center">
      <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold text-gray-800 mb-2">User Not Found</h2>
      <p className="text-gray-600 mb-4">Please log in to add a land</p>
      <button 
        onClick={()=>window.location.href ="/"}
        className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Close
      </button>
    </div>
  </div></div>
  )
}

export default ErrorModel