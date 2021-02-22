import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { Icon24NotificationOutline, Icon16SearchOutline, Icon24MusicOutline, Icon12Dropdown } from "@vkontakte/icons";
import { useGlobalContext } from "./context";
const Navbar = () => {
  const { setSearchTerm, toggled, setToggled } = useGlobalContext();
  return (
    <nav>
      <div className="container">
        <div className="row">
          <div className="col-4 nav-main">
            <Link to="/feed" className="nav-brand">
              <div className="logo-holder">
                <img src={logo} alt="" />
              </div>
              TYPEME
            </Link>
            <div className="search-box">
              <Icon16SearchOutline className="search-icon" />
              <input type="text" className="search-input" placeholder="Search" />
            </div>
          </div>
          <div className="col-8 nav-minor">
            <div className="minor-menu">
              <Icon24NotificationOutline className="minor-icons notifications-menu" />
              <Icon24MusicOutline className="minor-icons music-menu" />
            </div>
            <div className="minor-display"></div>
            <div className="account">
              <div className="account-title">Elgun</div>
              <div className="account-image">
                <img src={logo} alt="" className="img-fluid" />
              </div>
              <Icon12Dropdown className="arrow-down" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
