require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

async function listModels() {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    try {
        const result = await ai.models.list();

        for await (const model of result) {
            if (model.supportedActions?.includes("generateContent")) {
                console.log(model.name);
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();