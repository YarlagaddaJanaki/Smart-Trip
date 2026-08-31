import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";

import {
    getSavedTrips,
    getSavedTripDetails
} from "../api/saveTripApi";

import savedTripsBg from "../assets/saved-trips-bg.jpg";


function SavedTrips() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState([]);


    useEffect(() => {
        fetchTrips();
    }, []);


    const fetchTrips = async () => {

        try {

            setLoading(true);

            const response = await getSavedTrips();

            console.log("Trips:", response.data);

            setTrips(response.data.trips || []);

        } catch (error) {

            console.error(
                "Failed to load trips:",
                error.response?.data || error
            );

            alert("Failed to load saved trips.");

        } finally {

            setLoading(false);

        }

    };


    const handleViewTrip = async (id) => {

        try {

            const response = await getSavedTripDetails(id);

            const savedTrip = response.data.trip;

            const itinerary =
                typeof savedTrip.itinerary === "string"
                    ? JSON.parse(savedTrip.itinerary)
                    : savedTrip.itinerary;


            // district + state were stored in interests
            const locationParts =
                savedTrip.interests?.split(",") || [];

            const district =
                locationParts[0]?.trim() || "";

            const state =
                locationParts[1]?.trim() || "";


            navigate("/trip-details", {

                state: {

                    itinerary,

                    trip: {
                        place: savedTrip.destination,
                        district,
                        state,
                        people: savedTrip.adults,
                        days: savedTrip.days,
                        budget: savedTrip.budget,
                        travel_style: savedTrip.travel_style
                    }

                }

            });

        } catch (error) {

            console.error(
                "Unable to load trip:",
                error.response?.data || error
            );

            alert("Unable to load trip.");

        }

    };


    if (loading) {
        return <LoadingSpinner />;
    }


    return (

        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat py-10 px-6"
            style={{
                backgroundImage: `url(${savedTripsBg})`
            }}
        >

            <div className="max-w-7xl mx-auto">

                <h1 className="text-5xl font-bold text-center text-white mb-10 drop-shadow-lg">
                    📖 Saved Trips
                </h1>

                <p className="text-center text-gray-700 mb-12 text-lg">
                    View all your AI generated travel plans.
                </p>


                {trips.length === 0 ? (

                    <div className="flex justify-center items-center mt-16">

                        <div
                            className="
                            w-full
                            max-w-md
                            bg-white/70
                            backdrop-blur-xl
                            border
                            border-white/30
                            rounded-3xl
                            shadow-2xl
                            p-6
                            text-center
                            "
                        >

                            <h2 className="text-2xl font-bold text-black mb-3">
                                No Saved Trips Yet 😔
                            </h2>

                            <p className="text-gray-600 mb-6">
                                Generate your first AI itinerary.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/create-trip")
                                }
                                className="
                                px-6
                                py-3
                                rounded-xl
                                text-white
                                font-semibold
                                bg-gradient-to-r
                                from-emerald-500
                                via-cyan-500
                                to-blue-600
                                hover:scale-105
                                hover:shadow-xl
                                transition-all
                                duration-300
                                "
                            >
                                ✈ Create Trip
                            </button>

                        </div>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {trips.map((trip) => (

                            <div
                                key={trip.id}
                                className="
                                bg-white/70
                                backdrop-blur-xl
                                border
                                border-white/30
                                rounded-3xl
                                shadow-2xl
                                p-7
                                transition-all
                                duration-300
                                hover:-translate-y-2
                                hover:shadow-3xl
                                "
                            >

                                <h2
                                    className="
                                    text-3xl
                                    font-bold
                                    mb-5
                                    bg-gradient-to-r
                                    from-emerald-600
                                    to-blue-700
                                    bg-clip-text
                                    text-transparent
                                    "
                                >
                                    🌍 {trip.destination}
                                </h2>


                                <div className="space-y-3 text-gray-700">

                                    <p>
                                        📍 {trip.interests}
                                    </p>

                                    <p>
                                        👥 {trip.adults} Travellers
                                    </p>

                                    <p>
                                        📅 {trip.days} Days
                                    </p>

                                    <p>
                                        💰 ₹{trip.budget}
                                    </p>

                                    <p>
                                        ✈️ {trip.travel_style}
                                    </p>

                                </div>


                                <div className="flex justify-center mt-7">

                                    <button
                                        onClick={() =>
                                            handleViewTrip(trip.id)
                                        }
                                        className="
                                        px-8
                                        py-3
                                        rounded-xl
                                        text-white
                                        font-semibold
                                        bg-gradient-to-r
                                        from-emerald-500
                                        via-cyan-500
                                        to-blue-600
                                        hover:scale-105
                                        hover:shadow-xl
                                        transition-all
                                        duration-300
                                        "
                                    >
                                        👁️ View Trip
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}


export default SavedTrips;