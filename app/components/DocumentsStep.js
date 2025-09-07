"use client";

import { useForm } from "react-hook-form";
import { Upload } from "lucide-react"; // Icon (can use any)

export default function DocumentsStep({ onBack, onNext }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Uploaded Documents:", data);
    onNext(); // move to confirmation step
  };

  const documents = [
    { label: "Aadhaar Card", name: "aadhaar" },
    { label: "PAN Card", name: "pan" },
    { label: "Bank Statement (Last 3 months)", name: "bankStatement" },
    { label: "Salary Slip (Last 3 months)", name: "salarySlip" },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Upload Required Documents
      </h2>
      <p className="text-gray-500 mb-8">
        Please upload the following documents to proceed with your loan application
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {documents.map((doc) => (
          <div key={doc.name}>
            <label className="block text-gray-700 mb-2">{doc.label}</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload your {doc.label}
              </p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG (Max: 5MB)</p>
              <input
                type="file"
                {...register(doc.name)}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
            </label>
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
}
