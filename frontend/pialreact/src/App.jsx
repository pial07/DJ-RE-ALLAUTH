import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import PrivateRoute from "./pages/privateRoute";
import PasswordResetPage from "./pages/PasswordResetPage";
import PasswordResetConfirm from "./pages/PasswordResetConfirm";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <GoogleOAuthProvider clientId="481035378708-hul9c9uk95a4ifo2nk8758f82qmkf6ja.apps.googleusercontent.com">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route
            path="/password/reset/confirm/:uid/:token"
            element={<PasswordResetConfirm />}
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
