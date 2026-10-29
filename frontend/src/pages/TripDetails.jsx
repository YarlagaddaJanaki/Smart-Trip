import { useLocation, useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import "./TripDetails.css";
import { useEffect, useState } from "react";

function TripDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itinerary, trip } = location.state || {};
  
const [mapLocation, setMapLocation] = useState(null);

useEffect(() => {
  let cancelled = false;

  async function loadMapLocation() {
    // Use existing coordinates whenever possible.
    if (trip?.lat != null && trip?.lon != null) {
      setMapLocation({
        lat: Number(trip.lat),
        lon: Number(trip.lon)
      });
      return;
    }

    const destination = [
      trip?.place,
      trip?.district,
      trip?.state
    ]
      .filter(
        value =>
          value != null &&
          String(value).trim() !== "" &&
          String(value).trim() !== "-"
      )
      .map(value => String(value).trim())
      .join(", ");

    if (!destination) {
      setMapLocation(null);
      return;
    }

    try {
      const apiBase = (
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000"
      ).replace(/\/$/, "");

      const response = await fetch(
        `${apiBase}/api/geocode?query=${encodeURIComponent(destination)}`
      );

      if (!response.ok) {
        if (!cancelled) setMapLocation(null);
        return;
      }

      const data = await response.json();

      if (!cancelled) {
        setMapLocation({
          lat: data.lat,
          lon: data.lon
        });
      }
    } catch (error) {
      console.error("Unable to load map:", error);
      if (!cancelled) setMapLocation(null);
    }
  }

  loadMapLocation();

  return () => {
    cancelled = true;
  };
}, [trip]);


  if (!itinerary) {
    return (
      <main className="trip-details-page">
        <section className="trip-details-empty">
          <span className="trip-details-empty-icon" aria-hidden="true">✈</span>
          <p className="trip-details-eyebrow">SMART TRIP</p>
          <h1>No itinerary found</h1>
          <p>Open a saved trip or create a new travel plan to see your itinerary here.</p>
          <button type="button" className="trip-primary-button" onClick={() => navigate("/saved-trips")}>
            Back to saved trips <span aria-hidden="true">↗</span>
          </button>
        </section>
      </main>
    );
  }

  const destination = itinerary.destination || trip?.place || trip?.destination || "Your destination";
  const tripPlace = [trip?.place, trip?.district, trip?.state]
  .filter(value => value && value.trim() !== "-" && value.trim() !== "")
  .join(", ");
  const days = Array.isArray(itinerary.days) ? itinerary.days : [];
  const ecoTips = Array.isArray(itinerary.eco_tips) ? itinerary.eco_tips : [];
  const hotels = Array.isArray(itinerary.hotels) ? itinerary.hotels : [];
  const restaurants = Array.isArray(itinerary.restaurants) ? itinerary.restaurants : [];

  return (
    <main className="trip-details-page">
      <div className="trip-details-container">
        <button type="button" className="trip-back-link" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span> Back
        </button>

        <header className="trip-hero">
          <div className="trip-hero-content">
            <p className="trip-details-eyebrow">YOUR JOURNEY, THOUGHTFULLY PLANNED</p>
            <h1>Discover <em>{destination}</em></h1>
            <p className="trip-hero-description">
              Your travel plan, curated for memorable moments and a little more wonder along the way.
            </p>
            <div className="trip-summary">
              <div className="trip-summary-item">
                <span className="trip-summary-icon" aria-hidden="true">⌖</span>
                <span><small>Destination</small><strong>{tripPlace || destination}</strong></span>
              </div>
              <div className="trip-summary-item">
                <span className="trip-summary-icon" aria-hidden="true">♧</span>
                <span><small>Travellers</small><strong>{trip?.people ?? trip?.adults ?? "—"}</strong></span>
              </div>
              <div className="trip-summary-item">
                <span className="trip-summary-icon" aria-hidden="true">▦</span>
                <span><small>Duration</small><strong>{trip?.days ?? days.length} days</strong></span>
              </div>
              <div className="trip-summary-item">
                <span className="trip-summary-icon" aria-hidden="true">₹</span>
                <span><small>Your budget</small><strong>₹{Number(trip?.budget ?? 0).toLocaleString("en-IN")}</strong></span>
              </div>
            </div>
          </div>
          <div className="trip-hero-stamp" aria-hidden="true">
            <span>✦</span>
            <small>MADE FOR<br />THE CURIOUS</small>
          </div>
        </header>

        <section className="trip-section trip-map-section">
          <div className="trip-section-heading">
            <div>
              <p className="trip-details-eyebrow">FIND YOUR WAY</p>
              <h2>Explore the location</h2>
            </div>
            <span className="trip-section-mark" aria-hidden="true">⌖</span>
          </div>
         {mapLocation ? (
  <MapView
    lat={mapLocation.lat}
    lon={mapLocation.lon}
  />
) : (
  <p>A map isn't available for this saved location.</p>
)}
        </section>

        <section className="trip-itinerary-section">
          <div className="trip-section-heading">
            <div>
              <p className="trip-details-eyebrow">THE PLAN</p>
              <h2>Your day-by-day itinerary</h2>
              <p className="trip-section-description">A little inspiration for every part of your journey.</p>
            </div>
            <span className="trip-section-mark" aria-hidden="true">▦</span>
          </div>
                    
            <div className="trip-days-list">
              {days.map((day, index) => (
                <article className="trip-day-card" key={day.day ?? index}>
                  <div className="trip-day-heading">
                    <span className="trip-day-number">{String(day.day || index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="trip-details-eyebrow">YOUR ADVENTURE</p>
                      <h3>Day {day.day || index + 1}</h3>
                    </div>
                  </div>
                  <div className="trip-day-periods">
                    <div className="trip-period-card trip-period-morning">
                      <span className="trip-period-icon" aria-hidden="true">☼</span>
                      <h4>Morning</h4>
                      <p>{day.morning || "Take the morning at your own pace."}</p>
                    </div>
                    <div className="trip-period-card trip-period-afternoon">
                      <span className="trip-period-icon" aria-hidden="true">◷</span>
                      <h4>Afternoon</h4>
                      <p>{day.afternoon || "Enjoy exploring the area."}</p>
                    </div>
                    <div className="trip-period-card trip-period-evening">
                      <span className="trip-period-icon" aria-hidden="true">☾</span>
                      <h4>Evening</h4>
                      <p>{day.evening || "Wind down and enjoy the evening."}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )
        </section>

        <section className="trip-section trip-cost-section">
          <div>
            <p className="trip-details-eyebrow">PLAN WITH CONFIDENCE</p>
            <h2>Estimated trip cost</h2>
            <p className="trip-section-description">A budget snapshot for your planned adventure.</p>
          </div>
          <p className="trip-cost-amount">₹{Number(itinerary.total_cost ?? trip?.budget ?? 0).toLocaleString("en-IN")}</p>
        </section>

        {hotels.length > 0 && (
          <section className="trip-section">
            <div className="trip-section-heading">
              <div>
                <p className="trip-details-eyebrow">REST & RECHARGE</p>
                <h2>Places to stay</h2>
              </div>
              <span className="trip-section-mark" aria-hidden="true">⌂</span>
            </div>
            <div className="trip-recommendation-grid">
              {hotels.map((hotel, index) => (
                <article className="trip-recommendation-card" key={`${hotel.name || "hotel"}-${index}`}>
                  <span className="trip-recommendation-kicker">STAY {String(index + 1).padStart(2, "0")}</span>
                  <h3>{hotel.name || "Recommended stay"}</h3>
                  {hotel.description && <p>{hotel.description}</p>}
                  <div className="trip-recommendation-meta">
                    {hotel.price && <span><strong>Price</strong>{hotel.price}</span>}
                    {hotel.rating && <span><strong>Rating</strong>★ {hotel.rating}</span>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {restaurants.length > 0 && (
          <section className="trip-section">
            <div className="trip-section-heading">
              <div>
                <p className="trip-details-eyebrow">A TASTE OF THE PLACE</p>
                <h2>Where to eat</h2>
              </div>
              <span className="trip-section-mark" aria-hidden="true">✳</span>
            </div>
            <div className="trip-recommendation-grid">
              {restaurants.map((restaurant, index) => (
                <article className="trip-recommendation-card trip-restaurant-card" key={`${restaurant.name || "restaurant"}-${index}`}>
                  <span className="trip-recommendation-kicker">LOCAL FAVOURITE {String(index + 1).padStart(2, "0")}</span>
                  <h3>{restaurant.name || "Recommended restaurant"}</h3>
                  {restaurant.speciality && <p>{restaurant.speciality}</p>}
                  {restaurant.cost && <div className="trip-recommendation-meta"><span><strong>Estimated cost</strong>{restaurant.cost}</span></div>}
                </article>
              ))}
            </div>
          </section>
        )}

        {ecoTips.length > 0 && (
          <section className="trip-section trip-eco-section">
            <div className="trip-section-heading">
              <div>
                <p className="trip-details-eyebrow">TRAVEL WITH CARE</p>
                <h2>Thoughtful travel tips</h2>
              </div>
              <span className="trip-section-mark" aria-hidden="true">✳</span>
            </div>
            <ul className="trip-eco-list">
              {ecoTips.map((tip, index) => (
                <li key={index}><span aria-hidden="true">✓</span>{tip}</li>
              ))}
            </ul>
          </section>
        )}

        <footer className="trip-details-footer">
          <span>SMART TRIP</span>
          <p>Travel thoughtfully. Support local communities. Leave room for wonder.</p>
        </footer>
      </div>
    </main>
  );
}

export default TripDetails;
