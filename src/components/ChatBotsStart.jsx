import React, { useContext } from "react";
import "../css/ChatBotsStart.css";
import { ChatContext } from "../contexts/ChatContext";

export const ChatBotsStart = ({ onStartChat }) => {
  const { setChats, setActiveChat, createNewChat } = useContext(ChatContext);

  const handleStartChat = () => {
    const storedChats = localStorage.getItem("chats");

    if (storedChats) {
      const parsedChats = JSON.parse(storedChats);
      setChats(parsedChats);
      setActiveChat(parsedChats[0]?.id || null); // Activate first chat if exists
    } else {
      createNewChat(); // No previous chats, start a new one
    }

    onStartChat(); // Navigate to main chat UI
  };

  return (
    <div className="start-page">
      <button className="start-page-btn" onClick={handleStartChat}>
        Chat AI
      </button>
    </div>
  );
};
