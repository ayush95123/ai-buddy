import React from "react";
import Message from "./Message";
import "../../styles/chat/ChatWindow.css";

const ChatWindow = ({ messages, isTyping, chatEndRef ,onGoBack}) => (
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
      <div ref={chatEndRef}></div>
    </div>
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
  </div>
);

export default ChatWindow;
