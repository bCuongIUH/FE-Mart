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
import UIManager from "./pages/UIManager";
import ManagerPage from "./pages/ManagerPage";
import Profile from "../src/component/profile/profile";
import UserInfo from "./component/profile/profile.UserInfo";
import ChangePassword from "./component/password/ChangePassword";


function App() {
  return (
    <Router>
      <AuthProvider> 
     
          <Routes>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/register" element={<Register />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/UIManager"
              element={
                <RequireAuth>
                  <UIManager />
                </RequireAuth>
              }
            />
             <Route
              path="/UIPage"
              element={
                <RequireAuth>
                  <UIPage />
                </RequireAuth>
              }
            />
             <Route path="/ManagerPage" element={<ManagerPage />} />
             <Route path="/Profile" element={<Profile />} /> 
             <Route path="/user-info" element={<UserInfo />} /> 
             <Route path="/change-password" element={<ChangePassword />} /> 
            
          </Routes>
        
      </AuthProvider>
    </Router>
  );
}

export default App;
