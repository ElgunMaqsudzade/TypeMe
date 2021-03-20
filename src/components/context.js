import React, { useContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import moment from "moment";
import reducer from "./reducer";
const AppContext = React.createContext();

const initialState = {
  url: "https://typemeapi4000.azurewebsites.net/",
};
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState({
    name: null,
    image: null,
    surname: null,
    gender: null,
    logined: null,
    username: null,
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [shortLogin, setShortLogin] = useState(null);
  const [oldUsers, setOldUsers] = useState(null);
  const [logged, setLogged] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);

  let instance = axios.create({
    baseURL: "https://typemeapi4000.azurewebsites.net/api/",
    headers: {
      Authorization: `Bearer ${token} `,
      "Access-Control-Allow-Origin": "*",
    },
  });

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("login"));
    if (store && store.user) {
      setUser(store.user);
      setToken(store.token);
      setLogged(true);
    }
  }, [logged]);

  const RefreshUser = () => {
    setProfileLoading(true);
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
        setProfileLoading(false);
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

  const EditInfo = ({ id, statusmessage }) => {
    instance
      .put("/profile/adddetailuser", { language: id, username: user.username, statusmessage })
      .catch((res) => console.log(res));
  };

  const HandleOldUsers = (data) => {
    if (oldUsers === null) {
      setOldUsers([data]);
    }
    if (oldUsers !== null) {
      let isDub = false;
      let isSameuser = false;
      let newoldusers = oldUsers.map((oldUser) => {
        if (oldUser.email === data.email) {
          isSameuser = true;
          if (
            oldUser.image !== data.image ||
            oldUser.name !== data.name ||
            oldUser.surname !== data.surname
          ) {
            isDub = true;
            return data;
          }
          return oldUser;
        }
        return oldUser;
      });
      if (isDub) {
        setOldUsers(newoldusers);
      }
      if (!isSameuser) {
        setOldUsers([...oldUsers, data]);
      }
    }
  };

  const AddFriend = ({ tousername }) => {
    instance
      .put("friend/addfriend", { fromusername: user.username, tousername })
      .then(() => setFriendsLoading(true))
      .catch((res) => console.log(res));
  };

  const RemoveFriend = ({ tousername }) => {
    setFriendsLoading(true);
    instance
      .delete("friend/delete", {
        data: {
          fromusername: user.username,
          tousername,
        },
      })
      .then(() => setFriendsLoading(true))
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

  const GetCreatedTime = (time) => {
    let gettime = moment(+moment.utc(time)).fromNow();
    if (
      moment(+moment.utc(time))
        .add(3, "hours")
        .isBefore(new Date()) &&
      !moment(+moment.utc(time))
        .add(2, "days")
        .isBefore(new Date())
    ) {
      gettime = moment(+moment.utc(time)).calendar();
    } else if (
      moment(+moment.utc(time))
        .add(2, "days")
        .isBefore(new Date())
    ) {
      gettime = moment(+moment.utc(time)).format("MMM D [at] h:mm a");
    }
    return gettime;
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setProfileLoading,
        profileLoading,
        user,
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
        EditInfo,
        setFriendsLoading,
        friendsLoading,
        GetCreatedTime,
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
