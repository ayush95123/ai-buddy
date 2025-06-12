import Message from "./Message";
import "../../styles/chat/ChatWindow.css";

/**
 * ChatWindow component
 * Displays the chat header, list of messages, and typing indicator.
 *
 * @param {Array} messages - Array of message objects.
 * @param {boolean} isTyping - Whether AI is currently generating a response.
 * @param {object} chatEndRef - Ref to scroll to bottom on new message.
 * @param {function} onGoBack - Handler to return to previous view (e.g. chat list).
 */
const ChatWindow = ({ messages, isTyping, chatEndRef, onGoBack }) => (
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
      {/* Auto-scroll anchor */}
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
