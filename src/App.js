import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import HomePage from "./component/HomePage/HomePage";
import UIPage from "./pages/UIPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/UIPage" element={<UIPage />} />
      </Routes>
    </Router>
  );
}

export default App;
