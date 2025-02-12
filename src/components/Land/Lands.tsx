import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Crop, 
  Image as ImageIcon, 
  Tractor, 
  Trees,
  MoreVertical 
} from 'lucide-react';

// Assuming you'll pass in the lands data as a prop
interface LandData {
  _id: string;
  name: string;
  image?: string;
  location: {
    state: string;
    address?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    }
  };
  totalArea: {
    value: number;
    unit: 'acres' | 'hectares' | 'square meters';
  };
  landType: 'agricultural' | 'pasture' | 'orchard' | 'other';
  currentCrop?: string;
}

interface FarmerLandsProps {
  lands: LandData[];
}

const getLandTypeIcon = (landType: string) => {
  switch(landType) {
    case 'agricultural': return <Tractor className="w-5 h-5 text-green-600" />;
    case 'pasture': return <Trees className="w-5 h-5 text-green-600" />;
    case 'orchard': return <Trees className="w-5 h-5 text-lime-600" />;
    default: return <Layers className="w-5 h-5 text-gray-600" />;
  }
};

const FarmerLandsDisplay: React.FC<FarmerLandsProps> = ({ lands }) => {
  const [selectedLand, setSelectedLand] = useState<string | null>(null);

  const handleLandDetails = (landId: string) => {
    setSelectedLand(selectedLand === landId ? null : landId);
  };

  if (lands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
        <ImageIcon className="w-24 h-24 text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">No Lands Added Yet</p>
        <p className="text-sm text-gray-500 mt-2">Start by adding your first land</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lands.map((land) => (
        <div 
          key={land._id} 
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        >
          {/* Land Image */}
          <div className="relative h-48 overflow-hidden">
            {land.image ? (
              <img 
                src={land.image} 
                alt={land.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-500" />
              </div>
            )}
            
            {/* Options Dropdown */}
            <button 
              onClick={() => handleLandDetails(land._id)}
              className="absolute top-3 right-3 bg-white/70 rounded-full p-2 hover:bg-white transition"
            >
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Land Details */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{land.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-2 text-green-600" />
                  {land.location.state}
                </div>
              </div>

              <div className="flex items-center bg-green-100 rounded-full px-3 py-1">
                {getLandTypeIcon(land.landType)}
                <span className="ml-2 text-xs text-green-800 capitalize">
                  {land.landType}
                </span>
              </div>
            </div>

            {/* Land Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <Crop className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Total Area</p>
                <p className="font-semibold text-sm">
                  {land.totalArea.value} {land.totalArea.unit}
                </p>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <Trees className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Current Crop</p>
                <p className="font-semibold text-sm">
                  {land.currentCrop || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedLand === land._id && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                  <p className="text-sm text-gray-700">
                    {land.location.address || 'No address provided'}
                  </p>
                </div>
                {land.location.coordinates?.latitude && land.location.coordinates?.longitude && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                    <p className="text-sm text-gray-700">
                      Coordinates: {land.location.coordinates.latitude}, {land.location.coordinates.longitude}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FarmerLandsDisplay;