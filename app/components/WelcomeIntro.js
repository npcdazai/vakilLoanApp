"use client";

import { useState, useEffect } from "react";

const WelcomeIntro = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000);
    const timer2 = setTimeout(() => setStep(2), 2500);
    const timer3 = setTimeout(() => setStep(3), 4000);
    const timer4 = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800);
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  const skipIntro = () => {
    setFadeOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Skip Button */}
      <button
        onClick={skipIntro}
        className="absolute top-8 right-8 text-white/70 hover:text-white text-sm font-medium transition-colors duration-200 z-10"
      >
        Skip Intro
      </button>

      {/* Main Content */}
      <div className="text-center">
        {/* Step 0 - Company Logo */}
        <div
          className={`transition-all duration-1000 ${
            step >= 1 ? "opacity-0 scale-110" : "opacity-100 scale-100"
          }`}
        >
          <div className="text-8xl mb-6 animate-pulse">💰</div>
          <h1 className="text-6xl font-bold text-white tracking-wider">
            LoanApp
          </h1>
        </div>

        {/* Step 1 - Welcome Message */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
            step === 1 ? "opacity-100 translate-y-0" : step < 1 ? "opacity-0 translate-y-10" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="text-center">
            <h2 className="text-5xl font-light text-white mb-4">Welcome</h2>
            <p className="text-xl text-gray-300">to your financial future</p>
          </div>
        </div>

        {/* Step 2 - Features Highlight */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
            step === 2 ? "opacity-100 translate-y-0" : step < 2 ? "opacity-0 translate-y-10" : "opacity-0 -translate-y-10"
          }`}
        >
          <div className="text-center">
            <div className="flex justify-center space-x-12 mb-6">
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-white text-sm">Instant</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <p className="text-white text-sm">Secure</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💫</div>
                <p className="text-white text-sm">Simple</p>
              </div>
            </div>
            <h3 className="text-3xl font-light text-white">
              Loans made simple
            </h3>
          </div>
        </div>

        {/* Step 3 - Call to Action */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
            step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center">
            <h4 className="text-4xl font-light text-white mb-6">
              Let&apos;s get started
            </h4>
            <div className="inline-flex items-center space-x-2 text-gray-300">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeIntro;