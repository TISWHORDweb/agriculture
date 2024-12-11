import React, { useState } from "react";
import { useSoilTesterStore } from "../../store/soil-tester-store";
import { Activity, Droplets, Thermometer, Plus } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import Thumb from "../../assets/missing-data-vector-49849220-removebg-preview.png";
import CreateLand from "./CreateLand";

const LandList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const soilTesters = useSoilTesterStore((state) => state.soilTesters);
  const updateSoilTester = useSoilTesterStore(
    (state) => state.updateSoilTester
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 mt-4">
          <h2 className="text-2xl font-semibold">Land</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="w-4 h-4" />
            Add New Land
          </button>
        </div>

        {soilTesters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soilTesters.map((tester) => (
              <div
                key={tester.id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{tester.name}</h3>
                    <p className="text-sm text-gray-500">{tester.location}</p>
                  </div>
                  <select
                    value={tester.status}
                    onChange={(e) =>
                      updateSoilTester(tester.id, e.target.value as any)
                    }
                    className={`text-sm rounded-full px-3 py-1 ${getStatusColor(
                      tester.status
                    )}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">pH Level</p>
                      <p className="font-semibold">{tester.lastReading.ph}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Moisture</p>
                      <p className="font-semibold">
                        {tester.lastReading.moisture}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Temperature</p>
                      <p className="font-semibold">
                        {tester.lastReading.temperature}°C
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Last updated:{" "}
                    {new Date(tester.lastReading.timestamp).toLocaleString()}
                  </p>
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
                Add New Land
              </h2>
              <CreateLand onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LandList;
