import React, { useContext, useEffect, useReducer, useState } from "react";
import reducer from "./reducer";
import axios from "axios";

const AppContext = React.createContext();

const initialState = {
  url: "https://localhost:44303",
  createText: "",
  user: { name: null, image: null, surname: null, gender: null, logined: null },
  friends: [],
};
const AppProvider = ({ children }) => {
  const [shortLogin, setShortLogin] = useState(null);
  const [oldUsers, setOldUsers] = useState(null);
  const [logged, setLogged] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [resetInfo, setResetInfo] = useState(null);

  useEffect(() => {
    let oldusers = JSON.parse(localStorage.getItem("oldusers"));
    setOldUsers(oldusers);
  }, []);

  useEffect(() => {
    localStorage.setItem("oldusers", JSON.stringify(oldUsers));
  }, [oldUsers]);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("login"));
    if (store && store.user) {
      dispatch({ type: "USER_DATA", payload: store.user });
    }
  }, [logged]);

  const setCreateText = (text) => {
    return dispatch({ type: "CREATE_TEXT", payload: text });
  };

  const CallFriends = (data) => {
    return dispatch({ type: "ALL_FRIENDS", payload: data });
  };

  const HandleOldUsers = (data) => {
    if (oldUsers === null) {
      setOldUsers([data]);
    }
    if (oldUsers !== null) {
      let isDub = false;
      oldUsers.forEach((oldUser) => {
        if (oldUser.email === data.email) {
          isDub = true;
          return;
        }
      });
      if (!isDub) {
        setOldUsers([...oldUsers, data]);
      }
    }
  };

  const ResetPasswordHandler = (email) => {
    setShortLogin(null);
    setResetInfo({ email });
    axios
      .post(`${state.url}/api/authenticate/foremailrp`, { email })
      .then(({ data, status }) => {
        setResetInfo({ email, data, status });
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setCreateText,
        HandleOldUsers,
        setLogged,
        logged,
        oldUsers,
        setOldUsers,
        resetInfo,
        setResetInfo,
        ResetPasswordHandler,
        setShortLogin,
        shortLogin,
        CallFriends,
        selectFriendPage,
        setSelectFriendPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// hooks

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
