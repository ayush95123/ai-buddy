import React from "react";
import EmojiPicker from "emoji-picker-react";
import  "../../styles/chat/MessageInput.css"

const MessageInput = ({
  inputValue,
  onChange,
  onKeyDown,
  onSend,
  showEmojiPicker,
  toggleEmojiPicker,
  emojiRef,
  onEmojiClick,
}) => (
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
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <i className="fa-solid fa-paper-plane" onClick={onSend}></i>
    </form>
    {showEmojiPicker && (
      <div className="emoji-picker" ref={emojiRef}>
        <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
      </div>
    )}
  </div>
);

export default MessageInput;
