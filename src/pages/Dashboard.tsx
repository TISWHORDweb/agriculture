
import React from 'react';
import { Wheat, Sprout, Droplet } from 'lucide-react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import WeatherCard from '../components/Dashboard/WeatherCard';
import StatCard from '../components/Dashboard/StatCard';
import ProductivityChart from '../components/Dashboard/ProductivityChart';
import HarvestingCost from '../components/Dashboard/HarvestingCost';
import FarmPreview from '../components/Dashboard/FarmPreview';

const Dashboard = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Wheat"
            value={125}
            unit="Tons"
            percentage={100}
            icon={Wheat}
            color="bg-yellow-500"
          />
          <StatCard
            title="Rice"
            value={980}
            unit="Tons"
            percentage={85}
            icon={Sprout}
            color="bg-green-500"
          />
          <StatCard
            title="Water Usage"
            value={37}
            unit="%"
            percentage={37}
            icon={Droplet}
            color="bg-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FarmPreview />
            {/* <ProductivityChart /> */}
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
