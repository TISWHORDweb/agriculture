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
        <div className="absolute top-2 right-2 w-20 h-20 opacity-10">
          <Icon className="w-full h-full text-green-400" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-8 h-8 text-green-500" />
          <h3 className="font-semibold text-lg text-gray-800">{label}</h3>
        </div>
        <div className="mt-2 mb-6">
          <p className="text-4xl font-bold text-gray-900">
            {value?.value || value || "0"}
          </p>
        </div>
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
              icon={GlassWater}
              label="Copper"
              value={results.copper}
              riceStatus={thresholds.Copper.Rice}
              maizeStatus={thresholds.Copper.Maize}
            />
            <ResultCard
              icon={Waves}
              label="Zinc"
              value={results.zinc}
              riceStatus={thresholds.Zinc.Rice}
              maizeStatus={thresholds.Zinc.Maize}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SoilTestResult;
