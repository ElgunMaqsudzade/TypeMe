import React, { useRef } from "react";
import ContentEditable from "react-contenteditable";

function Textarea({ placeholder, setShowSubmit, showSubmit, setText, text }) {
  const textarea = useRef(null);
  const FocusHandler = () => {
    if (setShowSubmit) setShowSubmit(true);
  };
  return (
    <>
      <div className="textarea-box">
        <ContentEditable
          className={`textarea ${showSubmit && (showSubmit ? "expanded" : "")}`}
          innerRef={textarea}
          html={text}
          disabled={false}
          onFocus={FocusHandler}
          onChange={() => setText(textarea.current.innerText)}
        />
        {!text && <div className={`placeholder ${showSubmit ? "focus" : ""}`}>{placeholder}</div>}
      </div>
    </>
  );
}

export default Textarea;
