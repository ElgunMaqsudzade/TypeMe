import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "./context";
import {
  Icon20Users3Outline,
  Icon28Profile,
  Icon20NewsfeedOutline,
  Icon20MessageOutline,
  Icon20UsersOutline,
  Icon20PictureOutline,
  Icon20MusicOutline,
  Icon20VideoOutline,
} from "@vkontakte/icons";

const LSidebar = () => {
  const { user } = useGlobalContext();
  const data = [
    {
      id: 1,
      icon: <Icon28Profile />,
      info: "My profile",
      link: `/user/${user.username}`,
    },
    { id: 2, icon: <Icon20NewsfeedOutline />, info: "News", link: "/feed" },
    { id: 3, icon: <Icon20MessageOutline />, info: "Messenger", link: "/messenger" },
    { id: 4, icon: <Icon20UsersOutline />, info: "Friends", link: "/friends/all" },
    {
      id: 6,
      icon: <Icon20PictureOutline />,
      info: "Photos",
      link: `/photos/${user.username}`,
    },
  ];

  return (
    <aside className="sidebar">
      <ul className="side-items">
        {data.map((item) => {
          const { id, link, icon, info } = item;
          return (
            <li key={id} className="side-item">
              <Link to={link} className="side-item-link">
                {icon}
                <div className="item-title">{info}</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default LSidebar;
