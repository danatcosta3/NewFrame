import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

function HomeNavBar() {
  const location = useLocation(); // Get current route
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    if (path === "/register" || path === "/login") {
      navigate(path);
      return;
    }

    apiClient
      .get("/profile")
      .then((response) => {
        if (response.status === 200) {
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log("User not logged in.");
        navigate(path);
      });
  };

  return (
    <nav className="flex justify-center items-center p-4">
      <ul className="flex space-x-20 items-center text-2xl text-prim-grey-p font-bold">
        <li>
          <h1 className="font-bold text-black">
            <Link to="/">Trey's Movies</Link>
          </h1>
        </li>
        <li>
          <Link
            to="/"
            className={
              isActive("/")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/pricing"
            className={
              isActive("/pricing")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            to="/aboutus"
            className={
              isActive("/aboutus")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            className={
              isActive("/contact")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Contact
          </Link>
        </li>
        <li>
          <button
            onClick={() => handleNavigation("/login")}
            className={
              isActive("/login")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Log In
          </button>
          <button
            onClick={() => handleNavigation("/register")}
            className="bg-blue-500 rounded text-white px-2 py-1 hover:bg-blue-400 ml-4 font-normal"
          >
            Sign Up
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default HomeNavBar;
