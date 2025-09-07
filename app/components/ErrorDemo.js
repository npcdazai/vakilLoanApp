"use client";

import { useState } from 'react';
import { logError, createErrorLogger } from '../utils/errorLogger';
import ErrorBoundary from './ErrorBoundary';

const consoleLogger = createErrorLogger({
  enableConsole: true,
  enableLocalStorage: false,
  enableAPI: false,
  logLevel: 'error'
});

const localStorageLogger = createErrorLogger({
  enableConsole: false,
  enableLocalStorage: true,
  enableAPI: false,
  logLevel: 'warn'
});

const apiLogger = createErrorLogger({
  enableConsole: true,
  enableLocalStorage: true,
  enableAPI: true,
  apiEndpoint: '/api/errors',
  logLevel: 'info'
});

function BuggyComponent({ shouldCrash }) {
  if (shouldCrash) {
    throw new Error('Intentional error for testing Error Boundary');
  }
  return <div className="text-green-600">Component working fine!</div>;
}

export default function ErrorDemo() {
  const [shouldCrash, setShouldCrash] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const triggerConsoleError = async () => {
    try {
      throw new Error('Console logging test error');
    } catch (error) {
      await consoleLogger.log(error, {
        component: 'ErrorDemo',
        action: 'console_test',
        severity: 'high'
      });
    }
  };

  const triggerLocalStorageError = async () => {
    try {
      throw new Error('LocalStorage logging test error');
    } catch (error) {
      await localStorageLogger.log(error, {
        component: 'ErrorDemo',
        action: 'localStorage_test',
        severity: 'medium'
      });
      alert('Error logged to localStorage. Check browser DevTools > Application > Local Storage.');
    }
  };

  const triggerAPIError = async () => {
    try {
      throw new Error('API logging test error');
    } catch (error) {
      await apiLogger.log(error, {
        component: 'ErrorDemo',
        action: 'api_test',
        severity: 'low'
      });
      alert('Error sent to API (will fallback to localStorage if API unavailable).');
    }
  };

  const triggerRuntimeError = async () => {
    try {
      const data = null;
      console.log(data.nonExistentProperty.value);
    } catch (error) {
      await logError(error, {
        component: 'ErrorDemo',
        action: 'runtime_error_simulation',
        userId: 'demo-user'
      });
    }
  };

  const showStoredLogs = () => {
    const logs = JSON.parse(localStorage.getItem('appErrorLogs') || '[]');
    console.group('📋 Stored Error Logs');
    console.table(logs);
    console.groupEnd();
    alert(`Found ${logs.length} stored error logs. Check browser console for details.`);
  };

  const clearLogs = () => {
    localStorage.removeItem('appErrorLogs');
    alert('Error logs cleared from localStorage.');
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Error Logging Demo</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={triggerConsoleError}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🖥️ Console Error
        </button>
        
        <button
          onClick={triggerLocalStorageError}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          💾 LocalStorage Error
        </button>
        
        <button
          onClick={triggerAPIError}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📡 API Error
        </button>
        
        <button
          onClick={triggerRuntimeError}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          ⚡ Runtime Error
        </button>
      </div>

      <div className="border-t pt-4 mb-6">
        <h4 className="font-semibold mb-2">Error Boundary Test:</h4>
        <ErrorBoundary
          key={resetKey}
          logLevel="console"
          fallback={(error) => (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error Boundary Caught:</strong> {error?.message}
              <button
                onClick={() => {
                  setShouldCrash(false);
                  setResetKey(prev => prev + 1);
                }}
                className="ml-4 bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          )}
        >
          <BuggyComponent shouldCrash={shouldCrash} />
        </ErrorBoundary>
        
        <button
          onClick={() => setShouldCrash(true)}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          disabled={shouldCrash}
        >
          💥 Crash Component
        </button>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Log Management:</h4>
        <div className="flex gap-2">
          <button
            onClick={showStoredLogs}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            📋 View Stored Logs
          </button>
          
          <button
            onClick={clearLogs}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            🧹 Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}