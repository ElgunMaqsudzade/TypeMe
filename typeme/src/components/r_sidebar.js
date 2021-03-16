import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "./context";

const data = [
  { id: 1, title: "News", link: "/feed" },
  { id: 2, title: "Liked", link: "/feed?filter=liked" },
  { id: 3, title: "Commented", link: "/feed?filter=commented" },
];

function RSidebar() {
  const { user } = useGlobalContext();
  const location = useLocation();
  return (
    <div className="edit-sidebar mCard">
      <div className="user-profile">
        <Link to={`/user/${user.username}`} className="to-profile">
          <div className="thumbnail">
            <img src={user.image} alt="" />
          </div>
          <div className="user-info">
            <div className="user-name">
              {user.name} {user.surname}
            </div>
            <div className="user-descr">Go to Profile</div>
          </div>
        </Link>
      </div>
      <hr className="divider" />
      <div className="sections">
        {data.map((tab) => {
          const { link, id, title } = tab;
          return (
            <Link
              key={id}
              to={`${link}`}
              className={`item ${link === location.pathname + location.search ? "active" : ""}`}
            >
              {title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default RSidebar;
