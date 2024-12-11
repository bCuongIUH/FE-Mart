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
// import Profile from "../src/component/profile/profile";

import ChangePassword from "./component/password/ChangePassword";
import ManageEmployees from './component/employees/ManageEmployees';
import WarehouseManager from "./component/warehouseManager/WarehouseManager";
// import Suppliers from "./component/suppliers/suppliers";

import SignupContext from "./untills/context/SignupContext";
import SellPage from './component/sell/SellPage';
import StatisticsChart from "./component/Statistical/Statistical";
import ProductPage from "./component/products/ProductPage";
import HomePageDemo from "./component/HomePage/HomePageDemo";
import SupermarketLanding from "./component/HomePage/HomePageDemo";
import UIpageDemo from "./component/HomePage/UIpagedemo";


// import CreateUnitList from "./component/units/CreateUnitList";
// import UpdateConversionRate from "./component/units/UpdateConversionRate";




function App() {
  return (
    
    <Router>
      <AuthProvider> 
      <SignupContext>
  
          <Routes>
            <Route path="/" element={<SupermarketLanding />} /> 
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
             <Route path="/UIpageDemo" element={<UIpageDemo />} />
    
             <Route path="/change-password" element={<ChangePassword />} /> 
             <Route path="/ManageEmployees" element={<ManageEmployees />} />
             <Route path="/WarehouseManager" element={<WarehouseManager />} />
             {/* <Route path="/Suppliers" element={<Suppliers />} /> */}
         
             <Route path="/ManagerSales" element={<SellPage />} />
             <Route path="/statistics" element={<StatisticsChart />} />
             {/* <Route path="/HomePageDemo" element={<SupermarketLanding />} /> */}
       
             
                  
                
           
          </Routes>
          
          </SignupContext>
      </AuthProvider>
    </Router>
  );
}

export default App;
