import React, { useState } from "react";
import "../../sass/_inputField.scss";
import ContentEditable from "react-contenteditable";
import outclick from "../customHooks/showHide";
import Picker from "emoji-picker-react";
import { Icon20SmileOutline } from "@vkontakte/icons";

function ModalInputField({ setShowInput, showInput, handleSave, info }) {
  const inputField = React.createRef();
  const editor = React.createRef();
  const [text, setText] = useState(info);
  const [showEmoji, setShowEmoji] = useState(false);
  outclick(editor, () => {
    if (showInput) {
      setShowInput(false);
    }
  });

  const onEmojiClick = (event, emojiObject) => {
    if (text.length <= 60) {
      setText(text + emojiObject.emoji);
    }
  };

  const maxLength = (event) => {
    if (text.length > 60 && event.keyCode !== 8) {
      setText(text);
      event.preventDefault();
    }
  };

  return (
    <>
      <div className="editor" ref={editor}>
        <ContentEditable
          onKeyDown={maxLength}
          innerRef={inputField}
          className="input-field"
          html={text}
          disabled={false}
          onChange={() => setText(inputField.current.innerText)}
        />
        <button
          className="main-btn-slim"
          onClick={() => {
            handleSave(text);
            setShowInput(false);
          }}
        >
          Save
        </button>
        <Icon20SmileOutline className="smile-icon" onClick={() => setShowEmoji(!showEmoji)} />
        {showEmoji && (
          <div className={`emoji-box`}>
            <Picker
              onEmojiClick={onEmojiClick}
              disableAutoFocus={true}
              disableSkinTonePicker={true}
              groupNames={{ smileys_people: "PEOPLE" }}
              native
            />
          </div>
        )}
      </div>
    </>
  );
}

export default ModalInputField;
