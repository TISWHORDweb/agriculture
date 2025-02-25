import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import axios from "axios";
import { toast } from 'react-toastify';
import baseUrl from '../../hook/Network';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const base_url = baseUrl();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const storedUser = localStorage.getItem('authToken');
  const id = localStorage.getItem('tttkedr');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setStatus({ type: '', message: '' });
    const payload = {
      userId: id,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };

    try {
      const response = await axios.post(
        `${base_url}/auth/change-password`,
        payload,
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
      toast.success(response.message);
      setStatus({
        type: 'success',
        message: 'Password changed successfully!'
      });
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      localStorage.setItem('tttkedr', "");
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to change password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-2xl font-semibold mb-2">
            <Lock className="w-6 h-6 text-green-400" />
            Change Password
          </div>
          <p className="text-gray-600 text-sm">
            Please enter your current password and choose a new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {status.message && (
            <div className={`p-4 rounded-lg ${
              status.type === 'error' 
                ? 'bg-red-50 text-red-600' 
                : 'bg-green-50 text-green-600'
            }`}>
              {status.message}
            </div>
          )}
          
          {/* Current Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.currentPassword 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-green-200'
                } focus:outline-none focus:ring-2 transition duration-150`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.newPassword 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-green-200'
                } focus:outline-none focus:ring-2 transition duration-150`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.confirmNewPassword 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:ring-green-200'
                } focus:outline-none focus:ring-2 transition duration-150`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? 
                  <EyeOff className="w-4 h-4" /> : 
                  <Eye className="w-4 h-4" />
                }
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-sm text-red-500">{errors.confirmNewPassword}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium 
              ${isLoading 
                ? 'bg-green-300 cursor-not-allowed' 
                : 'bg-green-400 hover:bg-green-500 active:bg-green-600'
              } transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-200`}
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;