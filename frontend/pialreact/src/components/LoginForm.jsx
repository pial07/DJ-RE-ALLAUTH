import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import google from "../assets/googlecolor.svg";
import github from "../assets/GitHubMark.png";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    try {
      console.log("Google token received", tokenResponse);

      // The useGoogleLogin hook provides an access_token, not an ID token
      const response = await api.post(
        "/auth/google/",
        { token: tokenResponse.access_token },
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Important: Skip the authentication token for this request
          skipAuthRefresh: true,
          withCredentials: true,
        }
      );

      console.log("Google login successful", response.data);

      // Store tokens with proper key names as defined in your token.js constants
      localStorage.setItem(ACCESS_TOKEN, response.data.access_token);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);

      // If you have any authentication state management (like context/redux)
      // Make sure to update it here

      // Force a browser reload to ensure all auth state is refreshed
      window.location.href = "/";
    } catch (error) {
      console.error(
        "Google login error",
        error.response?.data || error.message
      );
      alert("Google login failed. Please try again.");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: (error) => {
      console.error("Google login error", error);
      alert("Google login failed.");
    },
    flow: "implicit", // Use implicit flow to get the access token directly
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("login/", { email, password });

      console.log("Login successful", response.data);
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      navigate("/");
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        alert(error.response.data.detail || "Login failed.");
      } else {
        console.error("Error:", error.message);
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Sign in to your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#2563eb] focus:border-[#2563eb] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#2563eb] focus:border-[#2563eb] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-300">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/password-reset"
              className="text-sm font-medium text-[#2563eb] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-[#2563eb] hover:bg-[#1d4ed8] font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Sign in
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="flex items-center justify-center w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            <img src={google} alt="Google logo" className="w-5 h-5 mr-2" />
            Sign in with Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-full border border-gray-300 rounded-lg px-4 py-2 mt-3 bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
          >
            <img src={github} alt="GitHub logo" className="w-5 h-5 mr-2" />
            Sign in with GitHub
          </button>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4 text-center">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="font-medium text-[#2563eb] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
