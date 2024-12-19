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
    <nav className="flex justify-center items-center p-4">
      <ul className="flex space-x-20 items-center text-2xl text-prim-grey-p font-bold">
        <li>
          <h1 className="font-bold text-black">
            <Link to="/">Trey's Movies</Link>
          </h1>
        </li>

        <li>
          <Link
            to="/dashboard"
            className={
              isActive("/dashboard")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/search"
            className={
              isActive("/search")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Search
          </Link>
        </li>
        <li>
          <Link
            to="/watchlist"
            className={
              isActive("/watchlist")
                ? "text-prim-blue-p border-b-2 border-blue-500 pb-1"
                : "hover:border-b-2 hover:border-blue-500 hover:pb-1"
            }
          >
            Watch List
          </Link>
        </li>
        <li>
          <button
            className="bg-blue-500 rounded text-white px-2 py-1 hover:bg-blue-400 ml-4 font-normal"
            onClick={handleLogout}
          >
            Log out
          </button>
          <button className="border-4 border-black rounded text-white px-2 py-1 hover:bg-blue-400 ml-4 font-normal">
            <Link to="/profile">👤</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
}
export default NavBar;
