const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { religion, category } = JSON.parse(event.body);

        // Use the API Key you stored in Netlify's Environment Variables
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            // This 'systemInstruction' tells the AI how to behave
            systemInstruction: "You are a helpful assistant that provides short, inspirational verses. Only provide the verse and the reference. Do not add chatty text."
        });

        const prompt = `Find a verse from ${religion} holy texts about the topic: ${category}.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ verse: text }),
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch verse" }) };
    }
};