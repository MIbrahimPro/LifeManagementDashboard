const { GoogleGenerativeAI } = require("@google/generative-ai");

const CATEGORIES = ['spiritual', 'physical', 'family', 'oneonone', 'assets', 'income', 'hobby', 'politics'];

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { religion } = JSON.parse(event.body);

        console.log(`Fetching verses for ${religion}`);
        console.log(`API Key exists: ${!!process.env.GEMINI_API_KEY}`);

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY environment variable not set");
            return { statusCode: 500, body: JSON.stringify({ error: "API key not configured" }) };
        }

        // Use the API Key you stored in Netlify's Environment Variables
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a helpful assistant that provides short, inspirational verses."
        });

        // Request all verses for all categories in ONE request
        const categoriesList = CATEGORIES.join(", ");
        const prompt = `For the ${religion} religion/spiritual tradition, provide 5 short inspirational verses for each of these life categories. Format your response as JSON with this exact structure:
{
  "spiritual": ["verse1 with reference", "verse2 with reference", "verse3 with reference", "verse4 with reference", "verse5 with reference"],
  "physical": ["verse1 with reference", ...],
  "family": ["verse1 with reference", ...],
  "oneonone": ["verse1 with reference", ...],
  "assets": ["verse1 with reference", ...],
  "income": ["verse1 with reference", ...],
  "hobby": ["verse1 with reference", ...],
  "politics": ["verse1 with reference", ...]
}

Categories: ${categoriesList}

Only respond with valid JSON, no other text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        let versesData;
        try {
            versesData = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse JSON response:", text);
            return { statusCode: 500, body: JSON.stringify({ error: "Invalid response format from AI" }) };
        }

        console.log("Verses fetched successfully");

        return {
            statusCode: 200,
            body: JSON.stringify({ verses: versesData }),
        };
    } catch (error) {
        console.error("Error in get-verse function:", error.message);
        return { statusCode: 500, body: JSON.stringify({ error: error.message || "Failed to fetch verses" }) };
    }
};