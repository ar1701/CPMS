import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../pages/UserContext";
import axios from "axios"; // Add axios import
import {
  LayoutDashboard,
  FileText,
  ScrollText,
  Building2,
  Briefcase,
  GraduationCap,
  MessagesSquare,
  Calendar,
  Clock,
  Award,
  BookOpen,
  PieChart,
  Bell,
  User,
  ChevronRight,
  LogOut,
} from "lucide-react";

const NavItem = ({ icon: Icon, label, path, isActive, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors duration-200
      ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
      }`}
  >
    {/* Left Section: Icon and Label */}
    <div className="flex items-center space-x-3">
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </div>

    {/* Right Section: Badge or Chevron */}
    <div>
      {badge ? (
        <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {badge}
        </span>
      ) : (
        <ChevronRight
          className={`h-4 w-4 transform transition-transform duration-200 ${
            isActive ? "rotate-90" : ""
          }`}
        />
      )}
    </div>
  </button>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, currentUser } = useUser(); // Use the context
  const [activePath, setActivePath] = useState(location.pathname);
  const [jobCount, setJobCount] = useState(0); // Add state for job count
  const [loading, setLoading] = useState(true); // Loading state for the count

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Fetch the job listings count
  useEffect(() => {
    const fetchJobCount = async () => {
      try {
        setLoading(true);
        // If the user has a branch/department, we can filter by it
        const branch = currentUser?.branch || "";
        const endpoint = branch
          ? `/api/companies?department=${branch}`
          : "/api/companies";

        const response = await axios.get(endpoint, {
          withCredentials: true,
        });

        setJobCount(response.data.length);
      } catch (error) {
        console.error("Error fetching job count:", error);
        setJobCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchJobCount();
  }, [currentUser?.branch]);

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const result = await logout(); // Use the logout function from context
      if (result.success) {
        navigate("/"); // Navigate to login page after successful logout
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/profile" },
    {
      icon: Briefcase,
      label: "Job Listings",
      path: "/all-companies",
      badge: loading ? "..." : jobCount > 0 ? jobCount.toString() : null,
    },
    { icon: ScrollText, label: "My Applications", path: "/applications" },
    { icon: PieChart, label: "Resume ATS Score", path: "/resume-score" },
    { icon: Calendar, label: "Interview Schedule", path: "/interviews" },
    { icon: BookOpen, label: "Learning Resources", path: "/resources" },
    { icon: MessagesSquare, label: "Ask Queries", path: "/ask-queries" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 flex flex-col z-10">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={activePath === item.path}
              onClick={item.onClick || (() => handleNavigation(item.path))}
              badge={item.badge}
            />
          ))}
        </div>
      </nav>

      {/* Profile Section with Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50 mb-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser?.name || "Student User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.branch}
            </p>
            <p className="text-xs text-blue-600 font-medium">
              Registration no: {currentUser?.registrationNumber}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
