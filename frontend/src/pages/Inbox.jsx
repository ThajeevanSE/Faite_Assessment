import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Inbox() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      const res = await api.get("/messages/inbox");
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to load inbox", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading messages...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Messages 💬</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {conversations.length === 0 ? (
           <div className="p-10 text-center text-gray-500">
             You haven't started any conversations yet.
           </div>
        ) : (
          <div className="divide-y">
            {conversations.map((user) => (
              <Link 
                to={`/chat/${user.id}`} 
                key={user.id} 
                className="flex items-center p-4 hover:bg-gray-50 transition cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="ml-4 flex-grow">
                  <h3 className="font-bold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-500">Click to view conversation</p>
                </div>

                {/* Arrow Icon */}
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inbox;