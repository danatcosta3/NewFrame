import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import ProfileSetupModal from "../components/ProfileSetupModal";
import RatingModal from "../components/RatingModal";
import { useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import MovieCarousel from "../components/MovieCarousel";

function Dashboard() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const moviesList = [
    {
      title: "The Shawshank Redemption",
      posterURL:
        "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
      tmdb_id: 278,
    },
    {
      title: "Inception",
      posterURL:
        "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
      tmdb_id: 27205,
    },
    {
      title: "The Godfather",
      posterURL:
        "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      tmdb_id: 238,
    },
    {
      title: "Pulp Fiction",
      posterURL:
        "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg",
      tmdb_id: 680,
    },
    {
      title: "Titanic",
      posterURL:
        "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      tmdb_id: 597,
    },
    {
      title: "The Notebook",
      posterURL:
        "https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg",
      tmdb_id: 11036,
    },
    {
      title: "Call Me by Your Name",
      posterURL:
        "https://image.tmdb.org/t/p/w500/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg",
      tmdb_id: 398818,
    },
    {
      title: "Frozen",
      posterURL:
        "https://image.tmdb.org/t/p/w500/mbPrrbt8bSLcHSBCHnRclPlMZPl.jpg",
      tmdb_id: 109445,
    },
    {
      title: "The Lion King",
      posterURL:
        "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
      tmdb_id: 8587,
    },
    {
      title: "La La Land",
      posterURL:
        "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
      tmdb_id: 313369,
    },
    {
      title: "The Matrix",
      posterURL:
        "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      tmdb_id: 603,
    },
    {
      title: "The Princess Diaries",
      posterURL:
        "https://image.tmdb.org/t/p/w500/wA4lgl8gmoICSShviCkEB61nIBB.jpg",
      tmdb_id: 9880,
    },
    {
      title: "Wonder Woman",
      posterURL:
        "https://image.tmdb.org/t/p/w500/imekS7f1OuHyUP2LAiTEM0zBzUz.jpg",
      tmdb_id: 297762,
    },
    {
      title: "The Avengers",
      posterURL:
        "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
      tmdb_id: 24428,
    },
    {
      title: "Legally Blonde",
      posterURL:
        "https://image.tmdb.org/t/p/w500/9ohlMrJHQqKhfUKh7Zr3JQqHNLZ.jpg",
      tmdb_id: 8835,
    },
    {
      title: "Forrest Gump",
      posterURL:
        "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      tmdb_id: 13,
    },
    {
      title: "Clueless",
      posterURL:
        "https://image.tmdb.org/t/p/w500/i6oWPOklGIDKG45tPjcLNH0fRNO.jpg",
      tmdb_id: 9603,
    },
    {
      title: "Step Brothers",
      posterURL:
        "https://image.tmdb.org/t/p/w500/wRR6U3K3v2iQsG3uw7ehz1ctRyT.jpg",
      tmdb_id: 12133,
    },
  ];
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
    <div className="min-h-screen">
      {/* Show Profile Setup Modal */}
      {showProfileModal && <ProfileSetupModal onSubmit={handleProfileSubmit} />}

      {/* Show Rating Modal */}
      {showRatingModal && !showProfileModal && (
        <RatingModal onSubmit={handleRatingSubmit} />
      )}

      {/* Render Dashboard Only if Modals Are Closed */}
      {!showProfileModal && !showRatingModal && (
        <div className="flex overflow-x-hidden">
          <NavBar />
          <div className="flex-1 ml-[20%] pt-5 pl-4">
            <SearchBar />
            <div className="mt-5">
              <MovieCarousel title="Trending" movies={moviesList} />
              <MovieCarousel title="For You" movies={moviesList} />
              <MovieCarousel
                title="Movies With Actors You Like"
                movies={moviesList}
              />
              <MovieCarousel title="Your Watchlist" movies={moviesList} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
