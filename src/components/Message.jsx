import PropTypes from "prop-types";

const Message = ({ type, text, timestamp }) => {
  return (
    <div className={type === "prompt" ? "prompt" : "response"}>
      {type === "response" ? (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ) : (
        <div>{text}</div>
      )}
      <span>{timestamp}</span>
    </div>
  );
};

Message.propTypes = {
  type: PropTypes.oneOf(["prompt", "response"]).isRequired,
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.string,
};

export default Message;
