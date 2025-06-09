import React, { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Create a context object to hold chat-related state globally
export const ChatContext = createContext();

/**
 * ChatProvider component:
 * Wraps children components with ChatContext.Provider,
 * providing global state and functions related to chat operations.
 */
export const ChatProvider = ({ children }) => {
  // State to hold all chat sessions
  const [chats, setChats] = useState([]);

  // State to track the currently active chat (by ID)
  const [activeChat, setActiveChat] = useState(null);

  /**
   * Creates a new chat session and sets it as the active chat.
   * Optionally takes an initial message to pre-fill the chat.
   *
   * @param {string} initialMessage - Optional starting message for the chat
   */
  const createNewChat = (initialMessage = "") => {
    const newChat = {
      id: uuidv4(), // Unique identifier for the chat
      displayId: `Chat ${new Date().toLocaleDateString(
        "en-GB"
      )} ${new Date().toLocaleTimeString()}`, // Display label
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

    // Add new chat to the beginning of the chat list
    setChats((prev) => [newChat, ...prev]);

    // Set this newly created chat as the active chat
    setActiveChat(newChat.id);
  };

  // Provide chat state and manipulation functions to the app
  return (
    <ChatContext.Provider
      value={{ chats, setChats, activeChat, setActiveChat, createNewChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};
