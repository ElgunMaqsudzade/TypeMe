import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { useGlobalContext } from "./../components/context";

const App = () => {
  const { setCreateText, createText } = useGlobalContext();

  const onEmojiClick = (event, emojiObject) => {
    setCreateText(createText + `&#x${emojiObject.unified};`);
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
