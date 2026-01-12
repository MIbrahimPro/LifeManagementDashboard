import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 1. Single Item Schema
const verseWithReference = z.object({
    text: z.string().describe("The verse or wisdom text"),
    reference: z.string().describe("The source or reference (book, chapter, verse, author)")
});

// 2. Full Container Schema
// We wrap everything in an object named 'verses' to match your return structure
const verseSchema = z.object({
    verses: z.object({
        spiritual: z.array(verseWithReference).length(2),
        physical: z.array(verseWithReference).length(2),
        family: z.array(verseWithReference).length(2),
        oneonone: z.array(verseWithReference).length(2),
        assets: z.array(verseWithReference).length(2),
        income: z.array(verseWithReference).length(2),
        hobby: z.array(verseWithReference).length(2),
        politics: z.array(verseWithReference).length(2),
    })
});

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { religion } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return { statusCode: 500, body: JSON.stringify({ error: "API key not configured" }) };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: (() => {
                    const schema = zodToJsonSchema(verseSchema);
                    delete schema.$schema; // Gemini rejects this key
                    return schema;
                })(),
            },
        });

        // 3. Clearer Prompt with explicit instruction for the "verses" key
        const promptType = religion.toLowerCase() === 'atheism' ? 'science-based facts' : `verses from ${religion}`;
        const prompt = `Generate a JSON object with a top-level key "verses". 
Inside "verses", provide 2 ${promptType} for each of these categories: spiritual, physical, family, oneonone, assets, income, hobby, and politics.
Each item must have a "text" and a "reference" field.`;

        const result = await model.generateContent(prompt);
        const rawResponse = result.response.text();

        // 4. Parse and Validate
        // This will now pass because both expect { "verses": { ... } }
        const validatedData = verseSchema.parse(JSON.parse(rawResponse));

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validatedData),
        };
    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 200, // Returning 200 with error body as per your requirement
            body: JSON.stringify({ error: error.message || "Failed to process request" })
        };
    }
};