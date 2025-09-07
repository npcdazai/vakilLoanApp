"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorBoundary from "./ErrorBoundary";
import { logError } from "../utils/errorLogger";
import DocumentsStep from "./DocumentsStep";
import CongratsPage from "./CongratsPage";

export default function LoanApplicationForm() {
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, name: "Personal Details" },
    { id: 2, name: "Documents" },
    { id: 3, name: "Confirmation" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const today = new Date();
  const minAgeDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const fields = [
    {
      label: "Loan Type*",
      name: "loanType",
      type: "select",
      options: ["Personal Loan", "Home Loan", "Car Loan"],
    },
    {
      label: "Employment Profile*",
      name: "employment",
      type: "select",
      options: ["Salaried", "Self Employed"],
    },
    {
      label: "Monthly Income (₹)*",
      name: "income",
      type: "number",
      placeholder: "50,000",
    },
    {
      label: "Loan Amount (₹)*",
      name: "loanAmount",
      type: "text",
      placeholder: "1,00,000",
      format: (value) => {
        if (!value) return "";
        const raw = value.replace(/\D/g, "");
        return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      parse: (value) => value.replace(/,/g, ""),
    },
    {
      label: "First Name*",
      name: "firstName",
      type: "text",
      placeholder: "As per PAN card",
    },
    {
      label: "Last Name*",
      name: "lastName",
      type: "text",
      placeholder: "As per PAN card",
    },
    {
      label: "Mobile Number*",
      name: "mobile",
      type: "text",
      placeholder: "9876543210",
    },
    {
      label: "Email Address*",
      name: "email",
      type: "email",
      placeholder: "name@example.com",
    },
    {
      label: "Gender*",
      name: "gender",
      type: "select",
      options: ["Male", "Female", "Other"],
    },
    {
      label: "Date of Birth*",
      name: "dob",
      type: "date",
      max: minAgeDate,
      validate: (value) => {
        if (!value) return "Date of Birth is required";
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        const isBirthdayPassed =
          m > 0 || (m === 0 && today.getDate() >= dob.getDate());
        const exactAge = isBirthdayPassed ? age : age - 1;
        return exactAge >= 18 || "You must be at least 18 years old";
      },
    },
    {
      label: "PAN Number*",
      name: "pan",
      type: "text",
      placeholder: "ABCDE1234F",
      validate: (value) => {
        if (!value) return "PAN Number is required";
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(value) || "Invalid PAN format (e.g., ABCDE1234F)";
      },
    },
    {
      label: "PIN Code*",
      name: "pincode",
      type: "text",
      placeholder: "400001",
    },
  ];

  const onSubmit = async (data) => {
    try {
      console.log("Form Submitted:", data);
      if (step < 3) {
        setStep(step + 1);
      } else {
        alert("Application Completed ✅");
      }
    } catch (error) {
      await logError(error, {
        component: "LoanApplicationForm",
        action: "form_submission",
        step: step,
        userId: data.email || "anonymous",
        formData: data,
      });

      alert(
        "An error occurred while processing your application. Please try again."
      );
    }
  };

  return (
    <ErrorBoundary logLevel="console">
      <div className="w-full md:w-2/3 bg-white p-6 md:p-10 rounded-none md:rounded-l-3xl fixed md:right-0 top-0 h-screen overflow-y-auto transition-all duration-500 ease-in-out">
        {/* Stepper */}
        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 relative">
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <div
                key={s.id}
                className="flex-1 flex flex-col items-center relative z-10"
              >
                {/* Circle */}
                <div
                  className={`relative w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-500 
            ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 scale-110 shadow-2xl shadow-indigo-400/50"
                : ""
            }
            ${
              isCompleted
                ? "bg-gradient-to-r from-green-400 to-green-600 shadow-lg"
                : ""
            }
            ${!isActive && !isCompleted ? "bg-gray-300" : ""}`}
                  onClick={() => setStep(s.id)}
                >
                  <span
                    className={`font-bold text-white ${
                      isActive ? "animate-pulse" : ""
                    }`}
                  >
                    {isCompleted ? "✓" : s.id}
                  </span>

                  {/* Glow ring */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border-2 border-indigo-300 animate-ping"></span>
                  )}
                </div>

                {/* Step Name */}
                <p
                  className={`mt-3 text-xs sm:text-sm text-center transition-all duration-300 
            ${isActive ? "text-indigo-600 font-semibold" : "text-gray-500"}`}
                >
                  {s.name}
                </p>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-1 -z-10 transition-all duration-500 
              ${
                isCompleted
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : "bg-gray-300"
              }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Conditional Rendering based on step */}
        {step === 1 && (
          <>
            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn text-sm"
            >
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-700">{field.label}</label>

                  {field.type === "select" ? (
                    <select
                      {...register(field.name, { required: true })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="">
                        Select {field.label.replace("*", "")}
                      </option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "date" ? (
                    <input
                      type="date"
                      max={field.max}
                      {...register(field.name, {
                        required: `${field.label} is required`,
                        validate: field.validate,
                      })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={
                        field.name === "loanAmount"
                          ? field.format(watch(field.name) || "")
                          : watch(field.name) || ""
                      }
                      onChange={(e) => {
                        const val = field.parse
                          ? field.parse(e.target.value)
                          : e.target.value;
                        setValue(field.name, val, { shouldValidate: true });
                      }}
                      {...register(field.name, {
                        required: `${field.label} is required`,
                        validate: field.validate,
                      })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  )}

                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}

              {/* Checkbox */}
              <div className="col-span-1 md:col-span-2 mt-4">
                <label className="flex items-start text-sm">
                  <input
                    type="checkbox"
                    {...register("terms", { required: true })}
                    className="mr-2 mt-1 cursor-pointer"
                  />
                  You agree to our{" "}
                  <a href="#" className="text-indigo-600 underline ml-1">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 underline ml-1">
                    Privacy Policy
                  </a>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-xs">You must accept Terms</p>
                )}
              </div>
            </form>

            {/* Button */}
            <div className="mt-6">
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 hover:bg-indigo-700 active:scale-95 cursor-pointer"
              >
                Next: Upload Documents
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <DocumentsStep
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && ( <CongratsPage/> )}
      </div>
    </ErrorBoundary>
  );
}
