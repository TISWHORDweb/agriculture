import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useSoilTesterStore } from "../../store/soil-tester-store";
import {  Plus } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import CreateSoilTester from "./CreateSoilTester";
import Thumb from "../../assets/missing-data-vector-49849220-removebg-preview.png";
import farm from "../..//assets/farm.jpg";
 
import { Link } from "react-router-dom";
import baseUrl from "../../hook/Network";

const SoilTesterList = () => {

  const base_url = baseUrl()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soilTesters, setSoilTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSoilTesters = async () => {
    try {
      setLoading(true);
     
      
      const storedUser = localStorage.getItem('authToken');
      console.log(`${base_url}/farmer/test-requests`);
      const response = await axios.get(`${base_url}/farmer/test-requests`, {
        headers: {
          "Authorization": `Bearer ${storedUser}`,
        },
      });
      console.log(response.data.data);
      
      setSoilTesters(response.data.data);
    } catch (err) {
      console.error('Error response:', err.response); 
      setError("Failed to load soil testers. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchSoilTesters();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "text-blue-600"; 
      case "assigned":
        return "text-gray-600"; 
      case "pending":
        return "text-orange-600";
      case "completed":
        return "text-green-600"; 
      case "cancelled":
        return "text-red-600"; 
      default:
        return "text-gray-600";
    }
  };
  

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 mt-4">
          <h2 className="text-2xl font-semibold">Land Tests</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 "
          >
            <Plus className="w-4 h-4" />
            Start Test
          </button>
        </div>

        {soilTesters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soilTesters.map((tester) => (
              <div key={tester._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col gap-3">
                  <img src={farm} alt="farm image" className="object-cover rounded-md" />
                   
                  <div className="text-2xl font-semibold text-[16px] flex justify-between ">
                    {`${tester.land.name}`}  <span className={`px-1 py-0 rounded text-xs ${getStatusColor( tester.status )}`} > {tester.status} </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    
                    <div className="text-gray-400 text-[12px] line-clamp-1">
                      <b>Location:</b> {tester.land.location.address}
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-1 gap-2">
                  
                    <div className="text-gray-400 text-[12px]">
                      <div>State: {tester?.land?.location?.state || 'N/A'}, LGA: {tester?.land?.location?.lga || 'N/A'},  Ward: {tester?.land?.location?.ward || 'N/A'}</div>
                       
                    </div>
                  </div> */}
                  <div className="flex justify-between text-1xl font-semibold text-gray-500">
                    <div>
                      {tester.land.totalArea.value}{" "}
                      <span className="text-[12px] ml-[-3px]">
                        {tester.land.totalArea.unit}
                      </span>
                    </div>
                    <div>
                       
                      
                    </div>
                  </div>
                  <div className="line-clamp-2 text-[13px] font-thin font-gray-500">
                    My Note: {tester.additionalNotes}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-col gap-3">
                  {tester.status=="completed"?<Link to={`/land-tests/${tester._id}`}>
                    <button className="border border-1 p-1 rounded text-sm bg-green-600 text-white hover:bg-green-400 hover:text-white">
                      View Result
                    </button>
                  </Link>:<></>}
                  {/* <p className="text-xs text-gray-500">
                    Request Date:{" "}
                    {new Date(tester.requestDate).toLocaleString()}
                  </p> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="notfound relative h-screen">
            <img
              src={Thumb}
              alt=""
              className="w-44 absolute top-1/4 left-1/2 transform -translate-x-1/2"
            />
            <span>No tester data </span>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-6">
                Request Test
              </h2>
              <CreateSoilTester onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SoilTesterList;