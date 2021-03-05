import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../sass/_friends-sidebar.scss";

const data = [
  { id: 1, content: "My friends", tab: "all" },
  { id: 2, content: "Find friends", tab: "find" },
  { id: 3, content: "Friend requests", tab: "requested" },
];

function FriendsSidebar() {
  let location = useLocation().pathname;
  return (
    <>
      <div className="friends-sidebar">
        <div className="sidebar-items">
          {data.map((item) => {
            const { id, content, tab } = item;
            return (
              <Link
                key={id}
                className={`sidebar-item ${location === "/friends/" + tab ? "active" : ""}`}
                to={{ pathname: `/friends/${tab}` }}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default FriendsSidebar;
