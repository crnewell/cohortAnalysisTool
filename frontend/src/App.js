import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import CohortPage from "./components/CohortPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset" element={<ResetPasswordPage />} />
        <Route path="/cohort" element={<CohortPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
