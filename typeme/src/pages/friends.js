import React from "react";
import { useGlobalContext } from "../components/context";
import Myfriends from "../components/friends-page-comp/myfriends";
import FindFriends from "../components/friends-page-comp/findFriends";
function Friends() {
  const {} = useGlobalContext();
  if (selectFriendPage === "friends") {
    return (
      <>
        <div className="friends">
          <Myfriends />
        </div>
      </>
    );
  } else if (selectFriendPage === "findfriends") {
    return (
      <>
        <div className="friends">
          <FindFriends />
        </div>
      </>
    );
  }
}

export default Friends;
