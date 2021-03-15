import React from "react";
import Picker from "emoji-picker-react";

const App = ({ text, setText }) => {
  const onEmojiClick = (event, emojiObject) => {
    setText(text + emojiObject.emoji);
  };
  return (
    <>
      <Picker
        onEmojiClick={onEmojiClick}
        disableAutoFocus={true}
        disableSkinTonePicker={true}
        groupNames={{ smileys_people: "PEOPLE" }}
        native
      />
    </>
  );
};

export default App;
