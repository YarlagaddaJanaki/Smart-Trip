const { Ollama } = require("ollama");

const ollama = new Ollama({
    host: "http://127.0.0.1:11434"
});


async function generateTrip(trip) {

    console.log("Trip received:", trip);

const prompt = `
You are an AI Travel Planner.

Return ONLY valid JSON.

Generate a ${trip.days}-day itinerary for:

Place: ${trip.place}
District: ${trip.district}
State: ${trip.state}
People: ${trip.people}
Budget: ${trip.budget}
Travel Style: ${trip.travel_style}

JSON format:

{
  "destination":"",
  "days":[
    {
      "day":1,
      "morning":"",
      "afternoon":"",
      "evening":""
    }
  ],
  "hotels":[
    {
      "name":"",
      "price":"",
      "rating":"",
      "description":""
    }
  ],
  "restaurants":[
    {
      "name":"",
      "speciality":"",
      "cost":""
    }
  ],
  "eco_tips":["",""],
  "total_cost":""
}

Rules:
- Only ${trip.days} days.
- Maximum 3 hotels.
- Maximum 3 restaurants.
- Keep each activity under 12 words.
- Return ONLY JSON.
`;


    const response = await ollama.chat({

      model: "qwen2.5:3b",

    messages:[
        {
            role:"user",
            content:prompt
        }
    ],

    format:"json"

});


    const aiResponse = response.message.content;

console.log("AI JSON RESPONSE:");
console.log(aiResponse);

const parsedResponse = JSON.parse(aiResponse);

return parsedResponse;

}


module.exports = {
    generateTrip
};