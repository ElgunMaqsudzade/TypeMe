import React, { useRef } from "react";
import ContentEditable from "react-contenteditable";
import { useGlobalContext } from "./../components/context";

function Textarea({ placeholder, setShowSubmit, showSubmit }) {
  const { setCreateText, createText } = useGlobalContext();
  const textarea = useRef(null);
  const FocusHandler = () => {
    setShowSubmit(true);
  };
  return (
    <>
      <div className="textarea-box">
        <ContentEditable
          className={`textarea ${showSubmit ? "expanded" : ""}`}
          innerRef={textarea}
          html={createText}
          disabled={false}
          onFocus={FocusHandler}
          onChange={() => setCreateText(textarea.current.innerText)}
        />
        {!createText && (
          <div className={`placeholder ${showSubmit ? "focus" : ""}`}>{placeholder}</div>
        )}
      </div>
    </>
  );
}

export default Textarea;
