import React, { useContext, useEffect, useRef, useState } from "react";
import "../../styles/chat/ChatApp.css";
import { v4 as uuidv4 } from "uuid";
import { ChatContext } from "../../contexts/ChatContext";
import useGeminiChat from "../../hooks/useGeminiChat";
import Message from "./Message";
import Toast from "./Toast";
import EmojiPicker from "emoji-picker-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

/**
 * ChatBotsApp - Main chat application component
 * Handles rendering the chat UI, sending messages, and managing chat state
 */

const ChatApp = ({ onGoBack }) => {
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
      <ChatList
        chats={chats}
        activeChat={activeChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onNewChat={createNewChat}
        onLimitReached={() =>
          setToastMessage("Chat limit reached. Please delete an old chat.")
        }
      />

      <div className="chat-window">
        <ChatWindow
          onGoBack = {onGoBack}
          messages={messages}
          isTyping={isTyping}
          chatEndRef={chatEndRef}
        />

        <MessageInput
          inputValue={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSend={handleSendMessage}
          showEmojiPicker={showEmojiPicker}
          toggleEmojiPicker={toggleEmojiPicker}
          emojiRef={emojiRef}
          onEmojiClick={handleEmojiClick}
        />
      </div>
       {toastMessage && (
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />
    )}
    </div>
  );
};

export default ChatApp;
