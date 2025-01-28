import React, { useState } from 'react';
import { 
  Microscope, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Filter 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Comprehensive interface for soil test request
interface SoilTestRequest {
  _id: string;
  source: string;
  land: string;
  farmer: string;
  agent?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  desiredTestComponents: string[];
  additionalNotes?: string;
  requestDate: string;
  createdAt: string;
  updatedAt: string;
}

interface SoilTestRequestsProps {
  requests: SoilTestRequest[];
  onRequestDetails?: (request: SoilTestRequest) => void;
}

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const RequestsList: React.FC<SoilTestRequestsProps> = ({ 
  requests, 
  onRequestDetails 
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  // Filter requests based on status
  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(request => request.status === filter);

  const toggleRequestExpand = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
        <Microscope className="w-24 h-24 text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">No Soil Test Requests</p>
        <p className="text-sm text-gray-500 mt-2">No requests have been made yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All Requests
          </button>
          {['pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === status 
                  ? `${getStatusColor(status)} font-semibold` 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <Filter className="w-5 h-5 text-gray-600" />
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <div 
            key={request._id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div className="p-5">
              {/* Request Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <Microscope className="w-5 h-5 mr-2 text-green-600" />
                    {request.source}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Request ID: {request._id.slice(-6)}
                  </p>
                </div>

                {/* Status Badge */}
                <span 
                  className={`px-3 py-1 rounded-full text-xs uppercase ${getStatusColor(request.status)}`}
                >
                  {request.status}
                </span>
              </div>

              {/* Test Components */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Test Components:
                </p>
                <div className="flex flex-wrap gap-2">
                  {request.desiredTestComponents.map((component) => (
                    <span 
                      key={component} 
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>

              {/* Request Dates */}
              <div className="space-y-2 border-t pt-3 mt-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-green-600" />
                  Request Date: {new Date(request.requestDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  Last Updated: {new Date(request.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Expandable Details */}
              {expandedRequest === request._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-700">
                    <FileText className="w-4 h-4 inline-block mr-2 text-gray-600" />
                    {request.additionalNotes || 'No additional notes'}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <Link 
                 to={`/land-tests/${request._id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  View Details
                </Link>
                 
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestsList;