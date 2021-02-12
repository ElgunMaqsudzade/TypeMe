import React from "react";
import { Link } from "react-router-dom";
import data from "./sidebarData";
import { IoIosArrowDown } from "react-icons/io";
const LSidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="side-items">
        {data.map((item) => {
          const { id, link, icon, img, info, children } = item;
          return <li></li>;
        })}
      </ul>
    </aside>
  );
};

export default LSidebar;
