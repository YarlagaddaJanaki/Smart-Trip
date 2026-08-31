import axios from "./axios";

// Get All Trips
export const getSavedTrips = () => {
    return axios.get("/trips");
};

// Get One Trip
export const getSavedTripDetails = (id) => {
    return axios.get(`/trips/${id}`);
};