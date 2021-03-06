import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { Link } from "react-router-dom";
import SearchBar from "../friends-page-comp/searchInFriends";
import Friend from "../friends-page-comp/friend";

function Myfriends({ HandleFindUsers }) {
  const { user, instance } = useGlobalContext();
  const [allfriends, setAllFriends] = useState([]);
  const [myfriends, setMyFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchkeyword, setSearchKeyword] = useState("");
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [searchParameters, setSearchParameters] = useState({ online: false, gender: "any" });

  useEffect(() => {
    setLoading(true);
    if (user.username !== null) {
      instance
        .post("friend/getallfriends", { username: user.username, status: 1 })
        .then(({ data }) => {
          setAllFriends(data.friends);
          setMyFriends(data.friends);
          setLoading(false);
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }, [user.username, instance]);

  useEffect(() => {
    let newFriends = myfriends;
    newFriends = myfriends.filter((friend) => {
      const { name, surname, gender, onlinestatus } = friend;
      const main =
        name.toLowerCase().includes(searchkeyword) || surname.toLowerCase().includes(searchkeyword);
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
      return friend;
    });
    setAllFriends(newFriends);
  }, [searchkeyword, searchParameters, myfriends, loading]);

  return (
    <>
      <div className="friends-top">
        <div
          className={`friends-top-item ${!searchParameters.online && "selected"}`}
          onClick={() => setSearchParameters({ ...searchParameters, online: false })}
        >
          All friends <span className="friends-count">{myfriends.length}</span>
        </div>
        <div
          className={`friends-top-item ${searchParameters.online && "selected"}`}
          onClick={() => setSearchParameters({ ...searchParameters, online: true })}
        >
          Friends online{" "}
          <span className="friends-count">
            {allfriends.filter((user) => user.onlinestatus).length}
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
        <>
          <div className="friends-list">
            {allfriends.map((friend) => {
              return (
                <Friend
                  key={friend.email}
                  {...friend}
                  setAllFriends={setAllFriends}
                  allfriends={allfriends}
                  setMyFriends={setMyFriends}
                />
              );
            })}
          </div>
          {allfriends.length === 0 && <div className="no-friends">No friends were found</div>}
        </>
      )}
    </>
  );
}

export default Myfriends;
