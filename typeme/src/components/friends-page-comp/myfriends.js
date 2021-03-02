import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../friends-page-comp/searchInFriends";
import Friend from "../friends-page-comp/friend";

function Myfriends({ myfriends, loading, HandleFindUsers }) {
  const [searchkeyword, setSearchKeyword] = useState("");
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [searchParameters, setSearchParameters] = useState({ online: false, gender: "any" });
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    let newFriends = myfriends;
    newFriends = myfriends.filter((friend) => {
      const { name, surname, status, gender, onlinestatus } = friend;
      const main =
        name.toLowerCase().includes(searchkeyword) || surname.toLowerCase().includes(searchkeyword);
      if (status === "accepted") {
        if (!searchParameters.online) {
          if (searchParameters.gender === "any") return main;
          if (searchParameters.gender === "male") return main && gender === "male";
          if (searchParameters.gender === "female") return main && gender === "female";
        } else {
          const onlineMain = main && onlinestatus;
          if (searchParameters.gender === "any") return onlineMain;
          if (searchParameters.gender === "male") return onlineMain && gender === "male";
          if (searchParameters.gender === "female") return onlineMain && gender === "female";
        }
      }
    });
    setFriends(newFriends);
  }, [searchkeyword, searchParameters, myfriends]);

  return (
    <>
      <div className="friends-top">
        <div
          className={`friends-top-item ${!searchParameters.online && "selected"}`}
          onClick={() => setSearchParameters({ ...searchParameters, online: false })}
        >
          All friends{" "}
          <span className="friends-count">
            {myfriends.filter((friend) => friend.status === "accepted").length}
          </span>
        </div>
        <div
          className={`friends-top-item ${searchParameters.online && "selected"}`}
          onClick={() => setSearchParameters({ ...searchParameters, online: true })}
        >
          Friends online{" "}
          <span className="friends-count">
            {friends.filter((user) => user.onlinestatus && user.status === "accepted").length}
          </span>
        </div>
        <Link className="find-friends" to="/friends/find">
          Find Friends
        </Link>
      </div>
      <div className="friends-search">
        <SearchBar
          searchParameters={searchParameters}
          setSearchParameters={setSearchParameters}
          setSearchKeyword={setSearchKeyword}
          showSearchSettings={showSearchSettings}
          setShowSearchSettings={setShowSearchSettings}
          HandleFindUsers={HandleFindUsers}
        />
      </div>
      {loading ? (
        <div className="loading">
          <div className="lds-dual-ring"></div>
        </div>
      ) : (
        <div className="friends-list">
          {friends.map((friend) => {
            return <Friend key={friend.email} {...friend} />;
          })}
          {friends.length === 0 && <div className="no-friends">No friends were found</div>}
        </div>
      )}
    </>
  );
}

export default Myfriends;
