import React from "react" ;
import {
  MapPin,
  Plane,
  Users,
  TrendingUp,
  User,
  X,
  Building,
  FileBadge,
  Briefcase,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import useAdminAuth from "../../context/AdminAuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();

  const navlinks: NavItem[] = [
    {
      id: "",
      label: "Dashboard",
      icon: TrendingUp,
      path: "/admin/dashboard",
    },
    {
      id: "departments",
      label: "Departments Management",
      icon: Building,
      path: "/admin/dashboard/department-management",
    },
    {
      id: "recruiting",
      label: "Recruiting Management",
      icon: Briefcase,
      path: "/admin/dashboard/recruiting-management",
    },
    {
      id: "employees",
      label: "Employees Management",
      icon: Users,
      path: "/admin/dashboard/employee-management",
    },
  ];

  const getProfileRoute = () => "/admin/dashboard/profile";

  const handleNavigateProfile = () => {
    const route = getProfileRoute();
    if (route) navigate(route, { replace: true });
  };

  const renderMenuItem = (item: NavItem) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.id}
        to={item.path}
        end
        className={({ isActive }) =>
          `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
            isActive
              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
              : "text-black hover:bg-primary-50"
          }`
        }
        onClick={() => {
          if (window.innerWidth < 1024) onToggle();
        }}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 min-h-screen bg-white flex flex-col border-r border-primary-200 shadow-lg transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-80`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
              <div className="flex items-center space-x-0.5">
                <MapPin className="w-4 h-4 text-white" />
                <Plane className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-xl text-primary-800">
                Aby Hr Management
              </h2>
              <p className="text-sm text-primary-500">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {navlinks.length > 0 ? (
              navlinks.map(renderMenuItem)
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No menu items available</p>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div
          className="p-4 border-t border-primary-200 cursor-pointer"
          onClick={handleNavigateProfile}
        >
          <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-gray-900 truncate">
                {user?.adminName || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.adminEmail || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
