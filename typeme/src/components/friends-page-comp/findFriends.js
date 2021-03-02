import React, { useState, useEffect, useRef } from "react";
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
  const {} = useGlobalContext();
  const [searchkeyword, setSearchKeyword] = useState("");
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [searchParameters, setSearchParameters] = useState({ online: false, gender: "any" });
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    let newFriends = myfriends.filter((friend) => {
      const { status, gender, onlinestatus } = friend;
      if (searchParameters.gender === "any") return friend;
      if (searchParameters.gender === "male") return gender === "male";
      if (searchParameters.gender === "female") return gender === "female";
    });
    setFriends(newFriends);
  }, [searchkeyword, searchParameters, myfriends, loading]);

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
