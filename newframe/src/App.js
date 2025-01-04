import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import LogIn from "./pages/LogIn";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Watchlist from "./pages/Watchlist";
import ProtectedRoute from "./components/ProtectedRoute";
import MovieDetails from "./pages/MovieDetails";
import CategoryPage from "./pages/CategoryPage";

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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies/:id"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/:genre"
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
