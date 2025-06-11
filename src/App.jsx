import React, { useContext, useState } from "react";
import { ChatBotsStart } from "./components/ChatBotsStart";
import { ChatContext } from "./contexts/ChatContext";
import ChatApp from "./components/Chat/ChatApp";

const App = () => {
  const [isChatting, setIsChatting] = useState(false);
  const { chats, createNewChat } = useContext(ChatContext);

  const handleStartChat = () => {
    setIsChatting(true);

    if (chats.length === 0) {
      createNewChat();
    }
  };

  const handleGoBack = () => {
    setIsChatting(false);
  };
  
  return (
    <div className="container">
      {isChatting ? (
        <ChatApp
          onGoBack={handleGoBack}
        />
      ) : (
        <ChatBotsStart onStartChat={handleStartChat} />
      )}
    </div>
  );
};

export default App;
