import LoanApplicationForm from "./components/LoanApplicationForm";
import ErrorBoundary from "./components/ErrorBoundary";

export default function Home() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Section */}
      <div className="w-1/3 bg-gradient-to-b from-indigo-500 to-purple-500 text-white p-10 rounded-r-3xl flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <span className="bg-white text-indigo-600 p-2 rounded-full mr-2 animate-bounce">
            💰
          </span>
          LoanApp
        </h1>
        <h2 className="text-xl font-semibold mb-4">Quick Approval</h2>
        <p className="mb-6">
          Get instant loan approval decisions within minutes of application
          submission
        </p>
        <ul className="space-y-3 text-sm">
          <li>✨ Multiple loan options available</li>
          <li>✨ No hidden fees or charges</li>
          <li>✨ 24/7 customer support</li>
          <li>✨ Flexible repayment terms</li>
        </ul>
      </div>

      <ErrorBoundary logLevel="localStorage">
        <LoanApplicationForm />
      </ErrorBoundary>
    </div>
  );
}
