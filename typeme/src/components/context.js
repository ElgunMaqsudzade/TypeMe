import React, { useContext, useEffect, useReducer, useState } from "react";
import reducer from "./reducer";

const AppContext = React.createContext();

const initialState = {
  createText: "",
  user: { name: null, image: null, surname: null, gender: null, logined: null },
};
const AppProvider = ({ children }) => {
  const [logged, setLogged] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("login"));
    if (store && store.user) {
      dispatch({ type: "USER_DATA", payload: store.user });
    }
    console.log(state.user);
  }, [logged]);

  const setCreateText = (text) => {
    return dispatch({ type: "CREATE_TEXT", payload: text });
  };
  const setOldUsers = (data) => {
    return dispatch({ type: "OLD_USERS", payload: data });
  };
  return (
    <AppContext.Provider value={{ ...state, setCreateText, setOldUsers, setLogged, logged }}>
      {children}
    </AppContext.Provider>
  );
};

// hooks

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
