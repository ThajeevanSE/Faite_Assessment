import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { getToken } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";

function Profile() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  const [user, setUser] = useState({ name: "", dateOfBirth: "" });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialProfilePic, setInitialProfilePic] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;

        setUser({
          name: userData.name || "",
          dateOfBirth: userData.dateOfBirth
            ? userData.dateOfBirth.split("T")[0]
            : "",
        });

        if (userData.profilePicture) {
          setInitialProfilePic(`http://localhost:8080${userData.profilePicture}`);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else setPreviewUrl(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("dateOfBirth", user.dateOfBirth);
    if (file) formData.append("profilePicture", file);

    try {
      const token = getToken();
      await api.put("/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile updated successfully!");
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const displayImage = previewUrl || initialProfilePic || "/default-avatar.png";

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      }`}
    >
      {/* Header */}
      {/* <div
        className={`shadow-sm border-b ${
          isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              Edit Profile
            </h1>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
              Update your personal information
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleUpdate}
          className={`rounded-2xl shadow-lg p-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Profile Picture */}
          <div className={`flex flex-col items-center mb-8 pb-8 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="relative">
              {displayImage !== "/default-avatar.png" ? (
                <img
                  src={displayImage}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }}
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "👤"}
                </div>
              )}

              <label
                htmlFor="profilePicture"
                className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white cursor-pointer hover:bg-blue-600 transition duration-200"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
            </div>
            <h3 className={`${isDarkMode ? "text-gray-100" : "text-gray-800"} mt-4 text-xl font-semibold`}>
              {user.name || "Your Name"}
            </h3>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-500"} text-sm`}>
              Update your profile picture and details
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label
                htmlFor="dateOfBirth"
                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}
              >
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  value={user.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg transition duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400" : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label
                htmlFor="profilePicture"
                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}
              >
                Profile Picture
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="profilePicture"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition duration-200 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 hover:bg-gray-600"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                    {file && (
                      <p className="mt-2 text-sm text-blue-500 font-medium">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                  <input
                    id="profilePicture"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 rounded-lg font-semibold transform transition duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  isDarkMode
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                }`}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>

              <button
                onClick={() => navigate("/change-password")}
                type="button"
                className={`flex-1 py-3 rounded-lg font-semibold transform transition duration-200 hover:scale-105 ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                    : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                Change Password
              </button>
            </div>
          </div>
        </form>

        {/* Additional Info */}
        <div className={`mt-6 rounded-lg p-4 flex items-start space-x-3 ${
          isDarkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-blue-50 border border-blue-200 text-blue-900"
        }`}>
          <svg
            className="w-5 h-5 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-semibold">Profile Tips</h4>
            <p className="text-sm mt-1">
              Keep your profile information up to date to ensure the best experience. Profile pictures help personalize your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
