import { useLocation } from "react-router-dom";
import MapView from "../components/MapView";

function TripDetails() {

    const location = useLocation();

    const { itinerary, trip } = location.state || {};

    console.log("Trip:", trip);
    console.log("Itinerary:", itinerary);


    if (!itinerary) {
        return (
            <div className="p-10 text-center">
                No itinerary found
            </div>
        );
    }


    return (

        <div
            className="min-h-screen p-6 animate-fadeIn"
            style={{
                background:
                    "linear-gradient(135deg, #dbeafe 0%, #e0f7fa 35%, #dcfce7 70%, #ecfdf5 100%)"
            }}
        >

            <div className="max-w-5xl mx-auto">

                {/* Header */}

                <div className="bg-linear-to-r from-blue-600 via-cyan-500 to-green-500 text-white rounded-3xl shadow-2xl p-8 mb-8">

                    <h1 className="text-4xl font-bold">
                        🌍 {itinerary.destination || trip.place}
                    </h1>

                    <div className="mt-5 space-y-3 text-lg">

                        <p>
                            📍 {trip.place}, {trip.district}, {trip.state}
                        </p>

                        <p>
                            👥 Travellers: {trip.people}
                        </p>

                        <p>
                            📅 Duration: {trip.days} Days
                        </p>

                        <p>
                            💰 Budget: ₹{trip.budget}
                        </p>

                    </div>

                </div>


                {/* Map Section */}

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl">

                    <h2 className="text-2xl font-bold mb-4">
                        🗺️ Location Map
                    </h2>

                    {trip.lat && trip.lon ? (
                        <MapView
                            lat={trip.lat}
                            lon={trip.lon}
                            place={trip.place}
                        />
                    ) : (
                        <p className="text-gray-500">
                            Map not available for this location.
                        </p>
                    )}

                </div>


                {/* Itinerary */}

                <h2 className="text-3xl font-bold mb-4">
                    🗓️ Travel Plan
                </h2>

                {
                    itinerary.days?.map((day, index) => (

                        <div
                            key={index}
                            className="
                                bg-white
                                rounded-2xl
                                shadow-lg
                                p-6
                                mb-6
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:shadow-2xl
                            "
                        >

                            <h3 className="text-2xl font-bold mb-4">
                                Day {day.day || index + 1}
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">

                                {/* Morning */}

                                <div className="bg-orange-50 rounded-xl p-4 hover:bg-orange-100 transition-all">

                                    <h4 className="font-bold">
                                        🌅 Morning
                                    </h4>

                                    <p>
                                        {day.morning}
                                    </p>

                                </div>


                                {/* Afternoon */}

                                <div className="bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition-all">

                                    <h4 className="font-bold">
                                        ☀️ Afternoon
                                    </h4>

                                    <p>
                                        {day.afternoon}
                                    </p>

                                </div>


                                {/* Evening */}

                                <div className="bg-purple-50 rounded-xl p-4 hover:bg-purple-100 transition-all">

                                    <h4 className="font-bold">
                                        🌙 Evening
                                    </h4>

                                    <p>
                                        {day.evening}
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))
                }


                {/* Eco Friendly Travel Tips */}

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">

                    <h2 className="text-2xl font-bold mb-3">
                        🌿 Eco Friendly Travel Tips
                    </h2>

                    <ul className="space-y-2">

                        {
                            itinerary.eco_tips?.map((tip, index) => (

                                <li
                                    key={index}
                                    className="bg-green-100 rounded-lg p-3 mb-3 hover:bg-green-200 transition-all"
                                >
                                    ✅ {tip}
                                </li>

                            ))
                        }

                    </ul>

                </div>


                {/* Estimated Cost */}

                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">

                    <h2 className="text-2xl font-bold">
                        💰 Estimated Cost
                    </h2>

                    <p className="text-xl mt-2">
                        ₹{itinerary.total_cost}
                    </p>

                </div>


                {/* Hotels */}

                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all mt-6 mb-6">

                    <h2 className="text-2xl font-bold mb-4">
                        🏨 Recommended Hotels
                    </h2>

                    <div className="space-y-3">

                        {
                            itinerary.hotels?.map((hotel, index) => (

                                <div
                                    key={index}
                                    className="bg-blue-100 rounded-lg p-4 hover:bg-blue-200 transition-all duration-300"
                                >

                                    <h3 className="text-lg font-bold">
                                        {hotel.name}
                                    </h3>

                                    <p>
                                        💰 {hotel.price}
                                    </p>

                                    <p>
                                        ⭐ {hotel.rating}
                                    </p>

                                    <p>
                                        📍 {hotel.description}
                                    </p>

                                </div>

                            ))
                        }

                    </div>

                </div>


                {/* Restaurants */}

                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all mt-6">

                    <h2 className="text-2xl font-bold mb-4">
                        🍽️ Recommended Restaurants
                    </h2>

                    <div className="space-y-3">

                        {
                            itinerary.restaurants?.map((restaurant, index) => (

                                <div
                                    key={index}
                                    className="bg-orange-100 rounded-lg p-4 hover:bg-orange-200 transition-all duration-300"
                                >

                                    <h3 className="text-lg font-bold">
                                        {restaurant.name}
                                    </h3>

                                    <p>
                                        🍛 {restaurant.speciality}
                                    </p>

                                    <p>
                                        💰 {restaurant.cost}
                                    </p>

                                </div>

                            ))
                        }

                    </div>

                </div>


                {/* Footer */}

                <div className="text-center mt-10 pb-6">

                    <h3 className="text-lg font-semibold text-gray-700">
                        ✨ Generated by Smart Trip
                    </h3>

                    <p className="text-gray-500">
                        Travel Responsibly • Support Local Communities 🌿
                    </p>

                </div>

            </div>

        </div>

    );

}


export default TripDetails;