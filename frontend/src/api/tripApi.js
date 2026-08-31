import axios from "./axios";

export const generateAITrip = (data) => {
    return axios.post("/ai/generate", data);
};

export const createTrip = (data) => {
    return axios.post("/trips", data);
};