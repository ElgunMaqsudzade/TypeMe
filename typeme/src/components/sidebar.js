import React from "react";
import { Link } from "react-router-dom";
import { IoMdHome, IoIosCompass, IoIosPeople, IoIosArrowDown } from "react-icons/io";
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul className="side-links">
        <li className="side-row">
          <Link to="/profile" className="profile">
            <div className="side-link profile-link">
              <div className="img-holder">
                <img src="" alt="" />
              </div>
              Elgun
            </div>
          </Link>
          <div className="addition">
            <IoIosArrowDown />
          </div>
        </li>
        <Link to="/">
          <li className="side-row">
            <div className="side-link">
              <IoMdHome className="side-icon" />
              Home
            </div>
          </li>
        </Link>
        <Link to="/all">
          <li className="side-row">
            <div className="side-link">
              <IoIosCompass className="side-icon" />
              All
            </div>
          </li>
        </Link>
        <Link to="/groups">
          <li className="side-row">
            <div className="side-link">
              <IoIosPeople className="side-icon" />
              Groups
            </div>
          </li>
        </Link>
      </ul>
    </aside>
  );
};

export default Sidebar;
