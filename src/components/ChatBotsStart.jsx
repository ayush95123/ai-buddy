import React from "react";
import "../css/ChatBotsStart.css";

export const ChatBotsStart = ({onStartChat}) => {
  return (
    <div className="start-page">
      <button className="start-page-btn" onClick={onStartChat}>Chat AI</button>
    </div>
  );
};