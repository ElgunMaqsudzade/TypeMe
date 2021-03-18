import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { useLocation, useParams } from "react-router-dom";
import Myfriends from "../components/friends-page-comp/myfriends";
import FindFriends from "../components/friends-page-comp/findFriends";
import RequestedFriends from "../components/friends-page-comp/requestedFriends";
import { useQuery } from "../components/customHooks/useQuery";

function Friends() {
  const location = useLocation();
  const { section } = useParams();
  const query = useQuery();
  const { user, instance } = useGlobalContext();
  const [findFriends, setFindFriends] = useState({ loading: true, myfriends: [] });
  const [findprops, setFindprops] = useState({ skip: 0, key: "" });

  useEffect(() => {
    if (query.get("keyword") !== null) {
      HandleFindUsers({ key: query.get("keyword"), skip: 0 });
    } else {
      HandleFindUsers({ key: "", skip: 0 });
    }
  }, [section, location]);

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

  return (
    <>
      <div className="friends">
        {section === "all" && <Myfriends />}
        {section.includes("find") && (
          <FindFriends
            {...findFriends}
            Addmore={Addmore}
            findprops={findprops}
            setFindprops={setFindprops}
          />
        )}
        {section === "requested" && <RequestedFriends />}
      </div>
    </>
  );
}

export default Friends;
