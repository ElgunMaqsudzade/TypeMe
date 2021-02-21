import React from "react";
import { Link } from "react-router-dom";
import data from "../data/sidebarData";

const LSidebar = () => {
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
