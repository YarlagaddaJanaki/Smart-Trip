
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateTrip(trip) {
    console.log("Trip received:", trip);

    const prompt = `
You are an AI Travel Planner.

Return ONLY valid JSON.

Generate a ${trip.days}-day itinerary for:

Place: ${trip.place}
District: ${trip.district || "Not specified"}
State: ${trip.state}
People: ${trip.people}
Budget: ${trip.budget}
Travel Style: ${trip.travel_style}

JSON format:

{
  "destination": "",
  "days": [
    {
      "day": 1,
      "morning": "",
      "afternoon": "",
      "evening": ""
    }
  ],
  "hotels": [
    {
      "name": "",
      "price": "",
      "rating": "",
      "description": ""
    }
  ],
  "restaurants": [
    {
      "name": "",
      "speciality": "",
      "cost": ""
    }
  ],
  "eco_tips": ["", ""],
  "total_cost": ""
}

Rules:
- Generate exactly ${trip.days} days.
- Maximum 3 hotels.
- Maximum 3 restaurants.
- Keep each activity under 12 words.
- Consider the requested budget and number of travelers.
- Return only JSON matching the requested structure.
- Do not invent hotel prices or availability as verified facts.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.7
            }
        });

        const aiResponse = response.text;

        if (!aiResponse) {
            throw new Error("Gemini returned an empty response");
        }

        console.log("AI JSON RESPONSE:");
        console.log(aiResponse);

        const parsedResponse = JSON.parse(aiResponse);

        return parsedResponse;
    } catch (error) {
        console.error("Gemini itinerary generation failed:", error.message);
        throw error;
    }
}

module.exports = {
    generateTrip
};