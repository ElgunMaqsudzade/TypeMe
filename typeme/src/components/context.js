import React, { useContext, useEffect, useReducer, useState } from "react";
import reducer from "./reducer";
import axios from "axios";

const AppContext = React.createContext();

const initialState = {
  url: "https://localhost:44303",
  createText: "",
  user: { name: null, image: null, surname: null, gender: null, logined: null, username: null },
};
const AppProvider = ({ children }) => {
  const [addFriendRes, setAddFriendRes] = useState({ added: false, username: "" });
  const [allusers, setAllUsers] = useState([]);
  const [pathname, setPathname] = useState(null);
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

  const CallUsers = (data) => {
    console.log(data);
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

  const AddFriend = ({ tousername }) => {
    axios
      .post(`${state.url}/api/friend/addfriend`, { fromusername: state.user.username, tousername })
      .then((res) => setAddFriendRes({ added: true, username: tousername }))
      .catch((res) => console.log(res));
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
        addFriendRes,
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
        pathname,
        setPathname,
        allusers,
        CallUsers,
        AddFriend,
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
