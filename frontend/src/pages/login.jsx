import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { AtSign, Lock, Shield, UserCircle } from "lucide-react";

const InputField = ({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  required = true,
  className = "",
  name,
  value,
  onChange,
  children, // For select options
}) => (
  <div className={`flex flex-col space-y-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      {type === "select" ? (
        <select
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className={`w-full rounded-md border border-gray-300 shadow-sm py-2 
            ${Icon ? "pl-10 pr-3" : "px-3"}
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
            text-gray-900 text-sm placeholder-gray-400`}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={`w-full rounded-md border border-gray-300 shadow-sm py-2 
            ${Icon ? "pl-10 pr-3" : "px-3"}
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
            text-gray-900 text-sm placeholder-gray-400`}
        />
      )}
    </div>
  </div>
);

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, currentUser, loading } = useUser(); // Use the user context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "", // Added role to formData
    branch: "", // Added branch to formData
  });
  const [error, setError] = useState("");

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      // Redirect based on user role
      if (currentUser.role === "student") {
        navigate("/Profile");
      } else {
        navigate("/Admin");
      }
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    try {
      // Use the login function from UserContext instead of axios directly
      const result = await login(formData);

      if (result.success) {
        // Navigation will be handled by the useEffect when currentUser updates
        console.log("Login successful!");
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleSignUp = (role) => {
    setIsModalOpen(false);
    navigate(role === "student" ? "/Student-SignUp" : "/Admin-SignUp");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side - College Logo Section */}
        <div className="w-1/2 bg-blue-50 flex flex-col items-center justify-center p-8">
          <div className="mb-6">
            {/* Replace with your actual college logo */}
            <img
              src="https://upload.wikimedia.org/wikipedia/en/6/6f/Cochin_University_of_Science_and_Technology_Logo.png"
              alt="College Logo"
              className="w-40 h-40 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Cochin University of Science and Tecnology
          </h1>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-1 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            <InputField
              label="Username"
              type="text"
              placeholder="Enter your unique username"
              name="username"
              icon={AtSign}
              value={formData.username}
              onChange={handleInputChange}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleInputChange}
            />

            <div className="space-y-2">
              <h2 className="text-sm font-medium text-gray-700">Login As</h2>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleInputChange}
                  />
                  <span className="text-sm text-gray-700">Student</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === "admin"}
                    onChange={handleInputChange}
                  />
                  <span className="text-sm text-gray-700">Admin</span>
                </label>
              </div>
            </div>

            {/* Branch Dropdown (Conditional Rendering) */}
            {formData.role === "student" && (
              <InputField
                label="Branch"
                type="select"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
              >
                <option value="">Select Branch</option>
                <option value="CSE">
                  Computer Science and Engineering (CSE)
                </option>
                <option value="CE">Civil Engineering (CE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="SFE">Safety & Fire Engineering (SFE)</option>
                <option value="ME">Mechanical Engineering (ME)</option>
                <option value="EEE">
                  Electrical and Electronics Engineering (EEE)
                </option>
                <option value="EC">Electronics and Communication (EC)</option>
              </InputField>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-md 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                transition-colors duration-200"
            >
              Sign In
            </button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => setIsModalOpen(true)}
              >
                Sign up
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>This is a secure login portal.</p>
            <p>All login attempts are monitored and logged.</p>
          </div>
        </div>
      </div>

      {/* Modal for Signup Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
              Choose Account Type
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleSignUp("student")}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md 
                  shadow-sm transition-colors duration-200 font-medium"
              >
                Sign up as Student
              </button>
              <button
                onClick={() => handleSignUp("admin")}
                className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md 
                  shadow-sm transition-colors duration-200 font-medium"
              >
                Sign up as Admin
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
