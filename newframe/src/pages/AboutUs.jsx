import React from "react";
import HomeNavBar from "../components/HomeNavBar";
import Footer from "../components/Footer";
function AboutUs() {
  return (
    <div>
      <HomeNavBar />
      <div className="h-[80vh] flex justify-center flex-col items-center">
        <img src="/images/Headphones.png" alt="Mail_Icon" className="w-32" />
        <p className="text-2xl w-[60%] text-center  font-serif mt-6">T</p>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
