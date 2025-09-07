"use client";

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    const errorDetails = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== "undefined" ? window.navigator?.userAgent : "Server",
      url: typeof window !== "undefined" ? window.location?.href : "Server",
    };

    this.logError(errorDetails);
  }

  logError = (errorDetails) => {
    const logLevel = this.props.logLevel || "error";

    switch (logLevel) {
      case "console":
        console.group("🚨 React Error Boundary");
        console.error("Error:", errorDetails.error.message);
        console.error("Stack:", errorDetails.error.stack);
        console.error(
          "Component Stack:",
          errorDetails.errorInfo.componentStack
        );
        console.error("Full Details:", errorDetails);
        console.groupEnd();
        break;

      case "api":
        this.sendToAPI(errorDetails);
        break;

      case "localStorage":
        this.saveToLocalStorage(errorDetails);
        break;

      default:
        console.error("Error Boundary:", errorDetails);
        this.sendToAPI(errorDetails);
    }
  };

  sendToAPI = async (errorDetails) => {
    try {
      if (this.props.apiEndpoint) {
        await fetch(this.props.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorDetails),
        });
      }
      console.error("API Error Log:", errorDetails);
    } catch (apiError) {
      console.error("Failed to send error to API:", apiError);
      this.saveToLocalStorage(errorDetails);
    }
  };

  saveToLocalStorage = (errorDetails) => {
    if (typeof window !== "undefined") {
      try {
        const existingLogs = JSON.parse(
          localStorage.getItem("errorLogs") || "[]"
        );
        existingLogs.push(errorDetails);

        if (existingLogs.length > 50) {
          existingLogs.splice(0, existingLogs.length - 50);
        }

        localStorage.setItem("errorLogs", JSON.stringify(existingLogs));
        console.warn(
          "Error saved to localStorage:",
          errorDetails.error.message
        );
      } catch (storageError) {
        console.error("Failed to save error to localStorage:", storageError);
      }
    }
  };

  getErrorUI() {
    const errorMessage =
      this.state.error?.message || "An unexpected error occurred";

    if (this.props.logLevel === "console") {
      return (
        <div className="w-2/3 bg-white p-10 rounded-l-3xl fixed right-0 top-0 h-screen overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="text-orange-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Form Error</h3>
            <p className="text-gray-600 mb-4">
              There was an issue with the loan application form.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Reload Form
            </button>
          </div>
        </div>
      );
    }

    if (this.props.logLevel === "localStorage") {
      return (
        <div className="w-2/3 bg-red-50 p-10 rounded-l-3xl fixed right-0 top-0 h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Application Error
            </h2>
            <p className="text-gray-600 mb-4">
              The loan application form encountered an error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We&apos;re sorry, but an unexpected error occurred. Please try
            refreshing the page.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left mt-4 p-4 bg-gray-50 rounded border">
              <summary className="cursor-pointer font-semibold text-red-600">
                Error Details (Development Mode)
              </summary>
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() =>
                this.setState({ hasError: false, error: null, errorInfo: null })
              }
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.getErrorUI();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
