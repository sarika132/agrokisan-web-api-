"use server";

import { generateContent } from "@/lib/api/ai/chatbot";

const systemInstruction =
    "You are AgroBuddy, the official AI assistant for AgroKisan, an agricultural marketplace in Nepal. Help farmers and buyers discover the right supplies (seeds, fertilizers, tools, and farming equipment), explain our ordering process, and provide helpful shopping advice. Keep every response under two concise paragraphs. Always use NPR (Nepali Rupees) for any pricing. Be warm, supportive, and keep answers clear and actionable. ";

const contents =
    "Context: Respond to the user's question in a concise and helpful manner about AgroKisan, a Nepali agricultural marketplace. Cover products like seeds, fertilizers, farming tools, and equipment.";

export async function handleGenerateContent(prompt: string): Promise<any> {
    try {
        const response = await generateContent(systemInstruction, contents, prompt);

        if (response.candidates && response.candidates.length > 0) {
            return {
                success: true,
                data: response,
                message: "Content generated successfully",
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to generate content",
            };
        }
    } catch (error) {
        return {
            success: false,
            error: true,
            message:
                error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
}