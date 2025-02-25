import React, { useState, useEffect } from "react";
import axios from "axios";
import { Activity, Droplets, Thermometer, Plus } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import Thumb from "../../assets/missing-data-vector-49849220-removebg-preview.png";
import farm from "../../assets/images/pexels-photo-259280.jpeg";
import farmer from "../../assets/images/pexels-photo-916406.jpeg";
import { Link } from "react-router-dom";
import baseUrl from "../../hook/Network";

const AssignedList = () => {
  const base_url = baseUrl();
  const [soilTesters, setSoilTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSoilTesters = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('authToken');
      const response = await axios.get(`${base_url}/agent/request/completed`, {
        headers: {
          "Authorization": `Bearer ${storedUser}`,
        },
      });
      setSoilTesters(response.data.data);
    } catch (err) {
      console.error('Error response:', err.response);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 border-solid rounded-full"></div>
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
      <div className="max-w-7xl mx-auto px-4 mt-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Assigned Soil Testers</h1>
        </div>

        {soilTesters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {soilTesters.map((tester) => (
              <div key={tester._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img src={farm} alt="farm image" className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="absolute top-4 left-4 bg-white p-2 rounded-full border-2 border-white shadow-md">
                    <img src={farmer} alt="Farmer" className="w-16 h-16 object-cover rounded-full border" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{`${tester.farmer.profile.firstName} ${tester.farmer.profile.lastName}`}</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    <span className="text-gray-400">Location:</span> {tester.land.location.address}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <span className="text-gray-400">Coordinates:</span> Lat: {tester.land.location.coordinates.latitude}, Lon: {tester.land.location.coordinates.longitude}
                  </p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-500 font-semibold">
                      Land Size: {tester.land.totalArea.value} {tester.land.totalArea.unit}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-xl text-xs ${getStatusColor(tester.status)}`}
                    >
                      {tester.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">Additional Note: {tester.additionalNotes || "No additional notes"}</p>
                  <p className="text-xs mt-2 text-gray-400">
                      Request Date: {new Date(tester.requestDate).toLocaleString()}
                    </p>
                  <div className="mt-4 ">
                    <Link to={`/land-tests/${tester._id}`}>
                      <button className=" bg-[#4ADE80] text-white w-full py-2 px-4 rounded-md transition duration-200">
                        View Details
                      </button>
                    </Link> 
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center text-center mt-12">
            <img src={Thumb} alt="No Data" className="w-32 mb-4" />
            <p className="text-gray-500">No soil testers found. Please try again later.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AssignedList;