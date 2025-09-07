"use client";

import { useState } from "react";
import LoanApplicationForm from "./components/LoanApplicationForm";
import ErrorBoundary from "./components/ErrorBoundary";
import WelcomeIntro from "./components/WelcomeIntro";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <WelcomeIntro onComplete={handleIntroComplete} />;
  }
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/3 bg-gradient-to-b from-indigo-600 to-purple-600 text-white p-10 rounded-r-3xl flex-col justify-center relative z-10 shadow-xl">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold mb-6 flex items-center">
          <span className="bg-white text-indigo-600 p-3 rounded-2xl mr-3 animate-bounce shadow-lg">
            💰
          </span>
          LoanApp
        </h1>

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-4">
          🚀 Instant Loan Approvals
        </h2>
        <p className="mb-8 text-gray-100 leading-relaxed">
          Get decisions within minutes of application submission and enjoy
          seamless loan processing with flexible terms.
        </p>

        {/* Features List */}
        <ul className="space-y-4 text-sm">
          <li className="flex items-center">
            <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full mr-3 animate-spin-slow">
              ✨
            </span>
            Multiple loan options available
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full mr-3">
              💳
            </span>
            No hidden fees or charges
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full mr-3 animate-pulse">
              📞
            </span>
            24/7 customer support
          </li>
          <li className="flex items-center">
            <span className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-full mr-3">
              🔄
            </span>
            Flexible repayment terms
          </li>
        </ul>
      </div>

      {/* Right Section - Loan Form */}
      <ErrorBoundary logLevel="localStorage">
        <LoanApplicationForm />
      </ErrorBoundary>
    </div>
  );
}
