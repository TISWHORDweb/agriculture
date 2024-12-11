import React, { useEffect, useState } from "react";
import { useSoilTesterStore } from "../../store/soil-tester-store";
import { Activity, Droplets, Thermometer, Plus } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import Thumb from "../../assets/missing-data-vector-49849220-removebg-preview.png";
import CreateLand from "./CreateLand";

import UserService from "../../api/user.service";
import { toast } from "react-toastify";
import FarmerLandsDisplay from "./Lands";

const LandList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lands, setLands] = useState([]);
  const userService = new UserService();
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

  const getLands = async () => {
    const response = await userService.getLands();
    if (!response.status) {
      toast.error(response.message);
      return;
    }
    setLands(response.data);
  };

  useEffect(()=>{
    getLands()
  },[])

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

        {lands.length > 0 ? (
          <FarmerLandsDisplay lands={lands} />
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
              <CreateLand onClose={() => setIsModalOpen(false)} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LandList;
