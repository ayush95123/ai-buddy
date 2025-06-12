import React, { useContext } from "react";
import "../styles/chat/ChatBotsStart.css";
import { ChatContext } from "../contexts/ChatContext";

/**
 * CerebroHome - Landing screen for Cerebro.
 * Lists all available AI tools like ChatAI, and allows users to launch them.
 */
export const CerebroHome = ({ onStartChat }) => {
  const { setChats, setActiveChat, createNewChat } = useContext(ChatContext);

  const handleLaunchChatAI = () => {
    const storedChats = localStorage.getItem("chats");

    if (storedChats) {
      const parsedChats = JSON.parse(storedChats);
      setChats(parsedChats);
      setActiveChat(parsedChats[0]?.id || null);
    } else {
      createNewChat();
    }

    onStartChat(); // Navigate to ChatAI tool screen
  };

  return (
    <div className="start-page">
      <button className="start-page-btn" onClick={handleLaunchChatAI}>
        Chat AI
      </button>
      {/* Later you can add more tools here */}
    </div>
  );
};
