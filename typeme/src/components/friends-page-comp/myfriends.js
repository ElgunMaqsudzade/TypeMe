import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import SearchBar from "../friends-page-comp/searchInFriends";
import Friend from "../friends-page-comp/friend";

function Myfriends() {
  const {} = useGlobalContext();
  const [searchkeyword, setSearchKeyword] = useState("");
  const [friends, setFriends] = useState([]);
  const [searchParameters, setSearchParameters] = useState({ online: false, gender: "any" });
  const data = [
    {
      name: "Elgun",
      surname: "Maqsudzade",
      hometown: "sd",
      email: "1",
      image: "default.png",
      onlinestatus: true,
      gender: "male",
    },
    {
      name: "Kamran",
      email: "2",
      image: "default.png",
      onlinestatus: false,
      surname: "Nebiyev",
      gender: "male",
    },
    {
      name: "Turane",
      email: "3",
      image: "default.png",
      onlinestatus: false,
      surname: "Cabbarova",
      gender: "female",
    },
  ];

  useEffect(() => {
    let newFriends = data;
    if (!searchParameters.online) {
      newFriends = data.filter((friend) => {
        const main =
          friend.name.toLowerCase().includes(searchkeyword) ||
          friend.surname.toLowerCase().includes(searchkeyword);
        if (searchParameters.gender === "any") return main;
        if (searchParameters.gender === "male") return main && friend.gender === "male";
        if (searchParameters.gender === "female") return main && friend.gender === "female";
      });
    } else {
      newFriends = data.filter((friend) => {
        const main =
          (friend.name.toLowerCase().includes(searchkeyword) ||
            friend.surname.toLowerCase().includes(searchkeyword)) &&
          friend.onlinestatus;
        if (searchParameters.gender === "any") return main;
        if (searchParameters.gender === "male") return main && friend.gender === "male";
        if (searchParameters.gender === "female") return main && friend.gender === "female";
      });
    }
    setFriends(newFriends);
  }, [searchkeyword, searchParameters]);

  return (
    <>
      <div className="friends-top">
        <div
          className={`friends-top-item ${!searchParameters.online && "selected"}`}
          onClick={() => setSearchParameters({ ...searchParameters, online: false })}
        >
          All friends <span className="friends-count">{data.length}</span>
        </div>
        <div
          className={`friends-top-item ${searchParameters.online && "selected"}`}
          onClick={() => setSearchParameters({ ...searchParameters, online: true })}
        >
          Friends online{" "}
          <span className="friends-count">{data.filter((user) => user.onlinestatus).length}</span>
        </div>
        <button className="find-friends">Find Friends</button>
      </div>
      <div className="friends-search">
        <SearchBar
          setSearchKeyword={setSearchKeyword}
          searchkeyword={searchkeyword}
          setSearchParameters={setSearchParameters}
        />
      </div>
      <div className="friends-list">
        {friends.map((friend) => {
          return <Friend key={friend.email} {...friend} />;
        })}
      </div>
    </>
  );
}

export default Myfriends;
