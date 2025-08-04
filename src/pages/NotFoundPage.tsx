import React from "react";
import { useNavigate } from "react-router";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0e0e0e] text-white text-center px-6">
      <h1 className="text-6xl font-extrabold mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-6">
        Oops, the page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 border border-white rounded hover:bg-white hover:text-black transition-colors cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
