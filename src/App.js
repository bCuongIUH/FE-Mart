import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import HomePage from "./component/HomePage/HomePage";
import OTPVerification from "./component/Register/OTPVerification";
import UIPage from "./pages/UIPage";
import  RequireAuth from "./untills/context/AuthenticatedRouter";
import { UserProvider } from './untills/context/UserContext';
import { AuthProvider } from './untills/context/AuthContext'; 
import UIManager from "./pages/UIManager";
import Profile from "../src/component/profile/profile";
import UserInfo from "./component/profile/profile.UserInfo";
import ChangePassword from "./component/password/ChangePassword";
import ManageEmployees from './component/employees/ManageEmployees';
import WarehouseManager from "./component/warehouseManager/WarehouseManager";
import Suppliers from "./component/suppliers/suppliers";
import ShoppingCart from "./component/shopping/shoppingCart";
import SignupContext from "./untills/context/SignupContext";
import SellPage from './component/sell/SellPage';
import StatisticsChart from "./component/Statistical/Statistical";
import ProductPage from "./component/products/ProductPage";
// import CreateUnitList from "./component/units/CreateUnitList";
// import UpdateConversionRate from "./component/units/UpdateConversionRate";




function App() {
  return (
    
    <Router>
      <AuthProvider> 
      <SignupContext>
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
            <Route
              path="/UIPage/:id"
              element={
                <RequireAuth>
                  <UIPage />
                </RequireAuth>
              }
            />
             <Route path="/ManagerPage" element={<ProductPage />} />
             <Route path="/Profile" element={<Profile />} /> 
             <Route path="/user-info" element={<UserInfo />} /> 
             <Route path="/change-password" element={<ChangePassword />} /> 
             <Route path="/ManageEmployees" element={<ManageEmployees />} />
             <Route path="/WarehouseManager" element={<WarehouseManager />} />
             <Route path="/Suppliers" element={<Suppliers />} />
             <Route path="/ShoppingCart" element={<ShoppingCart />} />
             <Route path="/ManagerSales" element={<SellPage />} />
             <Route path="/statistics" element={<StatisticsChart />} />
             
                  
                
           
          </Routes>
          </SignupContext>
      </AuthProvider>
    </Router>
  );
}

export default App;
