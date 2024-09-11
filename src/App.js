import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import HomePage from "./component/HomePage/HomePage";
import OTPVerification from "./component/Register/OTPVerification";
import UIPage from "./pages/UIPage";
import  RequireAuth from "./component/AuthenticatedRouter";
import { UserProvider } from './untills/context/UserContext';
import { AuthProvider } from './untills/context/AuthContext'; 

function App() {
  return (
    <Router>
      <AuthProvider> 
        <UserProvider> 
          <Routes>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/register" element={<Register />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/UIPage"
              element={
                <RequireAuth>
                  <UIPage />
                </RequireAuth>
              }
            />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
