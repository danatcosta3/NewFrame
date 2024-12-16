import React from "react";

function HomeNavBar() {
  return (
    <nav className="flex justify-center items-center p-4">
      <ul className="flex space-x-20 items-center text-2xl">
        <li>
          <h1 className="font-semibold">NewFrame</h1>
        </li>
        <li>
          <a href="/" className="hover:text-blue-500 hover:underline">
            Home
          </a>
        </li>
        <li>
          <a href="/" className="hover:text-blue-500 hover:underline">
            Pricing
          </a>
        </li>
        <li>
          <a href="/" className="hover:text-blue-500 hover:underline">
            About Us
          </a>
        </li>
        <li>
          <a href="/" className="hover:text-blue-500 hover:underline">
            Contact
          </a>
        </li>
        <li>
          <a href="/" className="hover:text-blue-500 hover:underline">
            Log In
          </a>
          <button className="bg-blue-500 rounded text-white px-2 py-1 hover:bg-blue-400 ml-4">
            Sign Up
          </button>
        </li>
      </ul>
    </nav>
  );
}
export default HomeNavBar;
