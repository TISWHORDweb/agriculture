import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Camera,
  MapPin,
  Crop,
  Layers,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import UserService from "../../api/user.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import nigeriaStates from '../../../nigerian_states_tbl.json';
import nigeriaLga from '../../../lga_tbl.json';

const CreateLand = ({ onClose }) => {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longtitude, setLongtitude] = useState(0);
  const [landState, setLandState] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const userService = new UserService();
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [filteredLgas, setFilteredLgas] = useState([]);

  useEffect(() => {
    const statesData = nigeriaStates || [];
    setStates(statesData);

    const lgasData = nigeriaLga || [];
    setLgas(lgasData);
  }, []);

  useEffect(() => {
    if (landState) {
      const filtered = lgas.filter((lga) => lga.state === landState);
      setFilteredLgas(filtered);
    } else {
      setFilteredLgas([]);
    }
  }, [landState, lgas]);

  const handleInputChange = (field, value, nestedField) => {
    setFormData((prev) => {
      if (nestedField) {
        return {
          ...prev,
          [field]: {
            ...(prev[field] || {}),
            [nestedField]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });

    // Clear error when field is updated
    if (errors[field] || errors[`${field}.${nestedField}`]) {
      const newErrors = { ...errors };
      if (nestedField) {
        delete newErrors[`${field}.${nestedField}`];
      } else {
        delete newErrors[field];
      }
      setErrors(newErrors);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return null;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadPreset = "Emmanuel";

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dq5nc6lbr/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            upload_preset: uploadPreset,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        image: response.data.secure_url,
      }));

      // Clear image error if exists
      if (errors.image) {
        const newErrors = { ...errors };
        delete newErrors.image;
        setErrors(newErrors);
      }

      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      setErrors(prev => ({ ...prev, image: "Image upload failed" }));
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Land name is required";
    }
    
    if (!landState) {
      newErrors["location.state"] = "State is required";
    }
    
    if (!formData.totalArea?.value) {
      newErrors["totalArea.value"] = "Total area is required";
    }
    
    if (!formData.totalArea?.unit) {
      newErrors["totalArea.unit"] = "Area unit is required";
    }
    
    if (!formData.landType) {
      newErrors.landType = "Land type is required";
    }
    
    if (!formData.landOwnership) {
      newErrors.landOwnership = "Land ownership is required";
    }
    
    if (!formData.image) {
      newErrors.image = "Land image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await userService.land({
        ...formData,
        location: {
          state: landState,
          coordinates: { latitude, longtitude },
          ...formData.location
        },
        image: formData.image,
      });

      if (!response.status) {
        toast.error(response?.message);
        return;
      }

      toast.success("Land added successfully");
      window.location.reload();
    } catch (error) {
      setError(
        error.response?.data?.message || "Submission failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-2xl mx-auto max-h-[85vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Layers className="mr-3 text-green-600" />
        Add New Land
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <AlertTriangle className="inline mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Land Image <span className="text-red-500">*</span>
          </label>
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
                  <p className="text-sm text-gray-600">Click to upload</p>
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

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>

        {/* Location Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter land name"
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-lg">
              <MapPin className="ml-3 text-green-600" />
              <select
                value={landState}
                onChange={(e) => setLandState(e.target.value)}
                className={`w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none ${
                  errors["location.state"] ? "border-red-300" : ""
                }`}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.title}>
                    {state.title}
                  </option>
                ))}
              </select>
            </div>
            {errors["location.state"] && (
              <p className="mt-1 text-sm text-red-600">{errors["location.state"]}</p>
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
              value={formData.location?.address || ""}
              onChange={(e) =>
                handleInputChange("location", e.target.value, "address")
              }
              placeholder="Enter address"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ward (Optional)
            </label>
            <input
              type="text"
              value={formData.location?.ward || ""}
              onChange={(e) =>
                handleInputChange("location", e.target.value, "ward")
              }
              placeholder="Enter ward"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LGA (Optional)
            </label>
            <select
              value={formData.location?.lga || ""}
              onChange={(e) =>
                handleInputChange("location", e.target.value, "lga")
              }
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              disabled={!landState}
            >
              <option value="">Select LGA</option>
              {filteredLgas.map((lga) => (
                <option key={lga.id} value={lga.title}>
                  {lga.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Coordinates */}
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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
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
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* Total Area and Land Type */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Area <span className="text-red-500">*</span>
            </label>
            <div className={`flex items-center rounded-lg border ${
              errors["totalArea.value"] || errors["totalArea.unit"] 
                ? "border-red-300" 
                : "border-gray-300"
            }`}>
              <Crop className="ml-3 text-green-600" />
              <input
                type="number"
                value={formData.totalArea?.value || ""}
                onChange={(e) =>
                  handleInputChange("totalArea", Number(e.target.value), "value")
                }
                placeholder="Area value"
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
              />
              <select
                value={formData.totalArea?.unit || ""}
                onChange={(e) =>
                  handleInputChange("totalArea", e.target.value, "unit")
                }
                className="bg-transparent border-l p-3 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Unit</option>
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="square meters">Square Meters</option>
              </select>
            </div>
            {errors["totalArea.value"] && (
              <p className="mt-1 text-sm text-red-600">{errors["totalArea.value"]}</p>
            )}
            {errors["totalArea.unit"] && (
              <p className="mt-1 text-sm text-red-600">{errors["totalArea.unit"]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.landType || ""}
              onChange={(e) => handleInputChange("landType", e.target.value)}
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${
                errors.landType ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select Land Type</option>
              <option value="agricultural">Agricultural</option>
              <option value="pasture">Pasture</option>
              <option value="orchard">Orchard</option>
              <option value="other">Other</option>
            </select>
            {errors.landType && (
              <p className="mt-1 text-sm text-red-600">{errors.landType}</p>
            )}
          </div>
        </div>

        {/* Land Ownership */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Land Ownership <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.landOwnership || ""}
            onChange={(e) => handleInputChange("landOwnership", e.target.value)}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none ${
              errors.landOwnership ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Select Land Ownership</option>
            <option value="owner">Owner</option>
            <option value="rented">Rented</option>
            <option value="other">Other</option>
          </select>
          {errors.landOwnership && (
            <p className="mt-1 text-sm text-red-600">{errors.landOwnership}</p>
          )}
        </div>

        {/* Current Crop (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Crop (Optional)
          </label>
          <input
            type="text"
            value={formData.currentCrop || ""}
            onChange={(e) => handleInputChange("currentCrop", e.target.value)}
            placeholder="Enter current crop"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
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