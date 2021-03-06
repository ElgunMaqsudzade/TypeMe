import React from "react";
import { useGlobalContext } from "../context";

function ModalInputField() {
  const { EditInfo, text, setText } = useGlobalContext();
  return (
    <>
      <input type="text" onChange={(e) => setText(e.target.value)} />
    </>
  );
}

export default ModalInputField;
