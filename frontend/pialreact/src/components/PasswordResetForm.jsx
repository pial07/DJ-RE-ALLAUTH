import React, { useState } from "react";
import api from "../api";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);
      const response = await api.post("/password/reset/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Password reset email sent successfully", response.data);
      setMessage(
        "Password reset email sent successfully. Please check your inbox."
      );
      setError(""); // Clear any previous errors
    } catch (error) {
      if (error.response && error.response.data) {
        // Handle specific backend error messages (e.g. validation issues)
        const backendError =
          error.response.data.form?.fields?.email?.errors?.[0];
        if (backendError) {
          setError(backendError); // Display the specific error
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("Password reset failed. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-100 font-sans antialiased">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Reset Your Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Enter your email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Send Reset Link
              </button>

              {error && (
                <div className="mt-2 text-red-600 text-sm">{error}</div>
              )}
              {message && (
                <div className="mt-2 text-green-600 text-sm">{message}</div>
              )}
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Remembered your password?
              <a
                href="/login"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;
