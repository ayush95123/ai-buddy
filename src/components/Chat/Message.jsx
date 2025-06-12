import PropTypes from "prop-types";
import "../../styles/chat/Message.css";

/**
 * Renders a single chat message.
 * Supports both user prompts and AI responses.
 * - If it's a response, HTML is rendered using dangerouslySetInnerHTML (from markdown).
 * - If it's a prompt, plain text is rendered.
 */
const Message = ({ type, text, timestamp }) => {
  const isResponse = type === "response";

  return (
    <div className={`message ${isResponse ? "response" : "prompt"}`}>
      {isResponse ? (
        // Renders pre-formatted HTML (from markdown). Ensure content is sanitized before use.
        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ) : (
        // Renders plain user message
        <div className="message-text">{text}</div>
      )}
      <span className="message-timestamp">{timestamp}</span>
    </div>
  );
};

Message.propTypes = {
  type: PropTypes.oneOf(["prompt", "response"]).isRequired,
  text: PropTypes.string.isRequired, // raw or HTML-formatted string
  timestamp: PropTypes.string, // usually a formatted time string
};

export default Message;
