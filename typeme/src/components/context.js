import React, { useContext, useEffect, useState, useReducer } from "react";
import reducer from "./reducer";

const AppContext = React.createContext();

const initialState = {
  createText: "",
};
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCreateText = (text) => {
    console.log(text);
    return dispatch({ type: "CREATE_TEXT", payload: text });
  };

  return <AppContext.Provider value={{ ...state, setCreateText }}>{children}</AppContext.Provider>;
};

// hooks

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
