import React from "react";
import HomeNavBar from "../components/HomeNavBar";
import { Link, useLocation } from "react-router-dom";

function Register() {
  return (
    <div className="flex h-screen">
      {/* Left Side*/}
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-row w-full items-center ">
          <img
            src="/images/Venom.jpg"
            alt="VenomPoster"
            className="relative left-16 mx-auto w-[230px] h-[346px] object-cover rounded-3xl border-2 border-prim-grey-p"
          />
          <img
            src="/images/TheShawShankRedemption.jpg"
            alt="ShawShankRedemptionPoster"
            className="mx-auto z-20 w-[250px] h-[379px] object-cover rounded-3xl border-2 border-prim-grey-p"
          />
          <img
            src="/images/TheGodFather.jpg"
            alt="GodFatherPoster"
            className="relative right-16 mx-auto z-10 w-[230px] h-[346px] object-cover rounded-3xl border-2 border-prim-grey-p"
          />
        </div>
        <h2 className="text-center pt-10 text-3xl font-semibold">
          Welcome to NewFrame.
        </h2>
      </div>
      {/* Right Side */}
      <div className="flex flex-1 bg-prim-offwhite justify-center items-center">
        <div className="w-[50vh] h-[65vh]">
          <h2 className="text-4xl font-semibold">
            Create an account to continue.
          </h2>
          <button className="mt-4 border border-black w-full py-4 flex items-center justify-center gap-2  hover:bg-[#F4F5F7]">
            <img
              src="/images/Google-Symbol.png"
              alt="GoogleLogo"
              className="w-[25px] h-[25px]"
            />
            Sign up with Google
          </button>
          <p className="mt-5">
            ---------------------------or---------------------------
          </p>
          <div className="flex flex-col mt-3">
            <label htmlFor="email" className="text-2xl text-prim-grey-p">
              Email:
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="py-3 px-4 border-2"
            />
          </div>
          <div className="flex flex-col mt-3">
            <label htmlFor="password" className="text-2xl text-prim-grey-p">
              Password:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="py-3 px-4 border-2"
            />
          </div>
          <div className="flex mt-1">
            <input type="checkbox" name="" id="" />
            <p className="ml-2 text-prim-grey-p">Show Password</p>
          </div>
          <button className="mt-4 bg-prim-blue-p text-white text-lg w-full py-4 flex items-center justify-center gap-2 hover:bg-blue-400">
            Create an account
          </button>
          <p className="text-center mt-2 text-prim-grey-p">
            Already have an account?{" "}
            <Link to="/login" className="text-prim-blue-p hover:underline">
              Click here to sign in.{" "}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
