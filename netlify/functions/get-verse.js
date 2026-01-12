

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
        let systemPrompt = "You are a helpful assistant that outputs only valid JSON. Return ONLY the JSON object, no other text.";
        let userPrompt = "";

        if (religion.toLowerCase() === 'atheism') {
            userPrompt = `Provide 2 science-based facts or humanistic philosophical insights for each category. Return as JSON with this exact structure:
{
  "spiritual": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "physical": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "family": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "oneonone": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "assets": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "income": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "hobby": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "politics": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}]
}`;
        } else {
            userPrompt = `Provide 2 inspirational verses or wisdom quotes from the ${religion} tradition. Return as JSON with this exact structure:
{
  "spiritual": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "physical": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "family": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "oneonone": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "assets": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "income": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "hobby": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}],
  "politics": [{"text": "...", "reference": "..."}, {"text": "...", "reference": "..."}]
}`;
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
        console.log("Raw JSON from Groq:", JSON.stringify(rawJson));
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