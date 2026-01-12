import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schema for a single verse with reference
const verseWithReference = z.object({
    text: z.string().describe("The verse or wisdom text"),
    reference: z.string().describe("The source or reference for the verse (book, chapter, verse, author, etc)")
});

const verseSchema = z.object({
    spiritual: z.array(verseWithReference).length(15).describe("15 spiritual verses with references"),
    physical: z.array(verseWithReference).length(15).describe("15 physical health verses with references"),
    family: z.array(verseWithReference).length(15).describe("15 family relationship verses with references"),
    oneonone: z.array(verseWithReference).length(15).describe("15 one-on-one relationship verses with references"),
    assets: z.array(verseWithReference).length(15).describe("15 asset/wealth verses with references"),
    income: z.array(verseWithReference).length(15).describe("15 income/financial verses with references"),
    hobby: z.array(verseWithReference).length(15).describe("15 hobby/creativity verses with references"),
    politics: z.array(verseWithReference).length(15).describe("15 civic/political verses with references"),
});

export const handler = async (event) => {
    // Only allow POST requests
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
                    delete schema.$schema;
                    return schema;
                })(),
            },
        });

        let prompt;
        if (religion.toLowerCase() === 'atheism') {
            prompt = `Provide 15 science-based facts, humanistic insights, or philosophical wisdom for each category. 
For EACH item, provide both:
1. "text": The insight or fact
2. "reference": The source, study, author, or context (e.g., "Psychology Today", "Carl Sagan", "MIT Study on Happiness", etc)

Categories: spiritual, physical, family, oneonone, assets, income, hobby, politics.`;
        } else {
            prompt = `Provide 15 inspirational verses or wisdom quotes from ${religion} tradition for each category.
For EACH item, provide both:
1. "text": The verse or quote
2. "reference": The source with book/chapter/verse (e.g., "Quran 2:255", "Bhagavad Gita 2.47", "Talmud Pirkei Avot 1:14", etc)

Categories: spiritual, physical, family, oneonone, assets, income, hobby, politics.`;
        }

        const result = await model.generateContent(prompt);

        // Parse and Validate
        const rawJson = JSON.parse(result.response.text());
        const validatedData = verseSchema.parse(rawJson);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verses: validatedData }),
        };
    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Failed to process request" })
        };
    }
};