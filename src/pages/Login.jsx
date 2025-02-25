import React from 'react';
import AuthLayout from '../components/Layout/AuthLayout';
import LoginForm from '../components/Auth/LoginForm';
import { ToastContainer } from 'react-toastify';

const Login = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account"
      alternativeAction={{
        text: "Don't have an account?",
        linkText: "Sign up",
        href: "/register/farmer",
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;