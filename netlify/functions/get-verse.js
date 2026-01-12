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
            model: "gemini-2.5-flash"
        });

        let prompt;

        // Special handling for Atheism/Secular worldview
        if (religion.toLowerCase() === 'atheism') {
            prompt = `For a secular/atheist worldview, provide 5 science-based facts, philosophical insights, or wisdom quotes for each of these life categories. These should be grounded in evidence, reason, and humanistic values. Format your response as JSON with this exact structure:
{
  "spiritual": ["science/philosophy fact with source or reference", "insight with context", ...],
  "physical": ["science fact about health", "evidence-based insight", ...],
  "family": ["psychology/relationship science fact", ...],
  "oneonone": ["interpersonal science or wisdom", ...],
  "assets": ["economics or financial wisdom", ...],
  "income": ["career/financial science fact", ...],
  "hobby": ["psychology of creativity/flow", ...],
  "politics": ["civics/political science fact", ...]
}

Focus on:
- Scientific research findings
- Evidence-based wisdom
- Humanistic philosophy
- Logical reasoning
- Psychological insights

Only respond with valid JSON, no other text.`;
        } else {
            // Standard religious/spiritual prompt
            prompt = `For the ${religion} religion/spiritual tradition, provide 5 short inspirational verses, sayings, or wisdom quotes for each of these life categories. Format your response as JSON with this exact structure:
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

Categories: ${CATEGORIES.join(", ")}

Only respond with valid JSON, no other text.`;
        }

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