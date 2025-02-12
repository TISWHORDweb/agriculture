import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import axios from "axios";
import {
  Droplet,
  Leaf,
  Pyramid,
  ThermometerSun,
  Activity,
  Sprout,
  Mountain,
  Waves,
  Trees,
  CircleDot,
  Combine,
  Scale,
  LeafIcon,
  MountainSnow,
  Recycle,
  GlassWater,
  RouteOff,
  SatelliteIcon,
  ThermometerSnowflakeIcon,
} from "lucide-react";
import baseUrl from "../../hook/Network";

const SoilTestResult = () => {
  const { id } = useParams();
  const base_url = baseUrl();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("authToken");
      const response = await axios.get(
        `${base_url}/agent/request/result/${id}`,
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      setTestData(response.data.data.requests);
      setRecommendations(response.data.data.recommendations);
      console.log(response)
    } catch (err) {
      setError("Failed to fetch test data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, [id]);

  const getStatus = (result, threshold) => {
    const [lower, upper] = threshold;
  
    if (result < lower) return "Very Low";
    if (result >= lower && result <= upper) return "Adequate";
    if (result > upper) return "High";
    return "Adequate"; // Fallback, though the above conditions should cover all cases
  };


  // Example usage:
  const thresholds = {
    "pH Level": { Rice: [6.0, 7.0], Maize: [6.0, 7.0] },
    "Available P": { Rice: [30, 80], Maize: [30, 80] },
    "Exchangeable K": { Rice: [80, 180], Maize: [85, 200] },
    Calcium: { Rice: [400, 900], Maize: [400, 950] },
    Magnesium: { Rice: [60, 150], Maize: [50, 100] },
    Iron: { Rice: [115, 160], Maize: [120, 165] },
    Manganese: { Rice: [25, 80], Maize: [30, 75] },
    Boron: { Rice: [0.9, Infinity], Maize: [0.85, Infinity] },
    Copper: { Rice: [0.2, 1.2], Maize: [0.2, 1.2] },
    Zinc: { Rice: [0.1, Infinity], Maize: [2, 12] },
    CEC: { Rice: [4, 7], Maize: [3, 8] },
    "Total Nitrogen": { Rice: [0.02, 0.07], Maize: [0.09, 0.12] },
    "Organic Matter": { Rice: [1.5, 1.8], Maize: [1.5, 1.7] },
    "C/N": { Rice: [10, 14], Maize: [9, 15] },
  };

  const ResultCard = ({
    icon: Icon,
    label,
    value,
    maizeStatus,
    riceStatus,
  }) => {
    // Function to get status color based on status
    const getStatusColor = (status) => {
      switch (status) {
        case "Very Low":
          return "bg-red-100 text-red-800";
        case "Low":
          return "bg-orange-100 text-orange-800";
        case "Adequate":
          return "bg-green-100 text-green-800";
        case "High":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
  
    return (
      <div
        className={`bg-green-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg relative overflow-hidden border border-gray-100 hover:border-green-100`}
      >
        {/* Background Icon */}
        <div className="absolute top-2 right-2 w-20 h-20 opacity-10">
          <Icon className="w-full h-full text-green-400" />
        </div>
  
        {/* Header with Icon and Label */}
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-8 h-8 text-green-500" />
          <h3 className="font-semibold text-lg text-gray-800">{label}</h3>
        </div>
  
        {/* Value Display */}
        <div className="mt-2 mb-6">
          <p className="text-4xl font-bold text-gray-900">
            {value?.value || value || "0"}
          </p>
        </div>
  
        {/* Status Badges */}
        <div className="flex gap-4">
          <div>
            <small className="text-sm text-gray-500">Rice</small>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                getStatus(value?.value || value || "0", riceStatus)
              )}`}
            >
              {getStatus(value?.value || value || "0", riceStatus)}
            </div>
          </div>
          <div>
            <small className="text-sm text-gray-500">Maize</small>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                getStatus(value?.value || value || "0", maizeStatus)
              )}`}
            >
              {getStatus(value?.value || value || "0", maizeStatus)}
            </div>
          </div>
        </div>
      </div>
    );
  };
  

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500 p-4">{error}</div>
      </DashboardLayout>
    );
  }

  const results = testData?.results || {};


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 border-t-4 border-green-400">
          {/* Header */}
          <div className="mb-8 relative">
            <div className="inline-block">
              <h1 className="text-3xl font-bold text-gray-900">
                Soil Analysis Results
              </h1>
              <div className="h-1 w-24 bg-green-400 mt-2 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">
              Comprehensive analysis of your soil sample
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResultCard
              icon={ThermometerSun}
              label="pH Level"
              value={results.pH}
              riceStatus={thresholds["pH Level"].Rice}
              maizeStatus={thresholds["pH Level"].Maize}
            />
            <ResultCard
              icon={Leaf}
              label="Available P"
              value={results.available}
              riceStatus={thresholds["Available P"].Rice}
              maizeStatus={thresholds["Available P"].Maize}
            />
            <ResultCard
              icon={Recycle}
              label="Exchangeable K"
              value={results.exchangeable}
              riceStatus={thresholds["Exchangeable K"].Rice}
              maizeStatus={thresholds["Exchangeable K"].Maize}
            />
            <ResultCard
              icon={Sprout}
              label="Total Nitrogen"
              value={results.totalNitrogen}
              riceStatus={thresholds["Total Nitrogen"].Rice}
              maizeStatus={thresholds["Total Nitrogen"].Maize}
            />
            <ResultCard
              icon={Mountain}
              label="Magnesium"
              value={results.magnesium}
              riceStatus={thresholds.Magnesium.Rice}
              maizeStatus={thresholds.Magnesium.Maize}
            />
            <ResultCard
              icon={Activity}
              label="C/N"
              value={results.cn}
              riceStatus={thresholds["C/N"].Rice}
              maizeStatus={thresholds["C/N"].Maize}
            />
            <ResultCard
              icon={Pyramid}
              label="Calcium"
              value={results.calcium}
              riceStatus={thresholds.Calcium.Rice}
              maizeStatus={thresholds.Calcium.Maize}
            />
            <ResultCard
              icon={CircleDot}
              label="Iron"
              value={results.iron}
              riceStatus={thresholds.Iron.Rice}
              maizeStatus={thresholds.Iron.Maize}
            />
            <ResultCard
              icon={Combine}
              label="Manganese"
              value={results.manganese}
              riceStatus={thresholds.Manganese.Rice}
              maizeStatus={thresholds.Manganese.Maize}
            />
            <ResultCard
              icon={Scale}
              label="Boron"
              value={results.boron}
              riceStatus={thresholds.Boron.Rice}
              maizeStatus={thresholds.Boron.Maize}
            />
            <ResultCard
              icon={ThermometerSnowflakeIcon}
              label="Copper"
              value={results.copper}
              riceStatus={thresholds.Copper.Rice}
              maizeStatus={thresholds.Copper.Maize}
            />
            <ResultCard
              icon={SatelliteIcon}
              label="Zinc"
              value={results.zinc}
              riceStatus={thresholds.Zinc.Rice}
              maizeStatus={thresholds.Zinc.Maize}
            />
            <ResultCard
              icon={GlassWater}
              label="CEC"
              value={results.cec}
              riceStatus={thresholds.CEC.Rice}
              maizeStatus={thresholds.CEC.Maize}
            />
            <ResultCard
              icon={MountainSnow}
              label="Organic Matter"
              value={results.organicMatter}
              riceStatus={thresholds["Organic Matter"].Rice}
              maizeStatus={thresholds["Organic Matter"].Maize}
            />
          </div>

          {/* Soil Texture Section */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Soil Texture Analysis
              </h2>
              <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
            </div>
            <div className="bg-green-50/50 rounded-xl p-8 border border-green-100">
              <div className="text-center mt-6 p-6 bg-white rounded-lg border border-green-100">
                <p className="text-gray-600">Texture Class</p>
                <p className="text-xl font-semibold mt-1 text-green-600">
                  {results.soilTexture || "Not available"}
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Crops Section */}
          {results?.recommendedCrops && results?.recommendedCrops?.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recommended Crops
                </h2>
                <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
              </div>
              <div className="bg-green-50/50 rounded-xl p-8 border border-green-100">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.recommendedCrops.map((crop, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-sm border-l-2 border-green-400"
                    >
                      <Trees className="w-5 h-5 text-green-400" />
                      <span className="text-gray-800">{crop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {recommendations?.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Fertilizer Recommendations
                </h2>
                <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
              </div>
              <div className="">
                <h2 className="text-1xl font-bold text-gray-900">Comments</h2>
                {results.comment && (
                  <div className="">
                    <div className="flex items-center my-3 bg-white p-4 rounded-lg shadow-sm border-l-2 border-green-400">
                      <Trees className="w-5 h-5 text-green-400" />
                      <span className="text-gray-800 ms-2">
                        {" "}
                        Preplanting : {results.comment.preplanting}
                      </span>
                    </div>
                    <div className="flex items-center my-3 bg-white p-4 rounded-lg shadow-sm border-l-2 border-green-400">
                      <LeafIcon className="w-5 h-5 text-green-400" />
                      <span className="text-gray-800 ms-2">
                        {" "}
                        Planting : {results.comment.planting}
                      </span>
                    </div>
                    <div className="flex items-center my-3 bg-white p-4 rounded-lg shadow-sm border-l-2 border-green-400">
                      <Waves className="w-5 h-5 text-green-400" />
                      <span className="text-gray-800 ms-2">
                        {" "}
                        Top Dress (Urea) : {results.comment.topDressUrea}
                      </span>
                    </div>
                    <div className="flex items-center my-3 bg-white p-4 rounded-lg shadow-sm border-l-2 border-green-400">
                      <Droplet className="w-5 h-5 text-green-400" />
                      <span className="text-gray-800 ms-2">
                        {" "}
                        Top Dress (MOP) : {results.comment.topDressMOP}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {recommendations.map((rec, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {rec.crop} Recommendations
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead className="bg-green-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            STAGE
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            INPUT
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Kg/Ha
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                            Bags/Ha (50kg)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            Pre-Planting
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.preplanting.input}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.preplanting.kgPerHa}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.preplanting.bagsPerHa}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            Planting
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.planting.input}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.planting.kgPerHa}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.planting.bagsPerHa}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            Top Dress (Urea)
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.topDressUrea.input}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.topDressUrea.kgPerHa}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.topDressUrea.bagsPerHa}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            Top Dress (MOP)
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.topDressMOP.input}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.topDressMOP.kgPerHa}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {rec.topDressMOP.bagsPerHa}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Recommendations */}
          {results.additionalRecommendations && (
            <div className="mt-12">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Additional Recommendations
                </h2>
                <div className="h-1 flex-grow bg-green-400/20 rounded-full"></div>
              </div>
              <div className="bg-green-50/50 rounded-xl p-8 border border-green-100">
                <p className="text-gray-700 leading-relaxed">
                  {results.additionalRecommendations}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SoilTestResult;
