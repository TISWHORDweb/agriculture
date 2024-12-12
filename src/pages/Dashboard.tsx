import React, { useEffect, useState } from "react";
import { Wheat, Sprout, Droplet, Book, Tractor } from "lucide-react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import WeatherCard from "../components/Dashboard/WeatherCard";
import StatCard from "../components/Dashboard/StatCard";
import ProductivityChart from "../components/Dashboard/ProductivityChart";
import HarvestingCost from "../components/Dashboard/HarvestingCost";
import FarmPreview from "../components/Dashboard/FarmPreview";
import UserService from "../api/user.service";
import RequestsList from "../components/Dashboard/RequestList";

const Dashboard = () => {
  const userService = new UserService();
  const [analytics, setAnalytics] = useState({});
  const [request, setRequest] = useState([]);
  const [role, setRole] = useState("");

  const getAnalytics = async () => {
    const role = localStorage.getItem("role");
    if (role) {
      let response 
      if(role === "farmer"){
      response =await  userService.getFarmerAnalytics()
      }else{
        response =await  userService.getAgentAnalytics()
      }

      if (response) {
        setAnalytics(response.data);
        setRequest(response.data.request);
        setRole(role);
      }
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  console.log(analytics);
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4  mt-4">
          <h1 className="text-2xl font-semibold">Summary</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search any of content"
              className="w-full md:w-auto pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {role === "farmer" ? (
              <StatCard
                title="Total Land"
                value={analytics.TotalLand}
                unit="Tons"
                percentage={100}
                icon={Wheat}
                color="bg-yellow-500"
              />
            ) : (
              <StatCard
                title="Total Result "
                value={analytics.TotalResult}
                unit="%"
                percentage={37}
                icon={Droplet}
                color="bg-blue-500"
              />
            )}
            <StatCard
              title="Total Request"
              value={analytics.TotalRequest}
              unit="Tons"
              percentage={85}
              icon={Sprout}
              color="bg-green-500"
            />
            <StatCard
              title="Total Completed Request"
              value={analytics.TotalCompleted}
              unit="%"
              percentage={37}
              icon={Droplet}
              color="bg-blue-500"
            />
          </div>
        ) : (
          "Loading....."
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FarmPreview />
           {request &&  <RequestsList 
           requests={request}
          onRequestDetails={(request) => {
            // Handle request details action
            console.log('Manage Request:', request);
          }}  />
        }
          </div>
          <div className="space-y-6">
            <WeatherCard />
            <HarvestingCost />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
