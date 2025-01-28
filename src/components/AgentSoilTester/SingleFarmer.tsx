import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import DashboardLayout from "../Layout/DashboardLayout";
import farm from "../../assets/images/pexels-photo-259280.jpeg";
import farmer from "../../assets/images/pexels-photo-916406.jpeg";
import axios from "axios";
import { User, MapPin, CheckCircle, XCircle, FileText } from "lucide-react";
import { toast } from "react-toastify";
import baseUrl from "../../hook/Network";
import { useNavigate } from 'react-router-dom';

const SingleFarmer = () => {
  const { id } = useParams();
  const decodedId = id;
  const base_url = baseUrl()
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    pH: "",
    nutrientLevels: "",
    organicMatter: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    calcium: "",
    magnetism: "",
    iron: "",
    manganese: "",
    boron: "",
    copper: "",
    zinc: "",
    cec: "",
    organicMa: "",
    heavyMetals: "",
    nutrients: {
      nitrogen: {
        level: "",
        interpretation: ""
      },
      phosphorus: {
        level: "",
        interpretation: ""
      },
      potassium: {
        level: "",
        interpretation: ""
      }
    },
    soilTexture: {
      sand: "",
      silt: "",
      clay: "",
      textureClass: ""
    },
    salinity: {
      electricalConductivity: "",
      interpretation: ""
    },
    recommendedCrops: [],
    additionalRecommendations: ""
  });

  const storedUser = localStorage.getItem('authToken');
  const fetchFarmerData = async () => {
    try {
    
      const response = await axios.get(
        `${base_url}/agent/test-request/${decodedId}`,
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      setFarmerData(response.data.data);
    } catch (err) {
      console.error("Error fetching farmer data:", err.response || err);
      setError("Failed to fetch farmer data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerData();
  }, [decodedId]);

const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: subChild ? {
            ...prev[parent][child],
            [subChild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleUpdateStatus = async (e) => {
    const { name, value } = e.target;
    setStatus(value);
    try {
      const res = await axios.patch(
        `${base_url}/agent/request/${decodedId}/${value}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      fetchFarmerData();
      toast.success("Request status updated successfully")
    } catch (err) {
      console.error("Error updating status:", err.response || err);
    }
  };

  const acceptRequest = async () => {
    setLoadingAcc(true);
    try {
      const res = await axios.patch(
        `${base_url}/agent/request/${decodedId}/assigned`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      fetchFarmerData();
      toast.success("Request Accepted")
      setTimeout(()=>{
        window.location.reload();
      },1000)
    } catch (err) {
      setLoadingAcc(false);
      console.error("Error accepting request:", err.response || err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${base_url}/agent/request/${decodedId}/result`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      toast.success("Result submitted successfully");
      setTimeout(()=>{
        navigate('/my-test');
      },1000)
    } catch (err) {
      console.error("Error submitting result:", err.response || err);
    }
  };

  if (loading) {
    return <DashboardLayout><p>Loading...</p></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><p className="text-red-500">{error}</p></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Farmer Header */}
        <div className="h-64 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${farm})` }}>
        </div>

        {/* Profile Section */}
        <div className="relative mt-[-40px] flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img src={farmer} alt="Farmer" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-semibold mt-3">{`${farmerData?.farmer?.profile?.firstName} ${farmerData?.farmer?.profile?.lastName}`}</h2>
          <p className="text-gray-500">
            <MapPin className="inline-block mr-1" /> {farmerData?.land?.location?.address}
          </p>
        </div>

        {/* Farmer Details */}
        <div className="mt-6 space-y-4 text-gray-700">
          <div className="flex justify-between items-center">
            <p>
              <strong>Land Size:</strong> {farmerData?.land?.totalArea?.value} {farmerData?.land?.totalArea?.unit}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`px-2 py-1 rounded-lg ${farmerData?.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                {farmerData?.status}
              </span>
            </p>
          </div>
          <div>
            <p><strong>Coordinates:</strong></p>
            <p>Latitude: {farmerData?.land?.location?.coordinates?.latitude}°</p>
            <p>Longitude: {farmerData?.land?.location?.coordinates?.longitude}°</p>
          </div>
          <div>
            <p><strong>Additional note:</strong></p>
            <p>{farmerData?.additionalNotes || "No additional notes"}</p>
          </div>

          {farmerData?.status === "pending" ? (
            <button
              onClick={acceptRequest}
              className="mt-4 text-white py-2 px-4 rounded-md bg-[#4ADE80] transition duration-300"
            >
              {loadingAcc ? "Processing..." : "Accept Request"}
            </button>
          ) : (
            <div>
              <select
                className="mt-4 border border-gray-300 rounded-md px-4 py-2 text-sm"
                onChange={handleUpdateStatus}
              >
                <option value="" disabled>
                  Update Status
                </option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        <hr className="my-6" />

        {/* Provide Test Result Section */}
        {farmerData?.status !== "pending" && (
          <div>
            <h2 className="text-2xl font-semibold">Provide Test Results</h2>
            <small className="text-gray-500">Fill in the test results for the assigned components below</small>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6" onSubmit={handleSubmit}>
              {/* Basic Measurements */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700">pH Level</label>
                <input
                  type="number"
                  step="0.1"
                  name="pH"
                  value={formData.pH}
                  onChange={handleChange}
                  placeholder="Enter pH level"
                  className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                />
              </div>

              {/* Simple String Inputs */}
              {['nutrientLevels', 'organicMatter', 'nitrogen', 'phosphorus', 'potassium', 'calcium', 'magnetism', 'iron', 'manganese', 'boron', 'copper', 'zinc', 'cec', 'heavyMetals'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
              ))}

              {/* Soil Texture */}
              {['sand', 'silt', 'clay', 'textureClass'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700">
                    Soil {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={`soilTexture.${field}`}
                    value={formData.soilTexture[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                  />
                </div>
              ))}

              {/* Salinity */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700">Electrical Conductivity</label>
                <input
                  type="number"
                  step="0.01"
                  name="salinity.electricalConductivity"
                  value={formData.salinity.electricalConductivity}
                  onChange={handleChange}
                  placeholder="Enter electrical conductivity"
                  className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700">Salinity Interpretation</label>
                <input
                  type="text"
                  name="salinity.interpretation"
                  value={formData.salinity.interpretation}
                  onChange={handleChange}
                  placeholder="Enter salinity interpretation"
                  className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                />
              </div>

              {/* Nutrient Interpretations */}
              {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => (
                <React.Fragment key={nutrient}>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">
                      {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} Level
                    </label>
                    <input
                      type="text"
                      name={`nutrients.${nutrient}.level`}
                      value={formData.nutrients[nutrient].level}
                      onChange={handleChange}
                      placeholder={`Enter ${nutrient} level`}
                      className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700">
                      {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} Interpretation
                    </label>
                    <input
                      type="text"
                      name={`nutrients.${nutrient}.interpretation`}
                      value={formData.nutrients[nutrient].interpretation}
                      onChange={handleChange}
                      placeholder={`Enter ${nutrient} interpretation`}
                      className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                    />
                  </div>
                </React.Fragment>
              ))}

              {/* Recommendations */}
              <div className="flex flex-col col-span-2">
                <label className="text-sm font-semibold text-gray-700">Recommended Crops (comma-separated)</label>
                <input
                  type="text"
                  name="recommendedCrops"
                  value={formData.recommendedCrops.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    recommendedCrops: e.target.value.split(',').map(crop => crop.trim())
                  }))}
                  placeholder="Enter recommended crops, separated by commas"
                  className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-semibold text-gray-700">Additional Recommendations</label>
                <textarea
                  name="additionalRecommendations"
                  value={formData.additionalRecommendations}
                  onChange={handleChange}
                  placeholder="Enter additional recommendations"
                  className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2 h-32"
                />
              </div>

              <button
                type="submit"
                className="col-span-2 mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
              >
                Submit Results
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SingleFarmer;
