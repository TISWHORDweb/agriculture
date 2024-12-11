import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

// Define the schema with the necessary fields
const landSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.object({
    state: z.string().min(2, 'State is required'),
    address: z.string().optional(),
    ward: z.string().optional(),
    lga: z.string().optional(),
    coordinates: z.object({
      latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
      longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
    }).optional(),
  }),
  image: z.string().min(2, 'Image URL is required'),
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

const CreateLand: React.FC<CreateLandProps> = ({ onClose }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LandFormData>({
    resolver: zodResolver(landSchema),
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET!);  // Use environment variable for Cloudinary upload preset

      const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`, formData);

      if (response.status === 200) {
        setImageUrl(response.data.secure_url); // Set the Cloudinary image URL
        setLoading(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
      alert('Image upload failed. Please try again.');
    }
  };

  const onSubmit = async (data: LandFormData) => {
    if (!imageUrl) {
      alert('Please upload an image before submitting.');
      return;
    }

    const landData = {
      ...data,
      image: imageUrl,  // Use the URL from Cloudinary
      location: {
        ...data.location,
        coordinates: {
          latitude: data.location.coordinates?.latitude,
          longitude: data.location.coordinates?.longitude,
        },
      },
    };

    try {
      const response = await axios.post('/api/lands', landData);
      if (response.status === 200) {
        console.log('Land created successfully:', response.data);
        onClose(); // Close the form after successful creation
      }
    } catch (error) {
      console.error('Error creating land:', error);
      alert('There was an error creating the land. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Land Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Land Name
        </label>
        <input
          {...register('name')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Location (State, Address, Ward, LGA, Coordinates) */}
      <div>
        <label htmlFor="location.state" className="block text-sm font-medium text-gray-700">
          State
        </label>
        <input
          {...register('location.state')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.location?.state && <p className="mt-1 text-sm text-red-600">{errors.location.state.message}</p>}
      </div>

      <div>
        <label htmlFor="location.address" className="block text-sm font-medium text-gray-700">
          Address (Optional)
        </label>
        <input
          {...register('location.address')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Upload Land Image
        </label>
        <input
          type="file"
          onChange={handleImageUpload}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {loading && <p className="mt-2 text-sm text-gray-600">Uploading image...</p>}
        {imageUrl && <p className="mt-2 text-sm text-green-600">Image uploaded successfully!</p>}
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
      </div>

      {/* Total Area and Unit */}
      <div className="flex gap-4">
        <div className="w-2/3">
          <label htmlFor="totalArea.value" className="block text-sm font-medium text-gray-700">
            Total Area (Value)
          </label>
          <input
            {...register('totalArea.value')}
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
          />
          {errors.totalArea?.value && (
            <p className="mt-1 text-sm text-red-600">{errors.totalArea.value.message}</p>
          )}
        </div>
        <div className="w-1/3">
          <label htmlFor="totalArea.unit" className="block text-sm font-medium text-gray-700">
            Unit
          </label>
          <select
            {...register('totalArea.unit')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
          >
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
            <option value="square meters">Square Meters</option>
          </select>
          {errors.totalArea?.unit && (
            <p className="mt-1 text-sm text-red-600">{errors.totalArea.unit.message}</p>
          )}
        </div>
      </div>

      {/* Land Type */}
      <div>
        <label htmlFor="landType" className="block text-sm font-medium text-gray-700">
          Land Type
        </label>
        <select
          {...register('landType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        >
          <option value="agricultural">Agricultural</option>
          <option value="pasture">Pasture</option>
          <option value="orchard">Orchard</option>
          <option value="other">Other</option>
        </select>
        {errors.landType && <p className="mt-1 text-sm text-red-600">{errors.landType.message}</p>}
      </div>

      {/* Current Crop */}
      <div>
        <label htmlFor="currentCrop" className="block text-sm font-medium text-gray-700">
          Current Crop (Optional)
        </label>
        <input
          {...register('currentCrop')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Add Land
        </button>
      </div>
    </form>
  );
};

export default CreateLand;
