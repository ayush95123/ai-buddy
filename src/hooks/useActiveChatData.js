// useActiveChatData.js

import { useEffect, useMemo, useState } from "react";

/**
 * Custom React Hook: useActiveChatData
 *
 * This hook syncs and returns the local `messages` and `chatHistory` state
 * for the currently active chat.
 *
 * It listens for changes in the global `chats` array or `activeChat` ID,
 * and whenever either changes, it updates local state accordingly.
 *
 * @param {Array} chats - All chat sessions
 * @param {string} activeChat - The ID of the currently selected chat
 * @returns {Object} { messages, chatHistory, setMessages, setChatHistory }
 */
const useActiveChatData = (chats, activeChat) => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);

  // Memoize the active chat object to avoid unnecessary recalculations
  const activeChatObj = useMemo(() => {
    return chats?.find((chat) => chat.id === activeChat);
  }, [chats, activeChat]);

  // Sync local state with the current active chat whenever it changes
  useEffect(() => {
    setMessages(activeChatObj?.messages || []);
    setChatHistory(activeChatObj?.chatHistory || []);
  }, [activeChatObj]);

  return { messages, chatHistory, setMessages, setChatHistory };
};

export default useActiveChatData;
