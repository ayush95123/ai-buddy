import React from "react";
import  "../../styles/chat/ChatList.css"
const ChatList = ({ chats, activeChat, onSelectChat, onDeleteChat, onNewChat, onLimitReached }) => (
  <div className="chat-list">
    <div className="chat-list-header">
      <h2>Chat List</h2>
      <i
        className="bx bx-edit-alt new-chat"
        onClick={() => (chats.length >= 10 ? onLimitReached() : onNewChat())}
      ></i>
    </div>
    {chats.map((chat) => (
      <div
        key={chat.id}
        className={`chat-list-item ${chat.id === activeChat ? "active" : ""}`}
        onClick={() => onSelectChat(chat.id)}
      >
        <h4>{chat.displayId}</h4>
        <i
          className="bx bx-x-circle"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteChat(chat.id);
          }}
        ></i>
      </div>
    ))}
  </div>
);

export default ChatList;