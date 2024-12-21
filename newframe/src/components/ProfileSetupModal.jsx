import axios from "axios";
import React, { useState } from "react";

function ProfileSetupModal({ onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      <div className="bg-white bg-opacity-90 w-3/4 h-3/4 rounded-lg shadow-lg flex flex-col justify-center items-center p-8">
        <h3 className="text-3xl text-prim-grey-p font-bold mb-6 text-center">
          Enter your name:
        </h3>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <input
            type="text"
            placeholder="John:"
            className="p-3 w-full mb-4 rounded-lg border-2 border-prim-grey-p"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Doe:"
            className="p-3 w-full mb-4 rounded-lg border-2 border-prim-grey-p"
            onChange={(e) => setLastName(e.target.value)}
          />
          <button
            type="submit"
            className="bg-prim-blue-p text-white px-6 py-3 rounded-lg hover:bg-blue-400 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetupModal;
