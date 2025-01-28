import DashboardLayout from "../components/Layout/DashboardLayout";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import baseUrl from "../hook/Network";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null); 
  const base_url = baseUrl()
  const navigate = useNavigate()
  const storedUser = localStorage.getItem('authToken');

  // Fetch user details
  const getUserDetails = async () => {
    // const response = await userService.getFarmerDetails();
    const response = await axios.get(
      `${base_url}/user/details`,
      {
        headers: {
          Authorization: `Bearer ${storedUser}`,
        },
      }
    );
    if (!response.status) {
      toast.error(response.message);
      return;
    }
    setUser(response.data.data); // Set the user data once fetched
  };

  useEffect(() => {
    getUserDetails(); // Fetch user details when the component mounts
  }, []);

  const handlePassword = () => {
    localStorage.setItem('tttkedr', user._id);
    navigate('/setting/change-password')
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen text-gray-600">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }
console.log(user)
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-8 lg:px-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">My Account</h2>
            <p className="text-gray-500 mt-2">Manage your personal information and settings</p>
          </div>
          {/* Profile Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Profile Details</h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Full Name:</span>
                <span>{user.profile.firstName} {user.profile.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Address:</span>
                <span>{user.profile.address || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span>{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account Created:</span>
                <span>{new Date(user.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
       <button
       onClick={handlePassword}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
              Change Passwpord
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

