import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import "./SavedTrips.css";

function SavedTrips() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTrips = async () => {
      try {
        const response = await axios.get("/trips");

        if (isMounted) {
          setTrips(Array.isArray(response.data.trips) ? response.data.trips : []);
        }
      } catch (error) {
        console.error("Failed to load saved trips:", error.response?.data || error);

        if (isMounted) {
          setErrorMessage(
            error.response?.status === 401
              ? "Your session may have expired. Please sign in again."
              : "We couldn't load your saved trips. Please try again."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTrips();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewTrip = async (id) => {
    try {
      const response = await axios.get(`/trips/${id}`);
      const savedTrip = response.data.trip;

      if (!savedTrip) {
        throw new Error("The server did not return the requested trip.");
      }

      const itinerary =
        typeof savedTrip.itinerary === "string"
          ? JSON.parse(savedTrip.itinerary)
          : savedTrip.itinerary;

      // Only use interests as a location fallback when it looks like location data.
      const locationParts = (typeof savedTrip.interests === "string"
        ? savedTrip.interests
        : "").split(",");
      const district = locationParts[0]?.trim() || "";
      const state = locationParts[1]?.trim() || "";

      navigate("/trip-details", {
        state: {
          itinerary,
          trip: {
            ...savedTrip,
            place: savedTrip.destination,
            district: district === "-" ? "" : district,
            state: state === "-" ? "" : state,
            people: savedTrip.adults,
            days: savedTrip.days,
            budget: savedTrip.budget,
            travel_style: savedTrip.travel_style,
          },
        },
      });
    } catch (error) {
      console.error("Unable to load trip:", error.response?.data || error);
      alert("Unable to load this trip. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main className="saved-trips-page">
      <div className="saved-trips-container">
        <button
  className="saved-back-button"
  onClick={() => navigate("/dashboard")}
>
  <span aria-hidden="true">←</span>
  Back to Home
</button>
        <header className="saved-trips-heading">
          <p className="saved-eyebrow">YOUR TRAVEL COLLECTION</p>
          <h1>Every trip has a <em>story.</em></h1>
          <p className="saved-subtitle">
            Revisit your plans and keep your next adventure close.
          </p>
        {!errorMessage && trips.length > 0 && (
            <div className="saved-trips-count">
              <span className="saved-count-number">{trips.length}</span>
              <span>{trips.length === 1 ? "saved adventure" : "saved adventures"}</span>
            </div>
          )}
        </header>

        {errorMessage ? (
          <section className="saved-empty saved-error" role="alert">
            <span className="saved-empty-icon" aria-hidden="true">!</span>
            <h2>Something went wrong</h2>
            <p>{errorMessage}</p>
            <button
              className="saved-view-button saved-create-button"
              onClick={() => window.location.reload()}
            >
              Try again <span aria-hidden="true">↻</span>
            </button>
          </section>
        ) : trips.length === 0 ? (
          <section className="saved-empty">
            <span className="saved-empty-icon" aria-hidden="true">✈</span>
            <h2>Your next adventure awaits</h2>
            <p>
              Your saved travel plans will appear here. Start planning
              somewhere wonderful.
            </p>
            <button
              className="saved-view-button saved-create-button"
              onClick={() => navigate("/create-trip")}
            >
              Plan a trip <span aria-hidden="true">↗</span>
            </button>
          </section>
        ) : (
          <section className="saved-trips-grid" aria-label="Saved trips">
            {trips.map((trip, index) => {
              const destination = trip.destination || trip.place || "Your adventure";

              // Hide missing values, blanks, and placeholder dashes.
              const locationParts = [
                trip.district,
                trip.state,
              ]
                .filter((value) => value != null)
                .map((value) => String(value).trim())
                .filter((value) => value !== "" && value !== "-");

              // Older saved records may store location in interests/location.
              const fallbackLocation = String(trip.interests || trip.location || "")
                .split(",")
                .map((value) => value.trim())
                .filter((value) => value !== "" && value !== "-");

              const location = locationParts.length
                ? [...new Set(locationParts)].join(", ")
                : [...new Set(fallbackLocation)].join(", ");

              const people = trip.adults ?? trip.people ?? 2;
              const days = trip.days ?? "—";
              const parsedBudget = Number(trip.budget ?? 0);
              const budget = Number.isFinite(parsedBudget) ? parsedBudget : 0;
              const style = trip.travel_style || trip.travelStyle || "Explore";

              return (
                <article className="saved-trip-card" key={trip.id ?? trip.trip_id ?? index}>
                  <div className="saved-trip-top">
                    <span className="saved-trip-number">TRIP {String(index + 1).padStart(2, "0")}</span>
                    <span className="saved-trip-dot" aria-hidden="true" />
                  </div>

                  <h2>{destination}</h2>

                  {location && (
                    <p className="saved-trip-location">
                      <span aria-hidden="true">⌖</span>
                      <span>{location}</span>
                    </p>
                  )}

                  <div className="saved-trip-details">
                    <div>
                      <span className="detail-icon" aria-hidden="true">♧</span>
                      <span>{people} Travellers</span>
                    </div>
                    <div>
                      <span className="detail-icon" aria-hidden="true">▦</span>
                      <span>{days} Days</span>
                    </div>
                    <div>
                      <span className="detail-icon" aria-hidden="true">₹</span>
                      <span>₹{budget.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="detail-icon" aria-hidden="true">✧</span>
                      <span>{style}</span>
                    </div>
                  </div>

                  <button
                    className="saved-view-button"
                    onClick={() => handleViewTrip(trip.id ?? trip.trip_id)}
                  >
                    View itinerary <span aria-hidden="true">↗</span>
                  </button>
                </article>
              );
            })}
          </section>
        )}

        <footer className="saved-trips-footer">
          <span>SMART TRIP</span>
          <span>Made for the curious.</span>
        </footer>
      </div>
    </main>
  );
}

export default SavedTrips;
