import Footer from "@/components/Footer";
import React from "react";
import { useNavigate } from "react-router";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleHintClick = () => {
    alert("There's nothing here yet. Or is there? 👀");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen font-sans text-center px-4 overflow-hidden relative">
      <h1 className="text-5xl font-extrabold mb-2 animate-fadeIn">
        404FoundMe
      </h1>
      <p className="text-lg max-w-xl text-gray-400 animate-fadeIn delay-200">
        You're not lost. You're just early.
      </p>
      <img
        className="text-5xl mt-4 animate-float"
        src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><text y='50%' x='50%' dominant-baseline='middle' text-anchor='middle' font-size='40'>🛰️</text></svg>"
        alt="satellite emoji"
        style={{ width: "2em", height: "2em", display: "inline-block" }}
      />

      <button
        onClick={handleHintClick}
        className="mt-8 text-sm text-gray-500 opacity-80 hover:text-white cursor-pointer select-none"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleHintClick()}
      >
        (psst... click me)
      </button>

      <div className="mt-10 flex justify-center max-w-lg">
        <button
          onClick={() => navigate("/games/maze")}
          className="border border-white rounded-md px-6 py-2 text-white text-base transition-colors duration-300 hover:bg-white hover:text-black hover:bg-opacity-20 cursor-pointer"
        >
          Check out this mess
        </button>
      </div>

      <Footer />

      <style>
        {`
          @keyframes fadeIn {
            0% {opacity: 0; transform: translateY(10px);}
            100% {opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }
          .animate-fadeIn.delay-200 {
            animation-delay: 0.2s;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
