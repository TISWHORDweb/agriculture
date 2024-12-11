import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSoilTesterStore } from '../../store/soil-tester-store';
import { X } from 'lucide-react';
import baseUrl from '../../hook/Network';
import axios from 'axios';

const soilTesterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  additionalNotes: z.string().min(2, 'Location must be at least 2 characters'),
});


type SoilTesterFormData = z.infer<typeof soilTesterSchema>;

interface CreateSoilTesterProps {
  onClose: () => void;
}

const CreateSoilTester: React.FC<CreateSoilTesterProps> = ({ onClose }) => {
 
  const [error, setError] = useState("");

  const base_url = baseUrl();

  const addSoilTester = useSoilTesterStore((state) => state.addSoilTester);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SoilTesterFormData>({
    resolver: zodResolver(soilTesterSchema),
  });

  

  const onSubmit = async (postData: SoilTesterFormData)  => {

    try {
      
    const storedUser = localStorage.getItem('authToken');
      console.log(`${base_url}/farmer/land/${postData.name}/test-request`);

      const body={additionalNotes:postData.additionalNotes};
      console.log(body);
      

      const response = await axios.post(`${base_url}/farmer/land/${postData.name}/test-request`,body, {
        headers: {
          "Authorization": `Bearer ${storedUser}`,
        },
      });
      console.log(response.data.data);
       
    } catch (err) {
      console.error('Error response:', err.response); 
      setError("Failed to save request. Please try again.");
    }
  
      window.location.reload();
     
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Farm
        </label>
        <input
          {...register('name')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Note
        </label>
        <input
          {...register('additionalNotes')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 h-10 py-2 px-2 text-base"
        />
        {errors.additionalNotes && (
          <p className="mt-1 text-sm text-red-600">{errors.additionalNotes.message}</p>
        )}
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
         Send Request
        </button>
      </div>
    </form>
  );
};

export default CreateSoilTester;