import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// 1. Define the categories structure directly
const categoriesSchema = z.object({
    spiritual: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
    physical: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
    family: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
    oneonone: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
    assets: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
    income: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
    hobby: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
    politics: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
});

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const { religion } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", // Using 2.0 Flash for maximum speed/reliability
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: (() => {
                    const schema = zodToJsonSchema(categoriesSchema);
                    delete schema.$schema;
                    return schema;
                })(),
            },
        });

        const prompt = `Provide 2 wisdom quotes/verses for the ${religion} tradition across all life categories. 
        Each category must be an array of objects with "text" and "reference".`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // 2. Parse the flat object
        const parsedData = JSON.parse(text);
        
        // 3. Validate against the flat schema
        const validatedData = categoriesSchema.parse(parsedData);

        // 4. Wrap it in the "verses" key for your frontend
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verses: validatedData }),
        };
    } catch (error) {
        console.error("Function Error:", error);
        // We return 200 so the frontend can handle the error message gracefully
        return {
            statusCode: 200, 
            body: JSON.stringify({ error: error.message })
        };
    }
};