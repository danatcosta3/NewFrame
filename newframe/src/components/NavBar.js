import React from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function NavBar() {
  const location = useLocation(); // Get current route
  const isActive = (path) => location.pathname === path;

  function handleLogout() {
    axios
      .post("http://localhost:5001/api/logout", {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      })
      .catch((err) => console.error("Logout failed: ", err));
  }
  return (
    <nav className="fixed z-50 left-0 top-0 h-screen w-1/5 p-4 bg-prim-offwhite rounded-r-2xl hover:ring-2 ring-prim-blue-p">
      <h1 className="font-bold text-black text-xl">
        <Link to="/">Trey's Movies</Link>
      </h1>
      <ul className="flex flex-col text-prim-grey-p font-semibold gap-12 mt-10">
        <div>
          <li className="text-prim-blue-p text-xl">Dashboard</li>
          <li className="mt-1 hover:bg-slate-300 rounded">Overview</li>
          <li className="mt-1 hover:bg-slate-300 rounded">Trending</li>
          <li className="mt-1 hover:bg-slate-300 rounded">For you</li>
        </div>
        <div>
          <li className="text-prim-blue-p text-xl">Movies</li>
          <li className="mt-1 hover:bg-slate-300 rounded">Watch List</li>
          <li className="mt-1 hover:bg-slate-300 rounded">Rate Movies</li>
          <li className="mt-1 hover:bg-slate-300 rounded">For you</li>
          <li className="mt-1 hover:bg-slate-300 rounded">Explore</li>
        </div>
        <div>
          <li className="text-prim-blue-p text-xl">Profile</li>
          <li className="mt-1 hover:bg-slate-300 rounded">User</li>
          <li className="mt-1 hover:bg-slate-300 rounded">Friends</li>
        </div>
        <div>
          <li className="text-prim-blue-p text-xl">Contact</li>
          <li className="mt-1 hover:bg-slate-300 rounded">Contact Us</li>
          <li className="mt-1 hover:bg-slate-300 rounded">
            Follow My Linkedin
          </li>
        </div>
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
        >
          Log Out
        </button>
      </ul>
    </nav>
  );
}
export default NavBar;
