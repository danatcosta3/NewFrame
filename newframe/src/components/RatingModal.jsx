import axios from "axios";
import React, { useState } from "react";

function RatingModal({ onSubmit }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = `${firstName.trim()} ${lastName.trim()}`;
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/setUserName",
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("Name set successfully!");
      onSubmit();
    } catch (error) {
      alert("Error saving your name, please try again.");
      console.error("Error in profile setup modal", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8 flex flex-col items-center h-[60vh]">
        {/* Text and Buttons in One Row */}
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-3xl text-black font-bold text-center mb-2">
              Help us learn more about you.
            </h3>
            <h4 className="text-lg text-gray-600">
              Click on movies you have seen and give your rating
            </h4>
          </div>
          <div className="flex space-x-4">
            <button className="px-6 py-3 border border-gray-400 rounded-md text-lg hover:bg-gray-100">
              Clear
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-500">
              Submit
            </button>
          </div>
        </div>
        <div className="border-2 bg-yellow-500 w-full h-full ">
          <h1></h1>
        </div>
        {/* Other Content */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm mt-6"></form>
      </div>
    </div>
  );
}

export default RatingModal;
