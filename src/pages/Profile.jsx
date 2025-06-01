import DashboardLayout from "../components/Layout/DashboardLayout";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import baseUrl from "../hook/Network";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Upload } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const base_url = baseUrl();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('authToken');

  // Fetch user details
  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `${base_url}/user/details`,
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      setUser(response.data.data);
      if (response.data.data.profile?.image) {
        setImagePreview(response.data.data.profile.image);
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return null;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploadProgress(0);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadPreset = "Emmanuel";

      // Upload to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dq5nc6lbr/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            upload_preset: uploadPreset,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Update user profile with new image URL
      await updateProfileImage(response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const updateProfileImage = async (imageUrl) => {
    try {
      const response = await axios.patch(
        `${base_url}/user/update-profile`,
        { image: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${storedUser}`,
          },
        }
      );
      
      if (response.data.status) {
        toast.success("Profile picture updated successfully");
        // Update local user data with new image
        setUser(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            image: imageUrl
          }
        }));
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile picture");
    }
  };

  const handlePassword = () => {
    localStorage.setItem('tttkedr', user._id);
    navigate('/setting/change-password');
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen text-gray-600">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Default avatar if no image exists
  const defaultAvatar = `https://ui-avatars.com/api/?name=${user.profile.firstName}+${user.profile.lastName}&background=random&size=200`;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 py-12 px-6 sm:px-8 lg:px-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="relative group">
                <img
                  src={imagePreview || user?.image || defaultAvatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <Camera size={20} />
                </button>
              </div>
              {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
            <h2 className="text-3xl font-semibold text-gray-900">My Account</h2>
            <p className="text-gray-500 mt-2">Manage your personal information and settings</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
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
                <span className="capitalize">{user.role}</span>
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
            Change Password
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;