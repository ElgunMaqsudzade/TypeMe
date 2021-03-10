import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import SearchBar from "../friends-page-comp/searchInFriends";
import FindSingle from "../friends-page-comp/findSingle";

function FindFriends({
  myfriends,
  loading,
  HandleFindUsers,
  usersCount,
  setFindprops,
  findprops,
  Addmore,
}) {
  const { user } = useGlobalContext();
  const [searchkeyword, setSearchKeyword] = useState("");
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [searchParameters, setSearchParameters] = useState({ online: false, gender: "any" });
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    let newFriends = myfriends
      .filter((friend) => friend.username !== user.username)
      .filter((friend) => {
        const { gender } = friend;
        if (searchParameters.gender === "any") return friend;
        if (searchParameters.gender === "male") return gender === "male";
        if (searchParameters.gender === "female") return gender === "female";
        return friend;
      });
    setFriends(newFriends);
  }, [searchkeyword, searchParameters, myfriends, loading, user]);

  return (
    <>
      <div className="friends-top">
        <div className="friends-top-item selected">
          Find friends <span className="friends-count">{usersCount}</span>
        </div>
      </div>
      <div className="friends-search">
        <SearchBar
          searchParameters={searchParameters}
          setSearchParameters={setSearchParameters}
          setSearchKeyword={setSearchKeyword}
          searchkeyword={searchkeyword}
          showSearchSettings={showSearchSettings}
          setShowSearchSettings={setShowSearchSettings}
          HandleFindUsers={HandleFindUsers}
          setFindprops={setFindprops}
        />
      </div>
      <div className="find-friends-list">
        {loading ? (
          <div className="loading">
            <div className="lds-dual-ring"></div>
          </div>
        ) : (
          <>
            {friends.map((friend) => {
              return <FindSingle key={friend.email} {...friend} />;
            })}
            {friends.length === 0 && <div className="no-friends">No friends were found</div>}
          </>
        )}
      </div>
      {usersCount > findprops.skip + 20 && (
        <div className="findmore">
          <button
            className="main-btn"
            onClick={() => {
              if (usersCount > findprops.skip) {
                Addmore();
              }
            }}
          >
            Find more
          </button>
        </div>
      )}
    </>
  );
}

export default FindFriends;
