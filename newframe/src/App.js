import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import Contact from "./pages/Contact";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
