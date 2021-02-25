import React, { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "./context";
import useOutsideClick from "../components/customHooks/showHide";
import logo from "../images/logo.png";
import { Link, useHistory } from "react-router-dom";
import {
  Icon24NotificationOutline,
  Icon16SearchOutline,
  Icon24MusicOutline,
  Icon12Dropdown,
} from "@vkontakte/icons";
const Navbar = () => {
  const history = useHistory();
  const { user, setOldUsers } = useGlobalContext();
  const [showSettings, setShowSettings] = useState(null);

  const LogoutHandler = () => {
    localStorage.removeItem("login");
    setOldUsers({
      email: user.email,
      image: user.image,
      name: user.name,
      surname: user.surname,
    });
    history.push("/");
  };

  const settings = useRef(null);
  useOutsideClick(settings, () => {
    if (showSettings) {
      setShowSettings(false);
    }
  });
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
            <button
              className="account"
              ref={settings}
              onClick={() => setShowSettings(!showSettings)}
            >
              <div className="account-title">{user.name}</div>
              <div className="account-image">
                <img
                  src={user.image ? require(`../images/user/${user.image}`).default : null}
                  alt=""
                  className="img-fluid"
                />
              </div>
              <Icon12Dropdown className="arrow-down" />
              {showSettings && (
                <ul className="settings">
                  <li className="setting-items user-profile">
                    <Link to="/profile" className="to-profile">
                      <div className="thumbnail">
                        <img
                          src={user.image ? require(`../images/user/${user.image}`).default : null}
                          alt=""
                        />
                      </div>
                      <div className="user-info">
                        <div className="user-name">
                          {user.name} {user.surname}
                        </div>
                        <div className="user-descr">Go to Profile</div>
                      </div>
                    </Link>
                  </li>
                  <hr className="divider" />
                  <li className="setting-items">Settings</li>
                  <hr className="divider" />
                  <li className="setting-items" onClick={() => LogoutHandler()}>
                    Log out
                  </li>
                </ul>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
