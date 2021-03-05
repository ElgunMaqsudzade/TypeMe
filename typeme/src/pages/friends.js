import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { useLocation } from "react-router-dom";
import Myfriends from "../components/friends-page-comp/myfriends";
import FindFriends from "../components/friends-page-comp/findFriends";
import RequestedFriends from "../components/friends-page-comp/requestedFriends";

function Friends() {
  let location = useLocation().pathname;
  const { user, instance } = useGlobalContext();
  const [findFriends, setFindFriends] = useState({ loading: true, myfriends: [] });
  const [findprops, setFindprops] = useState({ skip: 0, key: "" });

  const HandleFindUsers = ({ key, skip }) => {
    setFindprops({ ...findprops, key, skip });
    instance
      .post("authenticate/find", {
        key,
        skip,
      })
      .then(({ data }) => {
        setFindFriends({ loading: false, myfriends: data.users, usersCount: data.usersCount });
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const Addmore = () => {
    if (findprops) setFindprops({ ...findprops, skip: findprops.skip + 20 });
    instance
      .post("authenticate/find", {
        key: findprops.key,
        skip: findprops.skip,
      })
      .then(({ data }) => {
        let newArr = [...findFriends.myfriends, ...data.users];
        let setArr = Array.from(new Set(newArr.map(JSON.stringify))).map(JSON.parse);
        setFindFriends({
          loading: false,
          myfriends: setArr,
          usersCount: data.usersCount,
        });
      })
      .catch((res) => {
        console.log(res);
      });
  };

  useEffect(() => {
    if (user.username !== null) {
      instance
        .get("authenticate")
        .then(({ data }) => {
          setFindFriends({ loading: false, myfriends: data.users });
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }, [user, instance]);

  return (
    <>
      <div className="friends">
        {location === "/friends/all" && <Myfriends HandleFindUsers={HandleFindUsers} />}
        {location === "/friends/find" && (
          <FindFriends
            {...findFriends}
            HandleFindUsers={HandleFindUsers}
            Addmore={Addmore}
            findprops={findprops}
            setFindprops={setFindprops}
          />
        )}
        {location === "/friends/requested" && <RequestedFriends />}
      </div>
    </>
  );
}

export default Friends;
