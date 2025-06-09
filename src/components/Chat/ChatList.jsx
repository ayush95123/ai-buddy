import "../../styles/chat/ChatList.css";

/**
 * ChatList Component
 * Renders a list of all chat sessions with options to select, create, or delete chats.
 *
 * @param {Array} chats - All chat objects.
 * @param {string|null} activeChat - ID of the currently selected chat.
 * @param {Function} onSelectChat - Called when a chat is clicked.
 * @param {Function} onDeleteChat - Called when a chat's delete icon is clicked.
 * @param {Function} onNewChat - Called to create a new chat.
 * @param {Function} onLimitReached - Called when chat limit is hit (e.g. 10).
 */
const ChatList = ({
  chats,
  activeChat,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  onLimitReached,
}) => (
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
          className="bx bx-x-circle delete-icon"
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering chat selection
            onDeleteChat(chat.id);
          }}
        ></i>
      </div>
    ))}
  </div>
);

export default ChatList;
