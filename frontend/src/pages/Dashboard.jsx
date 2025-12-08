import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { getToken } from "../services/authService";
import { useLocation } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const location = useLocation();
  const message = location.state?.message;

  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  const toggleLogs = async () => {
    const newState = !showLogs;
    setShowLogs(newState);

    if (newState && logs.length === 0) {
      try {
        const token = getToken();
        if (!token) return;

        const res = await api.get("/activity", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (error) {
        console.error("Failed to load logs", error);
      }
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 border ${
              isDarkMode
                ? "bg-green-800 border-green-600 text-green-200"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium">{message}</p>
          </div>
        )}

        {user ? (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div
              className={`rounded-2xl shadow-lg p-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
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
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Profile Information
                  </h2>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Your account details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-sm mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Full Name
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {user.name}
                  </p>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-sm mb-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Email Address
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Logs Section */}
            <div
              className={`rounded-2xl shadow-lg p-6 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      Activity Logs
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      View your recent activities
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleLogs}
                  className={`px-6 py-2 rounded-lg font-semibold transform transition duration-200 hover:scale-105 ${
                    isDarkMode
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                  }`}
                >
                  {showLogs ? "Hide Logs" : "Show Logs"}
                </button>
              </div>

              {/* Logs Table */}
              {showLogs && (
                <div
                  className={`overflow-hidden rounded-lg border ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <table className="min-w-full divide-y">
                    <thead
                      className={`${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <tr>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Date
                        </th>
                        <th
                          className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isDarkMode ? "divide-gray-700" : "divide-gray-200"
                      }`}
                    >
                      {logs.length > 0 ? (
                        logs.map((log, index) => (
                          <tr
                            key={index}
                            className={`hover:${
                              isDarkMode ? "bg-gray-700" : "bg-gray-50"
                            } transition duration-150`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {log.createdAt
                                ? new Date(log.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  isDarkMode
                                    ? "bg-blue-700 text-blue-200"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {log.action}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            <svg
                              className="w-12 h-12 mx-auto mb-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                              />
                            </svg>
                            No activity found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-600 font-medium">
                Loading your dashboard...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
