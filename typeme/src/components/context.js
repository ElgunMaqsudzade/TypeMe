import React, { useContext, useEffect, useState, useReducer } from "react";
import reducer from "./reducer";

const AppContext = React.createContext();
const data = {
  users: [{ username: "Elgun" }, { username: "Kamran" }, { username: "Elik" }, { username: "sa" }],
};

const initialState = {
  searchTerm: "Hello",
  users: [
    { username: "Elgun" },
    { username: "Kamran" },
    { username: "Elik" },
    { username: "slten" },
  ],
  posts: [],
};
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toggled, setToggled] = useState(false);
  const setSearchTerm = (searchValue) => {
    return dispatch({ type: "SEARCH", payload: { searchValue, data } });
  };

  return (
    <AppContext.Provider value={{ ...state, setSearchTerm, setToggled, toggled }}>
      {children}
    </AppContext.Provider>
  );
};

// hooks

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
