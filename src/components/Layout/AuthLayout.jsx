import React from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Wheat } from 'lucide-react';
import Logo from '../../assets/logo.png'


const AuthLayout = ({
  children,
  title,
  subtitle,
  alternativeAction,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src={Logo} alt="" className='h-20 w-20'/>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              {alternativeAction.text}{' '}
              <Link
                to={alternativeAction.href}
                className="font-medium text-green-600 hover:text-green-500"
              >
                {alternativeAction.linkText}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AuthLayout;