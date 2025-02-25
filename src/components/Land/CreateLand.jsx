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
import nigeriaLga from '../../../lga_tbl.json'; // Import the JSON file

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
  const [error, setError] = useState(null); // For error messages
  const userService = new UserService();
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [filteredLgas, setFilteredLgas] = useState([]);

  useEffect(() => {
    // Extract states from the JSON data
    const statesData = nigeriaStates || [];
    setStates(statesData);

    // Extract LGAs from the JSON data
    const lgasData = nigeriaLga || [];
    setLgas(lgasData);
  }, []);

  useEffect(() => {
    // Filter LGAs based on the selected state
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

      // Use your custom upload preset, or ensure your default preset is whitelisted for unsigned uploads.
      const uploadPreset = "Emmanuel"; // Make sure this is whitelisted in Cloudinary settings.

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dq5nc6lbr/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
      setFormData((prev) => ({
        ...prev,
        image: response.data.secure_url,
      }));

      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("response");
    // Validate form

    try {
      console.log("in");
      const response = await userService.land({
        ...formData,
        location: {
          state: landState,
          coordinates: { latitude, longtitude },
        },
        image: formData.image,
      });
      console.log(response);
      if (!response.status) {
        toast.error(response?.message);
        return;
      }

      toast.success(response?.message);
      window.location.reload();
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-2xl mx-auto max-h-[85vh] overflow-y-auto">
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
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
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
              <select
                value={landState}
                onChange={(e) => setLandState(e.target.value)}
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
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
              <p className="text-red-500 text-xs mt-1">
                {errors["location.state"]}
              </p>
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
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
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
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
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
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 outline-none"
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
                value={formData.totalArea?.value || ""}
                onChange={(e) =>
                  handleInputChange(
                    "totalArea",
                    Number(e.target.value),
                    "value"
                  )
                }
                placeholder="Area value"
                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-green-500 outline-none"
              />
              <select
                value={formData.totalArea?.unit || ""}
                onChange={(e) =>
                  handleInputChange("totalArea", e.target.value, "unit")
                }
                className="bg-transparent border-l p-3 focus:ring-2 focus:ring-green-500"
              >
                <option value="">Unit</option>
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="square meters">Square Meters</option>
              </select>
            </div>
            {errors["totalArea.value"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["totalArea.value"]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Land Type
            </label>
            <select
              value={formData.landType || ""}
              onChange={(e) => handleInputChange("landType", e.target.value)}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Land Ownership
          </label>
          <select
            value={formData.landOwnership || ""}
            onChange={(e) => handleInputChange("landOwnership", e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Land Ownership</option>
            <option value="owner">Owner</option>
            <option value="rented">Rented</option>
            <option value="other">Other</option>
          </select>
          {errors.landOwnership && (
            <p className="text-red-500 text-xs mt-1">{errors.landOwnership}</p>
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