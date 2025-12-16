
import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function PermissionDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <ShieldAlert size={80} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Permission Denied</h2>
      <p className="text-gray-600 mb-6">You don’t have access to view this page.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Go to Home
      </button>
    </div>
  );
}
