import { useContext, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/chat/ChatApp.css";
import { ChatContext } from "../../contexts/ChatContext";
import Toast from "./Toast";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import { useChatLogic } from "../../hooks/useChatLogic";
import { useKeyDown } from "../../hooks/useKeyDown";
import { useEmojiPicker } from "../../hooks/useEmojiPicker";

/**
 * Main Chat App Component
 * Renders the layout and wiring of chat UI, handles state and events.
 */

const ChatApp = ({ onGoBack }) => {
  const { chats, setChats, activeChat, setActiveChat, createNewChat } =
    useContext(ChatContext);

  const [toastMessage, setToastMessage] = useState("");

  // Get current active chat object
  const activeChatObj = chats?.find((chat) => chat.id === activeChat);

  const messages = useMemo(
    () => activeChatObj?.messages ?? [],
    [activeChatObj]
  );
  const chatHistory = useMemo(
    () => activeChatObj?.chatHistory ?? [],
    [activeChatObj]
  );

  // Message input + typing logic
  const { inputValue, setInputValue, isTyping, handleSend } = useChatLogic(
    activeChat,
    chats,
    setChats,
    chatHistory
  );

  // Scroll to bottom on message update
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Emoji Picker setup
  const {
    visible: showEmojiPicker,
    ref: emojiRef,
    toggle: toggleEmojiPicker,
    handleEmojiClick,
  } = useEmojiPicker((emojiData) =>
    setInputValue((prev) => prev + emojiData.emoji)
  );

  // Trigger send on Enter key
  useKeyDown("Enter", handleSend);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSelectChat = (id) => {
    setActiveChat(id);
  };

  const handleDeleteChat = (id) => {
    const updated = chats.filter((chat) => chat.id !== id);
    setChats(updated);

    if (id === activeChat) {
      setActiveChat(updated.length ? updated[0].id : null);
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
          onGoBack={onGoBack}
          messages={messages}
          isTyping={isTyping}
          chatEndRef={chatEndRef}
        />

        <MessageInput
          inputValue={inputValue}
          onChange={handleInputChange}
          onSend={handleSend}
          showEmojiPicker={showEmojiPicker}
          toggleEmojiPicker={toggleEmojiPicker}
          emojiRef={emojiRef}
          onEmojiClick={handleEmojiClick}
        />
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </div>
  );
};

export default ChatApp;
