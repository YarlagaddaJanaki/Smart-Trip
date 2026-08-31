import { useState } from "react";
import { generateAITrip, createTrip } from "../api/tripApi";
import { useNavigate } from "react-router-dom";
import { getCoordinates } from "../api/locationApi";
import createTripBg from "../assets/create-trip-bg.jpg";
import LoadingSpinner from "../components/LoadingSpinner";
function CreateTrip() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);


    const [trip, setTrip] = useState({

        place: "",
        district: "",
        state: "",
        people: "",
        days: "",
        budget: "",
        travel_style: ""

    });



    const handleChange = (e) => {

        setTrip({

            ...trip,

            [e.target.name]: e.target.value

        });

    };


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);

        console.log("Sending trip:", trip);

        const location = await getCoordinates(
            trip.place,
            trip.district,
            trip.state
        );

        let lat = null;
        let lon = null;

        if (location.length > 0) {
            lat = parseFloat(location[0].lat);
            lon = parseFloat(location[0].lon);
        }

        const response = await generateAITrip(trip);

console.log("AI Response:", response.data);

const parsedItinerary = response.data.itinerary;


// Prepare trip data for backend
const tripToSave = {
    destination: trip.place,
    start_date: null,
    end_date: null,
    days: Number(trip.days),
    adults: Number(trip.people),
    children: 0,
    budget: Number(trip.budget),
    travel_style: trip.travel_style,
    interests: `${trip.district}, ${trip.state}`,
    itinerary: parsedItinerary
};


// Save trip to database
const saveResponse = await createTrip(tripToSave);

console.log("Trip saved:", saveResponse.data);


// Navigate to trip details
navigate("/trip-details", {
    state: {
        itinerary: parsedItinerary,
        trip: {
            ...trip,
            lat,
            lon
        }
    }
});

    } catch (error) {
    console.error("FULL ERROR:", error);

    if (error.response) {
        console.log("Backend Response:", error.response.data);
    }

    if (error.stack) {
        console.log(error.stack);
    }

    alert(error.message);
} finally {
        setLoading(false);
    }
};
if (loading) {
    return <LoadingSpinner />;
}

    return (

<div
    className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-8"
    style={{
        backgroundImage: `url(${createTripBg})`
    }}
>

    <div
        className="
        w-full
        max-w-5xl
        rounded-3xl
        bg-white/75
        backdrop-blur-xl
        shadow-2xl
        border border-white/40
        p-10
        "
    >

        <h1
            className="
            text-5xl
            font-extrabold
            text-center
            mb-3
            bg-gradient-to-r
            from-emerald-600
            via-cyan-600
            to-blue-700
            bg-clip-text
            text-transparent
            "
        >
            🌍 Smart Trip
        </h1>

        <p className="text-center text-gray-700 text-lg mb-10">
            Create your personalized AI-powered travel itinerary
        </p>

        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <input
                    type="text"
                    name="place"
                    placeholder="📍 Place"
                    value={trip.place}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-300 bg-white/90 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    required
                />

                <input
                    type="text"
                    name="district"
                    placeholder="🏙 District"
                    value={trip.district}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-300 bg-white/90 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    required
                />

                <input
                    type="text"
                    name="state"
                    placeholder="🌍 State"
                    value={trip.state}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-300 bg-white/90 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    required
                />

                <input
                    type="number"
                    name="people"
                    placeholder="👥 Travellers"
                    value={trip.people}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-300 bg-white/90 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    required
                />

                <input
                    type="number"
                    name="days"
                    placeholder="📅 Number of Days"
                    value={trip.days}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-300 bg-white/90 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    required
                />

                <input
                    type="text"
                    name="budget"
                    placeholder="💰 Budget (₹)"
                    value={trip.budget}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-300 bg-white/90 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    required
                />

                <select
                    name="travel_style"
                    value={trip.travel_style}
                    onChange={handleChange}
                    className="rounded-xl border border-gray-300 bg-white/90 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                    required
                >
                    <option value="">✈ Select Travel Style</option>
                    <option value="Nature">🌿 Nature</option>
                    <option value="Adventure">🏕 Adventure</option>
                    <option value="Cultural">🏛 Cultural</option>
                    <option value="Family">👨‍👩‍👧 Family</option>
                    <option value="Spiritual">🛕 Spiritual</option>
                    <option value="Luxury">🏨 Luxury</option>
                </select>

                <div></div>

            </div>

            <div className="flex justify-center mt-6">
    <button
        type="submit"
        disabled={loading}
        className={`w-64 py-3 rounded-xl font-bold text-lg text-white transition-all duration-300 ${
            loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:scale-105 hover:shadow-2xl"
        }`}
    >
        {loading ? (
            <div className="flex justify-center items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
            </div>
        ) : (
            "✨ Generate Trip"
        )}
    </button>
</div>

        </form>

    </div>

</div>

    );

}


export default CreateTrip;