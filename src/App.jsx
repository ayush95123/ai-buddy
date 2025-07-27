import { CerebroHome } from "./components/CerebroHome";
import ChatApp from "./components/Chat/ChatApp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MoodUIHome from "./components/MoodUI/MoodUIHome";

const App = () => {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<CerebroHome />} />
          <Route path="/chat" element={<ChatApp />} />
          <Route path="/moodboard" element={<MoodUIHome />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
