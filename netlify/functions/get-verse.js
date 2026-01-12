// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { z } from "zod";
// import { zodToJsonSchema } from "zod-to-json-schema";

// // 1. Define the categories structure directly
// const categoriesSchema = z.object({
//     spiritual: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
//     physical: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
//     family: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
//     oneonone: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
//     assets: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
//     income: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
//     hobby: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
//     politics: z.array(z.object({ text: z.string(), reference: z.string() })).length(2),
// });

// export const handler = async (event) => {
//     if (event.httpMethod !== "POST") {
//         return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
//     }

//     try {
//         const { religion } = JSON.parse(event.body);
//         const apiKey = process.env.GEMINI_API_KEY;

//         const genAI = new GoogleGenerativeAI(apiKey);
//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.0-flash", // Using 2.0 Flash for maximum speed/reliability
//             generationConfig: {
//                 responseMimeType: "application/json",
//                 responseSchema: (() => {
//                     const schema = zodToJsonSchema(categoriesSchema);
//                     delete schema.$schema;
//                     return schema;
//                 })(),
//             },
//         });

//         const prompt = `Provide 2 wisdom quotes/verses for the ${religion} tradition across all life categories. 
//         Each category must be an array of objects with "text" and "reference".`;

//         const result = await model.generateContent(prompt);
//         const text = result.response.text();

//         // 2. Parse the flat object
//         const parsedData = JSON.parse(text);

//         // 3. Validate against the flat schema
//         const validatedData = categoriesSchema.parse(parsedData);

//         // 4. Wrap it in the "verses" key for your frontend
//         return {
//             statusCode: 200,
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ verses: validatedData }),
//         };
//     } catch (error) {
//         console.error("Function Error:", error);
//         // We return 200 so the frontend can handle the error message gracefully
//         return {
//             statusCode: 200, 
//             body: JSON.stringify({ error: error.message })
//         };
//     }
// };

import Groq from "groq-sdk";
import { z } from "zod";

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
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { religion } = JSON.parse(event.body);
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // logic for Atheism vs Religion
        let systemPrompt = "You are a helpful assistant that outputs only JSON.";
        let userPrompt = "";

        if (religion.toLowerCase() === 'atheism') {
            userPrompt = `Provide 2 science-based facts or humanistic philosophical insights for each category for a secular/atheist worldview. 
            Categories: spiritual, physical, family, oneonone, assets, income, hobby, politics. 
            Include a "text" and a "reference" (e.g., scientist name, study, or philosopher) for each.`;
        } else {
            userPrompt = `Provide 2 inspirational verses or wisdom quotes from the ${religion} tradition for each category: spiritual, physical, family, oneonone, assets, income, hobby, politics. 
            Include a "text" and a "reference" (e.g., Book 2:14) for each.`;
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });

        const rawJson = JSON.parse(chatCompletion.choices[0].message.content);
        const validatedData = categoriesSchema.parse(rawJson);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verses: validatedData }),
        };
    } catch (error) {
        console.error("GROQ Error:", error);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" }, // Always return JSON header
            body: JSON.stringify({ error: error.message })
        };
    }
};