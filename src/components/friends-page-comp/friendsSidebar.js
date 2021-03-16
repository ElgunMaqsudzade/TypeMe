import React from "react";
import { Link, useParams } from "react-router-dom";
import "../../sass/_friends-sidebar.scss";

const data = [
  { id: 1, content: "My friends", tab: "all" },
  { id: 2, content: "Find friends", tab: "find" },
  { id: 3, content: "Friend requests", tab: "requested" },
];

function FriendsSidebar() {
  const { section } = useParams();
  return (
    <>
      <div className="friends-sidebar">
        <div className="sidebar-items">
          {data.map((item) => {
            const { id, content, tab } = item;
            return (
              <Link
                key={id}
                className={`sidebar-item ${section.includes(tab) ? "active" : ""}`}
                to={{ pathname: `/friends/${tab !== "find" ? tab : tab + "?keyword="}` }}
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
