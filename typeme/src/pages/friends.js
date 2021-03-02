import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { useLocation } from "react-router-dom";
import Myfriends from "../components/friends-page-comp/myfriends";
import FindFriends from "../components/friends-page-comp/findFriends";
import RequestedFriends from "../components/friends-page-comp/requestedFriends";
import axios from "axios";

function Friends() {
  let location = useLocation().pathname;
  const { user } = useGlobalContext();
  const [requested, setRequested] = useState({ loading: true, myfriends: [] });
  const [accepted, setAccepted] = useState({ loading: true, myfriends: [] });
  const [findFriends, setFindFriends] = useState({ loading: true, myfriends: [] });
  const [findprops, setFindprops] = useState({ skip: 0, key: "" });
  useEffect(() => {
    if (user.username !== null) {
      axios
        .post("https://localhost:44303/api/friend/getfriends", {
          username: user.username,
        })
        .then(({ data }) => {
          setRequested({
            loading: false,
            myfriends: data.friends.filter((friend) => friend.status === "requested"),
          });
          setAccepted({
            loading: false,
            myfriends: data.friends.filter((friend) => friend.status === "accepted"),
          });
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }, [user]);

  const HandleFindUsers = ({ key, skip }) => {
    setFindprops({ ...findprops, key, skip });
    axios
      .post("https://localhost:44303/api/authenticate/find", {
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
    axios
      .post("https://localhost:44303/api/authenticate/find", {
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
      axios
        .get("https://localhost:44303/api/authenticate")
        .then(({ data }) => {
          setFindFriends({ loading: false, myfriends: data.users });
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }, [user]);

  return (
    <>
      <div className="friends">
        {location === "/friends/all" && (
          <Myfriends {...accepted} HandleFindUsers={HandleFindUsers} />
        )}
        {location === "/friends/find" && (
          <FindFriends
            {...findFriends}
            HandleFindUsers={HandleFindUsers}
            Addmore={Addmore}
            findprops={findprops}
            setFindprops={setFindprops}
          />
        )}
        {location === "/friends/requested" && <RequestedFriends {...requested} />}
      </div>
    </>
  );
}

export default Friends;
