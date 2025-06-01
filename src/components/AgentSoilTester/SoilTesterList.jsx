import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Activity, Droplets, MapPin, User, LandPlot } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import Thumb from "../../assets/missing-data-vector-49849220-removebg-preview.png";
import baseUrl from "../../hook/Network";

const SoilTesterList = () => {
  const base_url = baseUrl();
  const [soilTesters, setSoilTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSoilTesters = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('authToken');
      const response = await axios.get(`${base_url}/agent/requests`, {
        headers: {
          "Authorization": `Bearer ${storedUser}`,
        },
      });
      setSoilTesters(response.data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load soil testers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const encodeId = (id) => {
    return btoa(id);
  };

  useEffect(() => {
    fetchSoilTesters();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "assigned":
        return "bg-gray-200 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to generate default avatar
  const getDefaultAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen text-gray-600">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-5">
        {/* New Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Soil Testing Requests</h1>
          <p className="text-gray-600 mt-2">
            {soilTesters.length > 0 
              ? `You have ${soilTesters.length} active soil testing requests`
              : "No active soil testing requests"}
          </p>
        </div>

        {soilTesters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soilTesters.map((tester) => (
              <div
                key={tester._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden relative hover:shadow-xl transition duration-300"
              >
                <div className="relative">
                  {/* Land Image (using actual land image if available, otherwise default land icon) */}
                  {tester.land?.image ? (
                    <img
                      src={tester.land.image}
                      alt="Land"
                      className="object-cover h-48 w-full rounded-t-lg"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center rounded-t-lg">
                      <LandPlot className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Farmer Avatar (using default avatar if no image) */}
                  <div className="absolute top-4 left-4 bg-white rounded-full p-1 border-4 border-white">
                    <img
                      src={tester.farmer?.profile?.image || 
                           getDefaultAvatar(`${tester.farmer.profile.firstName} ${tester.farmer.profile.lastName}`)}
                      alt="Farmer"
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <User className="text-blue-500" /> 
                    {`${tester.farmer.profile.firstName} ${tester.farmer.profile.lastName}`}
                  </h3>

                  <div className="text-gray-600 text-sm mb-3 mt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-gray-400" />
                      <span>{tester.land.location.address || "Address not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="text-gray-400" />
                      <span>Lat: {tester.land.location.coordinates.latitude}° N, Lon: {tester.land.location.coordinates.longitude}° E</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Activity className="text-gray-400" />
                      <span>State: {tester?.land?.location?.state || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="text-gray-400" />
                      <span>LGA: {tester?.land?.location?.lga || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="text-gray-400" />
                      <span>Ward: {tester?.land?.location?.ward || "N/A"}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                    <div className="font-medium">
                      Land Size: {tester.land.totalArea.value}{" "}
                      {tester.land.totalArea.unit}
                    </div>
                    <span
                      className={`p-2 text-xs font-semibold rounded-full ${getStatusColor(
                        tester.status
                      )}`}
                    >
                      {tester.status}
                    </span>
                  </div>

                  <div className="text-gray-500 text-xs mt-2 line-clamp-2">
                    Additional Notes: {tester.additionalNotes || "No additional notes"}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link to={`/single/test-request/${tester._id}`}>
                      <button className="w-full py-2 px-4 bg-[#4ADE80] text-white text-sm rounded-md hover:bg-green-600">
                        View Details
                      </button>
                    </Link>
                    <p className="text-xs text-gray-500 mt-2">
                      Request Date: {new Date(tester.requestDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <img
              src={Thumb}
              alt="No Data"
              className="w-32 mx-auto mb-4"
            />
            <p className="text-xl text-gray-500">No test request for you yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SoilTesterList;