import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, MapPin, Crop, Layers, AlertTriangle } from 'lucide-react';
import { z } from 'zod';
import axios from 'axios';
import UserService from '../../api/user.service';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Updated Zod Schema to match Mongoose model
const landSchema = z.object({
  farmer: z.string(), // Mongoose ObjectId as string
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.object({
    state: z.string().min(2, 'State is required'),
    address: z.string().optional(),
    ward: z.string().optional(),
    lga: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().optional(),
      longtitude: z.number().optional(),
    }).optional(),
  }),
  image: z.string(), // URL from Cloudinary
  totalArea: z.object({
    value: z.number().positive('Total area must be positive'),
    unit: z.enum(['acres', 'hectares', 'square meters']),
  }),
  landType: z.enum(['agricultural', 'pasture', 'orchard', 'other']),
  currentCrop: z.string().optional(),
});

type LandFormData = z.infer<typeof landSchema>;

interface CreateLandProps {
  onClose: () => void;
}

const CreateLand: React.FC<CreateLandProps> = ({ 
  onClose 
}) => {

  const [formData, setFormData] = useState<Partial<LandFormData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longtitude, setLongtitude] = useState(0);
  const [landState, setLandState] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null); // For error messages
  const userService = new UserService();
  const navigate = useNavigate();

  const handleInputChange = (
    field: string, 
    value: string | number, 
    nestedField?: string
  ) => {
    setFormData(prev => {
      if (nestedField) {
        return {
          ...prev,
          [field]: {
            ...(prev[field as keyof LandFormData] as object),
            [nestedField]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return null;
  
    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  
    setImageFile(file);
    setUploadProgress(0);
  
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      // Use your custom upload preset, or ensure your default preset is whitelisted for unsigned uploads.
      const uploadPreset = "Emmanuel"; // Make sure this is whitelisted in Cloudinary settings.
  
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dq5nc6lbr/upload`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            upload_preset: uploadPreset, // Replace with your custom preset if necessary
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
  
      // Update form data with image URL
      setFormData(prev => ({
        ...prev,
        image: response.data.secure_url
      }));
  
      return response.data.secure_url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("response");
    // Validate form

    try {
        console.log("in");
      const response = await userService.land({
        ...formData,
        location:{
            state: landState,
            coordinates:{latitude,longtitude}},
        image: formData.image! 
      });
      console.log(response);
      if (!response.status) {
        toast.error(response?.message);
        return;
      }

      toast.success(response?.message);
      localStorage.setItem("authToken", response.data.token);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Layers className="mr-3 text-green-600" />
        Add New Land
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-32 rounded-lg border-2 border-dashed border-green-300 flex items-center justify-center cursor-pointer hover:bg-green-50 transition"
          >
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Land Preview" 
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto text-green-600 mb-2" />
                <p className="text-sm text-gray-600">Upload Image</p>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            hidden 
          />

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Location Section with Additional Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Name
            </label>
            <div className="flex items-center border rounded-lg">
              <input 
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter land name"
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <div className="flex items-center border rounded-lg">
              <MapPin className="ml-3 text-green-600" />
              <input 
                type="text"
                value={landState}
              onChange={(e) => setLandState(e.target.value)}
                placeholder="Enter state"
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            {errors['location.state'] && (
              <p className="text-red-500 text-xs mt-1">{errors['location.state']}</p>
            )}
          </div>
        </div>

        {/* Additional Location Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address (Optional)
            </label>
            <input 
              type="text"
              value={formData.location?.address || ''}
              onChange={(e) => handleInputChange('location', e.target.value, 'address')}
              placeholder="Enter address"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ward (Optional)
            </label>
            <input 
              type="text"
              value={formData.location?.ward || ''}
              onChange={(e) => handleInputChange('location', e.target.value, 'ward')}
              placeholder="Enter ward"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LGA (Optional)
            </label>
            <input 
              type="text"
              value={formData.location?.lga || ''}
              onChange={(e) => handleInputChange('location', e.target.value, 'lga')}
              placeholder="Enter LGA"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* Coordinates (Optional) */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude (Optional)
            </label>
            <input 
              type="number"
              step="0.000001"
              value={latitude}
              onChange={(e) => setLatitude(Number(e.target.value))}
              placeholder="Enter latitude"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude (Optional)
            </label>
            <input 
              type="number"
              step="0.000001"
              value={longtitude}
              onChange={(e) => setLongtitude(Number(e.target.value))}
              placeholder="Enter longitude"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* Total Area and Land Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Area
            </label>
            <div className="flex items-center border rounded-lg">
              <Crop className="ml-3 text-green-600" />
              <input 
                type="number"
                value={formData.totalArea?.value || ''}
                onChange={(e) => handleInputChange('totalArea', Number(e.target.value), 'value')}
                placeholder="Area value"
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
              />
              <select
                value={formData.totalArea?.unit || ''}
                onChange={(e) => handleInputChange('totalArea', e.target.value, 'unit')}
                className="bg-transparent border-l p-3 focus:ring-2 focus:ring-green-500"
              >
                <option value="">Unit</option>
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="square meters">Square Meters</option>
              </select>
            </div>
            {errors['totalArea.value'] && (
              <p className="text-red-500 text-xs mt-1">{errors['totalArea.value']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Type
            </label>
            <select
              value={formData.landType || ''}
              onChange={(e) => handleInputChange('landType', e.target.value)}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Land Type</option>
              <option value="agricultural">Agricultural</option>
              <option value="pasture">Pasture</option>
              <option value="orchard">Orchard</option>
              <option value="other">Other</option>
            </select>
            {errors.landType && (
              <p className="text-red-500 text-xs mt-1">{errors.landType}</p>
            )}
          </div>
        </div>

        {/* Current Crop (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Crop (Optional)
          </label>
          <input 
            type="text"
            value={formData.currentCrop || ''}
            onChange={(e) => handleInputChange('currentCrop', e.target.value)}
            placeholder="Enter current crop"
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between space-x-4 mt-6">
          <button 
            type="button" 
            onClick={onClose}
            className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Add Land
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLand;