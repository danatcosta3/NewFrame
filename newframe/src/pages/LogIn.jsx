import React, { useState } from "react";
import HomeNavBar from "../components/HomeNavBar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      console.log("Server Resposne:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.log(`email:${email} password: ${password}`);
      alert(`Could not log you in`);
      console.error("Error logging in. Check credentials or try agian later.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side*/}
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex justify-center w-full items-center overflow-hidden max-w-[90%] mx-auto relative">
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
          Welcome back to NewFrame.
        </h2>
      </div>
      {/* Right Side */}
      <div className="flex flex-1 bg-prim-offwhite justify-center items-center">
        <div className="w-[50vh] h-[65vh]">
          <h2 className="text-4xl font-semibold">
            Sign in to your account to continue.
          </h2>
          <form onSubmit={handleSubmit}>
            <button className="mt-4 border border-black w-full py-4 flex items-center justify-center gap-2  hover:bg-[#F4F5F7] rounded">
              <img
                src="/images/Google-Symbol.png"
                alt="GoogleLogo"
                className="w-[25px] h-[25px]"
              />
              Sign in with Google
            </button>
            <div className="text-black items-center flex mt-4">
              <hr className="flex-1 bg-black border-black" />
              <p>OR</p>
              <hr className="flex-1 bg-black border-black" />
            </div>
            <div className="flex flex-col mt-3">
              <label htmlFor="email" className="text-2xl text-prim-grey-p">
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="py-3 px-4 border-2 border-prim-grey-p rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-3">
              <label htmlFor="password" className="text-2xl text-prim-grey-p">
                Password:
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="py-3 px-4 border-2 border-prim-grey-p rounded"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="justify-between flex mt-2">
              <div className="flex align-middle items-center justify-center">
                <input
                  type="checkbox"
                  name="togglePass"
                  id="togglePass"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
                <p className="ml-2 text-prim-grey-p">Show Password</p>
              </div>
              <Link className="text-prim-blue-p hover:underline">
                Forgot your password?
              </Link>
            </div>
            <button
              type="submit"
              className="mt-4 bg-prim-blue-p text-white text-lg w-full py-4 flex items-center justify-center gap-2 hover:bg-blue-400 rounded"
            >
              Log in
            </button>
            <p className="text-center mt-2 text-prim-grey-p">
              Don't have an account?{" "}
              <Link to="/register" className="text-prim-blue-p hover:underline">
                Click here to sign up.{" "}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
