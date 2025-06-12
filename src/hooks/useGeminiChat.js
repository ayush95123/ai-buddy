import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";
import { v4 as uuidv4 } from "uuid";

/**
 * Custom hook to handle Gemini API chat interactions.
 *
 * @param {string} apiKey - Your Gemini API key.
 * @returns {{
 *   sendMessageToGemini: (userInput: string, chatHistory?: Array) => Promise<{
 *     aiMessageObj: { type: string, text: string, timestamp: string, message_id: string } | null,
 *     aiHistoryObj: { role: string, parts: Array<{ text: string }> } | null
 *   }>
 * }}
 */
const useGeminiChat = (apiKey) => {
  const sendMessageToGemini = async (userInput, chatHistory = []) => {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const geminiChat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: chatHistory,
      });

      const response = await geminiChat.sendMessage({ message: userInput });
      const aiAnswer = await response.text;

      const aiMessageObj = {
        type: "response",
        text: marked.parse(aiAnswer), // Convert Markdown to HTML
        timestamp: new Date().toLocaleTimeString(),
        message_id: uuidv4(),
      };

      const aiHistoryObj = {
        role: "model",
        parts: [{ text: aiAnswer }],
      };

      return { aiMessageObj, aiHistoryObj };
    } catch (error) {
      console.error("Gemini API error:", error.message || error);
      return { aiMessageObj: null, aiHistoryObj: null };
    }
  };

  return { sendMessageToGemini };
};

export default useGeminiChat;
