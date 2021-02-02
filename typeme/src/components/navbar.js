import React, { useState } from "react";
import logo from "../images/only-logo.png";
import { Link } from "react-router-dom";
import {
  IoIosAdd,
  IoIosNotificationsOutline,
  IoMdChatboxes,
  IoIosSearch,
  IoMdHome,
  IoIosCompass,
  IoIosPeople,
  IoIosArrowDown,
} from "react-icons/io";
import { useGlobalContext } from "./context";

const Navbar = () => {
  const { setSearchTerm, toggled, setToggled } = useGlobalContext();
  return (
    <nav>
      <div className="nav-center ">
        <div className="nav-left-side">
          <Link to="/">
            <div className="logo-container">
              <div className="brand-holder">
                <img src={logo} alt="" />
              </div>
              <h1>TypeMe</h1>
            </div>
          </Link>
          <div className="search-box">
            <input
              type="text"
              autoComplete="off"
              placeholder="Search"
              className={`searchInput`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoIosSearch className="search-icon" />
          </div>
        </div>
        <button
          className={`nav-toggle ${toggled ? "toggled" : ""}`}
          onClick={() => setToggled(!toggled)}
        >
          <hr className="line-1" />
          <hr className="line-2" />
          <hr className="line-3" />
        </button>
        <div className="nav-menu">
          <Link to="/" className="menu-item subscribed">
            <IoMdHome />
          </Link>
          <Link to="/all" className="menu-item  all">
            <IoIosCompass />
          </Link>
          <Link to="/groups" className="menu-item  groups">
            <IoIosPeople />
          </Link>
        </div>
        <div className="nav-right-side">
          <ul className="links">
            <li className="nav-link">
              <button>
                <IoIosAdd className="add-posts" />
              </button>
            </li>
            <li className="nav-link">
              <button>
                <IoIosNotificationsOutline className="notifications" />
              </button>
            </li>
            <li className="nav-link">
              <button>
                <IoMdChatboxes className="messages" />
              </button>
            </li>
          </ul>
          <div className="profile-box">
            <div className="bg-div">
              <Link to="/profile" className="pr-div">
                <div className="avatar-holder">
                  <img src="" alt="" />
                </div>
                <div className="name">Elgun</div>
              </Link>
              <div className="addition">
                <IoIosArrowDown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
