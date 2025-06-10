import React, { useContext, useEffect, useRef, useState } from "react";
import "../css/ChatBotsApp.css";
import { v4 as uuidv4 } from "uuid";
import { ChatContext } from "../contexts/ChatContext";
import useGeminiChat from "../hooks/useGeminiChat";
import Message from "../components/Message";
import Toast from "./Toast";
import EmojiPicker from "emoji-picker-react";
import { useClickOutside } from "../hooks/useClickOutside";

/**
 * ChatBotsApp - Main chat application component
 * Handles rendering the chat UI, sending messages, and managing chat state
 */

const ChatBotsApp = ({ onGoBack }) => {
  const { chats, setChats, activeChat, setActiveChat, createNewChat } =
    useContext(ChatContext);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Get the current active chat object
  const activeChatObj = chats?.find((chat) => chat.id === activeChat);

  // Custom hook to sync chat messages and history

  const messages = activeChatObj?.messages || [];
  const chatHistory = activeChatObj?.chatHistory || [];

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

  //Handle selecting an emoji
  const handleEmojiClick = (emojiData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  //Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  //Emoji ref and click outside to close picker
  const emojiRef = useRef(null);
  useClickOutside(emojiRef, () => setShowEmojiPicker(false), showEmojiPicker);

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

    const messageToSend = inputValue; // Save current input for API
    setInputValue("");
    setIsTyping(true);

    // Update local UI
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              chatHistory: [...chat.chatHistory, userHistoryObj],
            }
          : chat
      )
    );

    try {
      // const currentChatHistory = activeChatObj?.chatHistory || [];

      const { aiMessageObj, aiHistoryObj } = await sendMessageToGemini(
        messageToSend,
        [...chatHistory, userHistoryObj]
      );

      if (!aiMessageObj || !aiHistoryObj) {
        setIsTyping(false);
        return;
      }

      // Safely append AI response
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id !== activeChat) return chat;

          return {
            ...chat,
            messages: [...chat.messages, aiMessageObj],
            chatHistory: [...chat.chatHistory, aiHistoryObj],
          };
        })
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
          <i
            className="bx bx-edit-alt new-chat"
            onClick={() => {
              if (chats.length >= 10) {
                setToastMessage(
                  "Chat limit reached. Please delete an old chat to start a new one."
                );
              } else {
                createNewChat();
              }
            }}
          ></i>
        </div>
        {chats?.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item ${
              chat.id === activeChat ? "active" : ""
            }`}
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
        {isTyping && (
          <div className="typing">
            AI is typing
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {/* Message Input Form */}
        <div className="msg-emoji-wrapper">
          <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
            <i
              className="fa-solid fa-face-smile emoji"
              onClick={toggleEmojiPicker}
            ></i>
            <input
              type="text"
              className="msg-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <i
              className="fa-solid fa-paper-plane"
              onClick={handleSendMessage}
            ></i>
          </form>
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="emoji-picker" ref={emojiRef}>
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
        </div>
      </div>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
};

export default ChatBotsApp;
