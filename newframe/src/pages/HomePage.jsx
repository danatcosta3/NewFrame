import React from "react";
import HomeNavBar from "../components/HomeNavBar";
import Footer from "../components/Footer";
function HomePage() {
  return (
    <div>
      <HomeNavBar />
      <div className="grid grid-cols-2 gap-8 items-center h-[calc(100vh-100px)] mx-auto px-8 max-w-screen-xl">
        {/* Left Text Section */}
        <div className="max-w-lg">
          {/* <p className="text-lg text-prim-grey-p">-FREE ACCESS-</p> */}
          <h2 className="text-6xl mt-3 leading-tight font-bold ">
            The best way to find your next movie.
          </h2>
          <h4 className="text-2xl mt-3 leading-relaxed">
            Get personalized recommendations based on your preferences.
            Collaborate with a partner to choose the perfect film for any
            occasion. Explore movies tailored to your tastes and interests.
          </h4>
          <button className="bg-prim-blue-p rounded text-white px-6 py-3 hover:bg-blue-400 font-normal mt-9 text-lg">
            Try For Free
          </button>
          <button className="px-6 py-3 border-prim-grey-p border rounded-md ml-2 text-lg hover:bg-[#F4F5F7]">
            Learn More
          </button>
        </div>

        {/* Poster Section */}
        <div className="relative w-full h-[400px]">
          <img
            src="/images/Venom.jpg"
            alt="VenomPoster"
            className="absolute left-0 top-4 z-10 w-[230px] h-[346px] object-cover rounded-3xl border-2 border-prim-grey-p"
          />
          <img
            src="/images/TheShawShankRedemption.jpg"
            alt="ShawShankRedemptionPoster"
            className="absolute left-[calc(50%-125px)] top-0 z-20 w-[250px] h-[379px] object-cover rounded-3xl border-2 border-prim-grey-p"
          />
          <img
            src="/images/TheGodFather.jpg"
            alt="GodFatherPoster"
            className="absolute right-0 top-4 z-10 w-[230px] h-[346px] object-cover rounded-3xl border-2 border-prim-grey-p"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
