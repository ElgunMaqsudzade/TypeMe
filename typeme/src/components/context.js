import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import reducer from "./reducer";
const AppContext = React.createContext();

const initialState = {
  url: "http://jrcomerun-001-site1.ftempurl.com",
  createText: "",
};
const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: null,
    image: null,
    surname: null,
    gender: null,
    logined: null,
    username: null,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [token, setToken] = useState("");
  const [shortLogin, setShortLogin] = useState(null);
  const [oldUsers, setOldUsers] = useState(null);
  const [logged, setLogged] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [resetInfo, setResetInfo] = useState(null);

  let instance = axios.create({
    baseURL: "http://jrcomerun-001-site1.ftempurl.com/api/",
    headers: { Authorization: `Bearer ${token} ` },
  });

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("login"));
    if (store && store.user) {
      setUser(store.user);
      setToken(store.token);
    }
  }, [logged]);

  const RefreshUser = () => {
    instance
      .post("profile/user", { username: user.username })
      .then(({ data }) => {
        localStorage.setItem(
          "login",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("login")),
            user: data,
          })
        );
        setUser({ ...user, ...data });
      })
      .catch((res) => console.log(res));
  };

  useEffect(() => {
    let oldusers = JSON.parse(localStorage.getItem("oldusers"));
    setOldUsers(oldusers);
  }, []);

  useEffect(() => {
    localStorage.setItem("oldusers", JSON.stringify(oldUsers));
  }, [oldUsers]);

  const setCreateText = (text) => {
    return dispatch({ type: "CREATE_TEXT", payload: text });
  };

  const HandleOldUsers = (data) => {
    console.log(data);
    if (oldUsers === null) {
      setOldUsers([data]);
    }
    if (oldUsers !== null) {
      let isDub = false;
      oldUsers.forEach((oldUser) => {
        if (oldUser.email === data.email) {
          if (
            oldUser.image === data.image &&
            oldUser.name === data.name &&
            oldUser.surname === data.surname
          ) {
            isDub = true;
            return;
          } else {
            oldUser.image = data.image;
            oldUser.name = data.name;
            oldUser.surname = data.surname;
          }
        }
      });
      if (!isDub) {
        setOldUsers([...oldUsers, data]);
      }
    }
  };

  const AddFriend = ({ tousername }) => {
    instance
      .post("friend/addfriend", { fromusername: user.username, tousername })
      .catch((res) => console.log(res));
  };

  const RemoveFriend = ({ tousername }) => {
    instance
      .delete("friend/delete", {
        data: {
          fromusername: user.username,
          tousername,
        },
      })
      .then((res) => console.log(res))
      .catch((res) => console.log(res));
  };

  const ResetPasswordHandler = (email) => {
    setShortLogin(null);
    setResetInfo({ email });
    instance
      .post(`authenticate/foremailrp`, { email })
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
        user,
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
        AddFriend,
        RemoveFriend,
        instance,
        RefreshUser,
        deleteModal,
        setDeleteModal,
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
