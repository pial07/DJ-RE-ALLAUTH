import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const payload = {
        uid: uid,
        token: token,
        new_password1: newPassword,
        new_password2: confirmPassword,
      };

      const response = await api.post("/password/reset/confirm/", payload);

      setMessage(
        "Password has been reset successfully. Please log in." + response.data
      );
      setError("");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        const backendError =
          error.response.data.new_password1?.[0] || error.response.data.detail;
        if (backendError) {
          setError(backendError);
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("Reset failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Set New Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
          >
            Reset Password
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="text-green-500 text-sm">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
