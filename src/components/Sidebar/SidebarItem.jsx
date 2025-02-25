import React from 'react';


const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  isMobile = false
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
        isActive
          ? 'bg-[#E8F3D6] text-[#2C3E50]'
          : 'text-gray-400 hover:bg-gray-800'
      } ${isMobile ? 'justify-start' : ''}`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-left">{label}</span>
    </button>
  );
}

export default SidebarItem;