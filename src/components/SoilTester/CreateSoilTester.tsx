import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ChevronDown, Check } from 'lucide-react';
import axios from 'axios';
import baseUrl from '../../hook/Network';
import { toast } from 'react-toastify';

// Types
interface Land {
  _id: string;
  name: string;
}

const testComponents = [
  'pH',
  'nutrient levels',
  'organic matter',
  'soil texture',
  'nitrogen',
  'phosphorus',
  'potassium',
  'calcium',
  'magnetism',
  'iron',
  'manganese',
  'boron',
  'copper',
  'zinc',
  'cec',
  'organic ma',
  'heavy metals'
] as const;

type TestComponent = typeof testComponents[number];

const soilTesterSchema = z.object({
  landId: z.string().min(1, 'Please select a land'),
  additionalNotes: z.string().min(2, 'Additional notes must be at least 2 characters'),
  desiredTestComponents: z.array(z.string()).min(1, 'Please select at least one test component')
});

type SoilTesterFormData = z.infer<typeof soilTesterSchema>;

interface CreateSoilTesterProps {
  onClose: () => void;
}

const CreateSoilTester: React.FC<CreateSoilTesterProps> = ({ onClose }) => {
  const [lands, setLands] = useState<Land[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<TestComponent[]>([]);
  const [isComponentsDropdownOpen, setIsComponentsDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<SoilTesterFormData>({
    resolver: zodResolver(soilTesterSchema)
  });

  const base_url = baseUrl()

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const storedUser = localStorage.getItem('authToken');
      const response = await axios.get(`${base_url}/farmer/lands`, {
        headers: {
          Authorization: `Bearer ${storedUser}`,
        },
      });
      setLands(response.data.data);
    } catch (err) {
      console.error('Error fetching lands:', err);
      setError("Failed to fetch lands. Please try again.");
    }
  };

  const toggleComponent = (component: TestComponent) => {
    setSelectedComponents(prev => {
      const newSelection = prev.includes(component)
        ? prev.filter(c => c !== component)
        : [...prev, component];
      setValue('desiredTestComponents', newSelection);
      return newSelection;
    });
  };

  const onSubmit = async (data: SoilTesterFormData) => {
    try {
      setIsLoading(true);
      const storedUser = localStorage.getItem('authToken');
      
      const payload = {
        desiredTestComponents: selectedComponents,
        additionalNotes: data.additionalNotes
      };

      const response = await axios.post(
        `${base_url}/farmer/land/${data.landId}/test-request`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      if(!response.status){
        toast.error(response.message)
        return;
      }
      toast.success("Test request created successfully")
      setTimeout(()=>{
        window.location.reload();
      },1000)
      onClose();
    } catch (err) {
      console.error('Error creating test request:', err);
      setError("Failed to create test request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Soil Test Request</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Land Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Land
            </label>
            <select
              {...register('landId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            >
              <option value="">Select a land...</option>
              {lands.map((land) => (
                <option key={land._id} value={land._id}>
                  {land.name}
                </option>
              ))}
            </select>
            {errors.landId && (
              <p className="mt-1 text-sm text-red-600">{errors.landId.message}</p>
            )}
          </div>

          {/* Test Components Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Components
            </label>
            <button
              type="button"
              onClick={() => setIsComponentsDropdownOpen(!isComponentsDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-left flex justify-between items-center"
            >
              <span>{selectedComponents.length ? `${selectedComponents.length} selected` : 'Select components...'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isComponentsDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {testComponents.map((component) => (
                  <div
                    key={component}
                    onClick={() => toggleComponent(component)}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                      selectedComponents.includes(component) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {selectedComponents.includes(component) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span>{component}</span>
                  </div>
                ))}
              </div>
            )}
            {errors.desiredTestComponents && (
              <p className="mt-1 text-sm text-red-600">{errors.desiredTestComponents.message}</p>
            )}
          </div>

          {/* Selected Components Tags */}
          {selectedComponents.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedComponents.map((component) => (
                <div
                  key={component}
                  className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  <span>{component}</span>
                  <button
                    type="button"
                    onClick={() => toggleComponent(component)}
                    className="hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              {...register('additionalNotes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
              placeholder="Enter any additional notes..."
            />
            {errors.additionalNotes && (
              <p className="mt-1 text-sm text-red-600">{errors.additionalNotes.message}</p>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSoilTester;