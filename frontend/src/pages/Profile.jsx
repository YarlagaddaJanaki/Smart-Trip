import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedTrips } from "../api/saveTripApi";
import LoadingSpinner from "../components/LoadingSpinner";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Unable to read saved user information:", error);
  }

  const [loading, setLoading] = useState(true);
  const [tripCount, setTripCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchTrips = async () => {
      try {
        const response = await getSavedTrips();
        const trips = response.data?.trips;

        if (isMounted) {
          setTripCount(Array.isArray(trips) ? trips.length : 0);
        }
      } catch (error) {
        console.error(
          "Unable to load saved trips count:",
          error.response?.data || error
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="profile-page">
      <div className="profile-layout">
        <section className="profile-intro">
          <p className="profile-eyebrow">YOUR SPACE, YOUR JOURNEY</p>
          <h1>
            Every journey
            <br />
            starts <em>with you.</em>
          </h1>
          <p className="profile-intro-copy">
            Your travel details, your saved adventures, and everything you
            need for your next journey — all in one place.
          </p>

          <div className="profile-note">
            <span className="profile-note-icon" aria-hidden="true">✦</span>
            <div>
              <h2>Your travel story</h2>
              <p>
                Keep exploring, collecting memories, and planning somewhere
                wonderful.
              </p>
            </div>
          </div>
        </section>

         <section className="profile-card" aria-labelledby="profile-title">
          <div className="profile-card-top">
            <div className="profile-avatar" aria-hidden="true">
              {(user?.name || "T").trim().charAt(0).toUpperCase()}
            </div>
            <p className="profile-card-eyebrow">ACCOUNT OVERVIEW</p>
            <h2 id="profile-title">My Profile</h2>
            <p className="profile-welcome">Welcome back to Smart Trip</p>
          </div>

          <div className="profile-details">
            <article className="profile-detail">
              <span className="profile-detail-icon" aria-hidden="true">♙</span>
              <div className="profile-detail-text">
                <p>Full Name</p>
                <h3>{user?.name || "Name not available"}</h3>
              </div>
            </article>

            <article className="profile-detail">
              <span className="profile-detail-icon" aria-hidden="true">✉</span>
              <div className="profile-detail-text">
                <p>Email Address</p>
                <h3 className="profile-email">
                  {user?.email || "Email not available"}
                </h3>
              </div>
            </article>

            <article className="profile-detail profile-trip-detail">
              <span className="profile-detail-icon" aria-hidden="true">✈</span>
              <div className="profile-detail-text">
                <p>Saved Trips</p>
                <h3>{tripCount}</h3>
              </div>
              <button
                type="button"
                className="profile-small-link"
                onClick={() => navigate("/saved-trips")}
              >
                View trips <span aria-hidden="true">↗</span>
              </button>
            </article>
          </div>

          <button
            type="button"
            className="profile-logout-button"
            onClick={handleLogout}
          >
            <span aria-hidden="true">↪</span>
            Logout
          </button>

          <p className="profile-card-footer">
            <span>SMART TRIP</span>
            <span>Made for the curious.</span>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Profile;

