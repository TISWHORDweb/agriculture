import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/auth-store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SoilTesterList from "./components/SoilTester/SoilTesterList";
import AgentSoilTesterList from "./components/AgentSoilTester/SoilTesterList";
import LandList from "./components/Land/LandList";
import Account from "./components/Account/Account";
import TestView from "./components/SoilTester/TestView";
import AgentDashboard from "./pages/AgentDashboard";
import Profile from "./pages/Profile";
import ChangePassword from "./components/Auth/ChangwPassword";
import AssignedList from "./components/AgentSoilTester/AssignedList";
import SoilTestResult from "./components/AgentSoilTester/SingleResult";
import SingleFarmer from "./components/AgentSoilTester/SingleFarmer";
import ViewResult from "./components/AgentSoilTester/ViewResult";
import ResultUpload from "./components/AgentSoilTester/ResultUpload";
import UploadView from "./components/AgentSoilTester/UploadView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        <Route path="/land-tests" element={<SoilTesterList />} />
        <Route path="/land-tests/:id" element={<TestView />} />
        <Route path="/land" element={<LandList />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/test-pool" element={<AgentSoilTesterList />} />
        <Route path="/my-test" element={<AssignedList />} />
        <Route path="/setting/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/view/:id" element={<ViewResult />} />
        <Route path="/result/upload" element={<ResultUpload />} />
        <Route path="/result/preview" element={<UploadView />} />
        <Route path="/single/test-request/:id" element={<SingleFarmer />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
