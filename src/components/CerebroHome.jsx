import { useNavigate } from "react-router-dom";
import "../styles/chat/CerebroHome.css";

/**
 * CerebroHome - Landing screen for Cerebro.
 * Lists all available AI tools like ChatAI, and allows users to launch them.
 */
export const CerebroHome = () => {
  const navigate = useNavigate();

  return (
    <div className="start-page">
      <button className="start-page-btn" onClick={() => navigate("/chat")}>
        Chat AI
      </button>
      <button className="start-page-btn" onClick={() => navigate("/moodboard")}>
        Mood UI
      </button>
    </div>
  );
};
