import React, { useEffect, useState } from "react";
import { 
  Wheat, 
  Sprout, 
  Droplet, 
  Book, 
  Tractor,
  User,
  ClipboardCheck,
  Clock,
  Users,
  AlertCircle
} from "lucide-react";
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
  const [requests, setRequests] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const getAnalytics = async () => {
    try {
      setLoading(true);
      const userRole = localStorage.getItem("role");
      setRole(userRole);

      let response;
      if (userRole === "farmer") {
        response = await userService.getFarmerAnalytics();
      } else if (userRole === "agent") {
        response = await userService.getAgentAnalytics();
      }

      if (response) {
        setAnalytics(response.data);
        setRequests(response.data.request || response.data.RecentRequests || []);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  const renderFarmerStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <StatCard
        title="Total Land"
        value={analytics.TotalLand}
        to="/land"
        unit=""
        percentage={analytics.TotalLand}
        icon={Wheat}
        color="bg-yellow-500"
      />
      <StatCard
        title="Total Request"
        value={analytics.TotalRequest}
        unit=""
        to="/land-tests"
        percentage={analytics.TotalRequest}
        icon={Sprout}
        color="bg-green-500"
      />
      <StatCard
        title="Completed Tests"
        value={analytics.TotalCompleted}
        to="/land-tests"
        unit=""
        percentage={analytics.TotalCompleted}
        icon={Droplet}
        color="bg-blue-500"
      />
    </div>
  );

  const renderAgentStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Assigned Farmers"
        value={analytics.TotalAssignedFarmers}
        to="/farmers"
        unit=""
        percentage={analytics.TotalAssignedFarmers}
        icon={Users}
        color="bg-purple-500"
      />
      <StatCard
        title="Total Requests"
        value={analytics.TotalRequest}
        to="/requests"
        unit=""
        percentage={analytics.TotalRequest}
        icon={ClipboardCheck}
        color="bg-green-500"
      />
      <StatCard
        title="Pending Tests"
        value={analytics.TotalPending}
        to="/requests?status=pending"
        unit=""
        percentage={analytics.TotalPending}
        icon={Clock}
        color="bg-yellow-500"
      />
      <StatCard
        title="Completed Tests"
        value={analytics.TotalCompleted}
        to="/requests?status=completed"
        unit=""
        percentage={analytics.TotalCompleted}
        icon={Droplet}
        color="bg-blue-500"
      />
    </div>
  );

  const renderFarmerContent = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FarmPreview />
        </div>
        <div className="space-y-6">
          <WeatherCard />
        </div>
      </div>
      {requests.length > 0 && (
        <RequestsList
          requests={requests}
          onRequestDetails={(request) => {
            // Handle request details action
            console.log('Manage Request:', request);
          }} 
        />
      )}
    </>
  );

  const renderAgentContent = () => (
    <>
      <div className="!max-h-48 w-full h-auto">
         <FarmPreview />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Test Requests</h3>
            {requests.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <li key={request._id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {request.farmer?.profile?.firstName} {request.farmer?.profile?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {request.land?.location?.address}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent requests</p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <WeatherCard />
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-semibold">
            {role === 'farmer' ? 'Farmer Dashboard' : 'Agent Dashboard'}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading dashboard data...</p>
          </div>
        ) : analytics ? (
          <>
            {role === 'farmer' ? renderFarmerStats() : renderAgentStats()}
            {role === 'farmer' ? renderFarmerContent() : renderAgentContent()}
          </>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  No analytics data available. Please check back later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;