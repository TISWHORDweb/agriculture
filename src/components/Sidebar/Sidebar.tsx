import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Trees, 
  Wheat, 
  LogOut,
  TestTube,
  Menu,
  X,
  User
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import { useAuthStore } from '../../store/auth-store';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: TestTube, label: 'Land Tests', path: '/land-tests' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Trees, label: 'Land', path: '/land' },
    // { icon: Wheat, label: 'Harvesting', path: '/harvesting' },
    // { icon: Cloud, label: 'Weather', path: '/weather' },
    { icon: User, label: 'Account', path: '/account' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 w-full bg-[#1E293B] z-50 flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Wheat className="h-8 w-8 text-green-400" />
          <span className="text-white text-xl font-semibold">
            agri<span className="text-green-400">cultur</span>
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-[#1E293B] z-40 pt-4 pb-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                isMobile
              />
            ))}
            <SidebarItem
              icon={LogOut}
              label="Logout"
              onClick={handleLogout}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed h-screen w-64 bg-[#1E293B] p-4 flex-col">
        <div className="flex items-center gap-2 px-4 py-3">
          <Wheat className="h-8 w-8 text-green-400" />
          <span className="text-white text-xl font-semibold">
            agri<span className="text-green-400">cultur</span>
          </span>
        </div>

        <div className="flex-1 mt-8 space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        <div className="mt-auto">
          <SidebarItem
            icon={LogOut}
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
}

export default Sidebar;