"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { CheckCircle } from "lucide-react";

export default function CongratsPage({ onHome }) {
  const { width, height } = useWindowSize();
  const [showBalloons, setShowBalloons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBalloons(true);
    }, 500); // start balloons after confetti begins

    return () => clearTimeout(timer);
  }, []);

  // Floating balloon animation
  const balloons = [
    { color: "#F87171", size: 50, left: "10%" },
    { color: "#60A5FA", size: 60, left: "30%" },
    { color: "#34D399", size: 45, left: "50%" },
    { color: "#FBBF24", size: 55, left: "70%" },
    { color: "#A78BFA", size: 50, left: "85%" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden ">
      {/* Confetti */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={350}
        recycle={false}
        gravity={0.2}
        colors={["#6366F1", "#60A5FA", "#34D399", "#FBBF24", "#F87171"]}
      />

      {/* Floating Balloons */}
      {showBalloons &&
        balloons.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bounce-slow"
            style={{
              width: b.size,
              height: b.size,
              backgroundColor: b.color,
              left: b.left,
              bottom: "-100px",
              animation: `floatUp ${10 + i * 2}s linear infinite`,
            }}
          ></div>
        ))}

      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center text-center max-w-md animate-fadeInUp">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6 animate-bounce-slow" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 animate-pulse">
          Congratulations!
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          Your loan application has been{" "}
          <span className="font-semibold">successfully submitted</span>.
        </p>
        {/* <button
          onClick={onHome}
          className="px-10 py-3 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:scale-110 transform transition-all duration-300 animate-pulse"
        >
          Go to Dashboard
        </button> */}
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh);
            opacity: 0;
          }
        }
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease forwards;
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
