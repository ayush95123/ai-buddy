import EmojiPicker from "emoji-picker-react";
import "../../styles/chat/MessageInput.css";

/**
 * MessageInput - Input area for typing and sending messages
 *
 * Props:
 * - inputValue: string - Current message input
 * - onChange: function - Input change handler
 * - onSend: function - Send button handler
 * - showEmojiPicker: boolean - Whether emoji picker is visible
 * - toggleEmojiPicker: function - Toggles emoji picker visibility
 * - emojiRef: ref - Ref for outside-click detection
 * - onEmojiClick: function - Handler when emoji is clicked
 */
const MessageInput = ({
  inputValue,
  onChange,
  onSend,
  showEmojiPicker,
  toggleEmojiPicker,
  emojiRef,
  onEmojiClick,
}) => {
  return (
    <div className="msg-emoji-wrapper">
      <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
        <button
          type="button"
          className="emoji-btn"
          onClick={toggleEmojiPicker}
          aria-label="Toggle Emoji Picker"
        >
          <i className="fa-solid fa-face-smile emoji" />
        </button>

        <input
          type="text"
          className="msg-input"
          placeholder="Type a message..."
          value={inputValue}
          onChange={onChange}
        />

        <button
          type="button"
          className="send-btn"
          onClick={onSend}
          aria-label="Send Message"
        >
          <i className="fa-solid fa-paper-plane" />
        </button>
      </form>

      {showEmojiPicker && (
        <div className="emoji-picker" ref={emojiRef}>
          <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
