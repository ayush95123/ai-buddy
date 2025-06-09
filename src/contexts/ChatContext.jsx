import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";

// Create a context object to hold chat-related state globally
export const ChatContext = createContext();

/**
 * ChatProvider component:
 * Wraps children components with ChatContext.Provider,
 * providing global state and functions related to chat operations.
 */
export const ChatProvider = ({ children }) => {
  // Load chats from localStorage on first render
  const [chats, setChats] = useState(() => {
    try {
      const stored = localStorage.getItem("chats");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse chats from localStorage", e);
      return [];
    }
  });

  // Load activeChat from localStorage on first render
  const [activeChat, setActiveChat] = useState(() => {
    try {
      return localStorage.getItem("activeChat") || null;
    } catch (e) {
      console.error("Failed to read activeChat from localStorage", e);
      return null;
    }
  });

  // Save chats to localStorage on update
  useDebouncedEffect(
    () => {
      localStorage.setItem("chats", JSON.stringify(chats));
    },
    [chats],
    300
  ); // 300ms debounce

  // Save activeChat to localStorage on update
  useEffect(() => {
    if (activeChat !== null) {
      localStorage.setItem("activeChat", activeChat);
    } else {
      localStorage.removeItem("activeChat");
    }
  }, [activeChat]);

  /**
   * Creates a new chat session and sets it as the active chat.
   * Optionally takes an initial message to pre-fill the chat.
   *
   * @param {string} initialMessage - Optional starting message for the chat
   */
  const createNewChat = (initialMessage = "") => {
    const newChat = {
      id: uuidv4(),
      displayId: `Chat ${new Date().toLocaleDateString(
        "en-GB"
      )} ${new Date().toLocaleTimeString()}`,
      messages: initialMessage
        ? [
            {
              type: "prompt",
              text: initialMessage,
              timestamp: new Date().toLocaleTimeString(),
              message_id: uuidv4(),
            },
          ]
        : [],
      chatHistory: initialMessage
        ? [{ role: "user", parts: [{ text: initialMessage }] }]
        : [],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  return (
    <ChatContext.Provider
      value={{ chats, setChats, activeChat, setActiveChat, createNewChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
