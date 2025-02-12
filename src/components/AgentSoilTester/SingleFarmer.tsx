import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import farm from "../../assets/images/pexels-photo-259280.jpeg";
import farmer from "../../assets/images/pexels-photo-916406.jpeg";
import axios from "axios";
import { User, MapPin, CheckCircle, XCircle, FileText } from "lucide-react";
import { toast } from "react-toastify";
import baseUrl from "../../hook/Network";
import { useNavigate } from "react-router-dom";

const SingleFarmer = () => {
  const { id } = useParams();
  const decodedId = id;
  const base_url = baseUrl();
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    pH: "",
    available: "",
    organicMatter: "",
    exchangeable: "",
    cn: "",
    calcium: "",
    magnesium: "",
    iron: "",
    manganese: "",
    boron: "",
    copper: "",
    zinc: "",
    cec: "",
    totalNitrogen: "",
    soilTexture: "",
    comment: {
      preplanting: "",
      planting: "",
      topDressUrea: "",
      topDressMOP: "",
    },
    recommendedCrops: [],
    additionalRecommendations: "",
  });

  const [riceRecommendation, setRiceRecommendation] = useState({
    crop: "RICE",
    preplanting: {
      input: "MANURE/COMPOST **",
      kgPerHa: "",
      bagsPerHa: "",
    },
    planting: {
      input: "NPK (15.15.15)",
      kgPerHa: "",
      bagsPerHa: "",
    },
    topDressUrea: {
      input: "Urea",
      kgPerHa: "",
      bagsPerHa: "",
    },
    topDressMOP: {
      input: "MOP",
      kgPerHa: "",
      bagsPerHa: "",
    },
  });

  const [maizeRecommendation, setMaizeRecommendation] = useState({
    crop: "MAIZE",
    preplanting: {
      input: "MANURE/COMPOST **",
      kgPerHa: "",
      bagsPerHa: "",
    },
    planting: {
      input: "NPK (15.15.15)",
      kgPerHa: "",
      bagsPerHa: "",
    },
    topDressUrea: {
      input: "Urea",
      kgPerHa: "",
      bagsPerHa: "",
    },
    topDressMOP: {
      input: "MOP",
      kgPerHa: "",
      bagsPerHa: "",
    },
  });

  const storedUser = localStorage.getItem("authToken");

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
    if (name.includes(".")) {
      const [parent, child, subChild] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: subChild
            ? {
                ...prev[parent][child],
                [subChild]: value,
              }
            : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRecommendationChange = (e, stage, crop) => {
    const { name, value } = e.target;
    if (crop === "RICE") {
      setRiceRecommendation((prev) => ({
        ...prev,
        [stage]: {
          ...prev[stage],
          [name]: value,
        },
      }));
    } else if (crop === "MAIZE") {
      setMaizeRecommendation((prev) => ({
        ...prev,
        [stage]: {
          ...prev[stage],
          [name]: value,
        },
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
      toast.success("Request status updated successfully");
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
      toast.success("Request Accepted");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setLoadingAcc(false);
      console.error("Error accepting request:", err.response || err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit the soil test result
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
      const resultId = res.data.data._id; // Get the created result ID

      // Create recommendations for Rice and Maize
      await createRecommendations(resultId, [
        riceRecommendation,
        maizeRecommendation,
      ]);

      setTimeout(() => {
        navigate("/my-test");
      }, 1000);
    } catch (err) {
      console.error("Error submitting result:", err.response || err);
    }
  };

  const createRecommendations = async (resultId, recommendations) => {
    try {
      const recommendationsWithResultId = recommendations.map((rec) => ({
        ...rec,
        resultId: resultId,
      }));
      await axios.post(
        `${base_url}/agent/recommendations`,
        recommendationsWithResultId,
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      // toast.success("Recommendations created successfully");
    } catch (err) {
      console.error("Error creating recommendations:", err.response || err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">{error}</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Farmer Header */}
        <div
          className="h-64 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${farm})` }}
        ></div>

        {/* Profile Section */}
        <div className="relative mt-[-40px] flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={farmer}
              alt="Farmer"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold mt-3">{`${farmerData?.farmer?.profile?.firstName} ${farmerData?.farmer?.profile?.lastName}`}</h2>
          <p className="text-gray-500">
            <MapPin className="inline-block mr-1" />{" "}
            {farmerData?.land?.location?.address}
          </p>
        </div>

        {/* Farmer Details */}
        <div className="mt-6 space-y-4 text-gray-700">
          <div className="flex justify-between items-center">
            <p>
              <strong>Land Size:</strong> {farmerData?.land?.totalArea?.value}{" "}
              {farmerData?.land?.totalArea?.unit}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-lg ${
                  farmerData?.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {farmerData?.status}
              </span>
            </p>
          </div>
          <div>
            <p>
              <strong>Coordinates:</strong>
            </p>
            <p>
              Latitude: {farmerData?.land?.location?.coordinates?.latitude}°
            </p>
            <p>
              Longitude: {farmerData?.land?.location?.coordinates?.longitude}°
            </p>
          </div>
          <div>
            <p>
              <strong>Additional note:</strong>
            </p>
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
            <h2 className="text-2xl font-semibold text-green-700">
              Provide Test Results
            </h2>
            <small className="text-gray-500">
              Fill in the test results for the assigned components below
            </small>
            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6"
              onSubmit={handleSubmit}
            >
              {/* Basic Measurements */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-green-700">
                  pH Level
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="pH"
                  value={formData.pH}
                  onChange={handleChange}
                  placeholder="Enter pH level"
                  className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2 text-green-700"
                />
              </div>

              {/* Simple String Inputs */}
              {[
                "available",
                "organicMatter",
                "exchangeable",
                "cn",
                "totalNitrogen",
                "calcium",
                "magnesium",
                "iron",
                "manganese",
                "boron",
                "copper",
                "zinc",
                "cec",
                "soilTexture",
              ].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-semibold text-green-700 text-green-700">
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
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

              {/* Fertilizer Recommendations Section */}
              <div className="col-span-2">
                <h3 className="text-xl font-semibold mt-6 ">
                  Fertilizer Recommendations
                </h3>

                {["preplanting", "planting", "topDressUrea", "topDressMOP"].map(
                  (field) => (
                    <div key={field} className="flex flex-col my-4">
                      <label className="text-sm font-semibold text-green-700">
                        Comment for{" "}
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        name={`comment.${field}`}
                        value={formData.comment[field]}
                        onChange={handleChange}
                        placeholder={`Enter ${field}`}
                        className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                      />
                    </div>
                  )
                )}

                {/* Rice Recommendation */}
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-green-700">RICE</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                    {[
                      "preplanting",
                      "planting",
                      "topDressUrea",
                      "topDressMOP",
                    ].map((stage) => (
                      <React.Fragment key={stage}>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 capitalize">
                            <b>{stage}</b> Input
                          </label>
                          <input
                            type="text"
                            name="input"
                            value={riceRecommendation[stage].input}
                            className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                            disabled
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 capitalize">
                            <b>{stage}</b> Kg/Ha
                          </label>
                          <input
                            type="text"
                            name="kgPerHa"
                            value={riceRecommendation[stage].kgPerHa}
                            onChange={(e) =>
                              handleRecommendationChange(e, stage, "RICE")
                            }
                            placeholder="Enter kg/Ha"
                            className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 capitalize">
                            <b>{stage}</b> Bags/Ha
                          </label>
                          <input
                            type="text"
                            name="bagsPerHa"
                            value={riceRecommendation[stage].bagsPerHa}
                            onChange={(e) =>
                              handleRecommendationChange(e, stage, "RICE")
                            }
                            placeholder="Enter bags/Ha"
                            className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Maize Recommendation */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-green-700">
                    MAIZE
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                    {[
                      "preplanting",
                      "planting",
                      "topDressUrea",
                      "topDressMOP",
                    ].map((stage) => (
                      <React.Fragment key={stage}>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 capitalize">
                            <b>{stage}</b> Input
                          </label>
                          <input
                            type="text"
                            name="input"
                            value={maizeRecommendation[stage].input}
                            className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                            disabled
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 capitalize">
                            <b>{stage}</b> Kg/Ha
                          </label>
                          <input
                            type="text"
                            name="kgPerHa"
                            value={maizeRecommendation[stage].kgPerHa}
                            onChange={(e) =>
                              handleRecommendationChange(e, stage, "MAIZE")
                            }
                            placeholder="Enter kg/Ha"
                            className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-semibold text-gray-700 capitalize">
                            <b>{stage}</b> Bags/Ha
                          </label>
                          <input
                            type="text"
                            name="bagsPerHa"
                            value={maizeRecommendation[stage].bagsPerHa}
                            onChange={(e) =>
                              handleRecommendationChange(e, stage, "MAIZE")
                            }
                            placeholder="Enter bags/Ha"
                            className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="flex flex-col col-span-2">
                <label className="text-sm font-semibold text-green-700">
                  Recommended Crops (comma-separated)
                </label>
                <input
                  type="text"
                  name="recommendedCrops"
                  value={formData.recommendedCrops.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      recommendedCrops: e.target.value
                        .split(",")
                        .map((crop) => crop.trim()),
                    }))
                  }
                  placeholder="Enter recommended crops, separated by commas"
                  className="mt-2 border-2 border-gray-300 rounded-md px-4 py-2"
                />
              </div>

              <div className="flex flex-col col-span-2">
                <label className="text-sm font-semibold text-green-700">
                  Additional Recommendations
                </label>
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
