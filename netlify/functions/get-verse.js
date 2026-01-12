

import Groq from "groq-sdk";
import { z } from "zod";

const verseObjectSchema = z.object({ text: z.string(), reference: z.string() });

const categoriesSchema = z.object({
    spiritual: z.array(verseObjectSchema).optional(),
    physical: z.array(verseObjectSchema).optional(),
    family: z.array(verseObjectSchema).optional(),
    oneonone: z.array(verseObjectSchema).optional(),
    assets: z.array(verseObjectSchema).optional(),
    income: z.array(verseObjectSchema).optional(),
    hobby: z.array(verseObjectSchema).optional(),
    politics: z.array(verseObjectSchema).optional(),
}).strict();

const defaultVerses = {
    spiritual: [{ text: "Focus on your inner growth and spiritual practice.", reference: "Universal Wisdom" }],
    physical: [{ text: "Take care of your body as it is your temple.", reference: "Universal Wisdom" }],
    family: [{ text: "Nurture your relationships with love and patience.", reference: "Universal Wisdom" }],
    oneonone: [{ text: "Treat others with kindness and respect.", reference: "Universal Wisdom" }],
    assets: [{ text: "Manage your resources wisely and responsibly.", reference: "Universal Wisdom" }],
    income: [{ text: "Work with integrity and pursue honest income.", reference: "Universal Wisdom" }],
    hobby: [{ text: "Pursue activities that bring you joy and fulfillment.", reference: "Universal Wisdom" }],
    politics: [{ text: "Engage in civic life with compassion and reason.", reference: "Universal Wisdom" }],
};

const fillMissingCategories = (data) => {
    const result = {};
    Object.keys(defaultVerses).forEach(category => {
        result[category] = (data[category] && data[category].length > 0) ? data[category] : defaultVerses[category];
    });
    return result;
};

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
        const filledData = fillMissingCategories(validatedData);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verses: filledData }),
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