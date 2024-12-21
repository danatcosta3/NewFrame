import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import ProfileSetupModal from "../components/ProfileSetupModal";
import RatingModal from "../components/RatingModal";
import { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const { profileSetupComplete } = response.data;
        console.log(response.data);
        if (profileSetupComplete === false) {
          setShowProfileModal(true);
        }
      } catch (error) {
        console.log("Error fetching user data in dashboard: ", error);
      }
    };
    fetchUserData();
  }, []);

  const handleProfileSubmit = () => {
    setShowProfileModal(false);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    setShowRatingModal(false);
  };
  return (
    <div>
      <NavBar />
      {showProfileModal && <ProfileSetupModal onSubmit={handleProfileSubmit} />}
      {showRatingModal && <RatingModal onSubmit={handleRatingSubmit} />}
      <p className="flex justify-center items-center h-screen">
        DASHBOARD WE MADE IT
      </p>
    </div>
  );
}

export default Dashboard;
