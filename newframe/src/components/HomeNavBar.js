import React from "react";
import { Link, useLocation } from "react-router-dom";

function HomeNavBar() {
  const location = useLocation(); // Get current route
  const isActive = (path) => location.pathname === path;
  return (
    <nav className="flex justify-center items-center p-4">
      <ul className="flex space-x-20 items-center text-2xl text-prim-grey-p font-bold">
        <li>
          <h1 className="font-bold text-black">
            <Link to="/">NewFrame</Link>
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
            to="/Pricing"
            className={
              isActive("/Pricing")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            to="/AboutUs"
            className={
              isActive("/AboutUs")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            About Us
          </Link>
        </li>
        <li>
          <Link
            to="/Contact"
            className={
              isActive("/Contact")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Contact
          </Link>
        </li>
        <li>
          <Link
            to="/LogIn"
            className={
              isActive("/LogIn")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Log In
          </Link>
          <button className="bg-blue-500 rounded text-white px-2 py-1 hover:bg-blue-400 ml-4 font-normal">
            <Link to="/Register">Sign Up</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
}
export default HomeNavBar;
