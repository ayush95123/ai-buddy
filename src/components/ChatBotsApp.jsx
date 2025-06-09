import React, { useContext, useEffect, useRef, useState } from "react";
import "../css/ChatBotsApp.css";
import { v4 as uuidv4 } from "uuid";
import useActiveChatData from "../hooks/useActiveChatData";
import { ChatContext } from "../contexts/ChatContext";
import useGeminiChat from "../hooks/useGeminiChat";
import Message from "../components/Message";

/**
 * ChatBotsApp - Main chat application component
 * Handles rendering the chat UI, sending messages, and managing chat state
 */

// #TODO local storage
// #FIXME when entering twice rapidly before response incorrect behaviour

const ChatBotsApp = ({ onGoBack }) => {
  const { chats, setChats, activeChat, setActiveChat, createNewChat } = useContext(ChatContext);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Get the current active chat object
  const activeChatObj = chats?.find((chat) => chat.id === activeChat);

  // Custom hook to sync chat messages and history
  const { messages, chatHistory, setMessages, setChatHistory } = useActiveChatData(chats, activeChat);

  // Gemini API integration hook
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const { sendMessageToGemini } = useGeminiChat(apiKey);

  // Ref to scroll to the bottom of chat
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle text input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle sending of user message
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = {
      type: "prompt",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      message_id: uuidv4(),
    };

    const userHistoryObj = {
      role: "user",
      parts: [{ text: inputValue }],
    };

    // If there's no active chat, create a new one with the initial input
    if (!activeChat) {
      createNewChat(inputValue);
      setInputValue("");
      return;
    }

    const updatedPromptMessages = [...messages, userMessage];
    const updatedChatHistory = [...chatHistory, userHistoryObj];

    setMessages(updatedPromptMessages);
    setChatHistory(updatedChatHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      const currentChatHistory = activeChatObj?.chatHistory || [];

      const { aiMessageObj, aiHistoryObj } = await sendMessageToGemini(
        inputValue,
        currentChatHistory
      );

      if (!aiMessageObj || !aiHistoryObj) {
        setIsTyping(false);
        return;
      }

      const finalMessages = [...updatedPromptMessages, aiMessageObj];
      const finalChatHistory = [...updatedChatHistory, aiHistoryObj];

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: finalMessages,
                chatHistory: finalChatHistory,
              }
            : chat
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Select a chat from the list
  const handleSelectChat = (id) => {
    setActiveChat(id);
  };

  // Delete a chat and update the active chat
  const handleDeleteChat = (id) => {
    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);

    if (id === activeChat) {
      const newActiveChat = updatedChats.length > 0 ? updatedChats[0].id : null;
      setActiveChat(newActiveChat);
    }
  };

  return (
    <div className="chat-app">
      {/* Sidebar: Chat List */}
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i className="bx bx-edit-alt new-chat" onClick={() => createNewChat()}></i>
        </div>
        {chats?.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item ${chat.id === activeChat ? "active" : ""}`}
            onClick={() => handleSelectChat(chat.id)}
          >
            <h4>{chat.displayId}</h4>
            <i
              className="bx bx-x-circle"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat.id);
              }}
            ></i>
          </div>
        ))}
      </div>

      {/* Main Chat Window */}
      <div className="chat-window">
        <div className="chat-title">
          <h3>Chat with AI</h3>
          <i className="bx bx-arrow-back arrow" onClick={onGoBack}></i>
        </div>

        <div className="chat">
          {messages.map((msg, index) => (
            <Message
              key={msg.message_id || index}
              type={msg.type}
              text={msg.text}
              timestamp={msg.timestamp}
            />
          ))}
          {/* Auto scroll anchor */}
          <div ref={chatEndRef}></div>
        </div>

        {/* AI Typing Indicator */}
        {isTyping && <div className="typing">Typing...</div>}

        {/* Message Input Form */}
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <i className="fa-solid fa-face-smile emoji"></i>
          <input
            type="text"
            className="msg-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <i className="fa-solid fa-paper-plane" onClick={handleSendMessage}></i>
        </form>
      </div>
    </div>
  );
};

export default ChatBotsApp;
