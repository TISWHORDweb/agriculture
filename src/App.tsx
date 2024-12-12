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
import LandList from "./components/Land/LandList";
import Account from "./components/Account/Account";
import TestView from "./components/SoilTester/TestView";

function App() {
  return (
    <Router>
      <Routes>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        <Route path="/login" element={<Login />} />
        <Route path="/register/:role" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/land-tests" element={<SoilTesterList />} />
        <Route path="/land-tests/:id" element={<TestView />} />
        <Route path="/land" element={<LandList />} />
        <Route path="/account" element={<Account />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
