import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import useGeminiChat from "./useGeminiChat";

/**
 * Custom hook to manage chat input, messages, and AI responses.
 *
 * @param {string|null} activeChatId - ID of the current chat session.
 * @param {Array} chats - Array of chat objects.
 * @param {Function} setChats - State setter to update chats array.
 * @param {Array} chatHistory - List of previous chat messages (user + AI).
 *
 * @returns {{
 *   inputValue: string,
 *   setInputValue: Function,
 *   isTyping: boolean,
 *   handleSend: Function
 * }}
 */
export function useChatLogic(activeChatId, chats, setChats, chatHistory) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const { sendMessageToGemini } = useGeminiChat(apiKey);

  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || !activeChatId) return;

    const userMsg = {
      type: "prompt",
      text,
      timestamp: new Date().toLocaleTimeString(),
      message_id: uuidv4(),
    };
    const userHistory = { role: "user", parts: [{ text }] };

    setInputValue("");
    setIsTyping(true);

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              chatHistory: [...c.chatHistory, userHistory],
            }
          : c
      )
    );

    try {
      const { aiMessageObj, aiHistoryObj } = await sendMessageToGemini(text, [
        ...chatHistory,
        userHistory,
      ]);
      if (aiMessageObj && aiHistoryObj) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? {
                  ...c,
                  messages: [...c.messages, aiMessageObj],
                  chatHistory: [...c.chatHistory, aiHistoryObj],
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to send AI message:", err);
    } finally {
      setIsTyping(false);
    }
  }, [
    activeChatId,
    chats,
    inputValue,
    chatHistory,
    sendMessageToGemini,
    setChats,
  ]);

  return {
    inputValue,
    setInputValue,
    isTyping,
    handleSend,
  };
}
