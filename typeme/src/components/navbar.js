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
  const { user, HandleOldUsers, instance } = useGlobalContext();
  const [showSettings, setShowSettings] = useState(null);
  const [findUsers, setFindUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  const settings = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchKeyword) {
      instance
        .post("authenticate/find", {
          key: searchKeyword,
          skip: 0,
        })
        .then(({ data }) => {
          setFindUsers(data.users);
        })
        .catch((res) => {
          console.log(res);
        });
      if (!showUsers) {
        setShowUsers(true);
      }
    }
  }, [searchKeyword]);

  useOutsideClick(searchInputRef, () => {
    if (showUsers) {
      setShowUsers(false);
    }
  });

  const LogoutHandler = () => {
    const { email, image, name, surname } = user;
    HandleOldUsers({
      email: email,
      image: image,
      name: name,
      surname: surname,
    });
    localStorage.removeItem("login");
    history.push("/");
  };

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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  history.push(`/friends/find?keyword=${searchInputRef.current.value}`);
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search"
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onFocus={() => setShowUsers(true)}
                />
              </form>
              {showUsers && (
                <div className="users">
                  {findUsers.length > 0 &&
                    findUsers.slice(0, 8).map((per) => {
                      const { username, name, surname, image } = per;
                      return (
                        <Link to={`/user/${username}`} key={username} className="user">
                          <div className="img-holder">
                            <img src={image} alt="" />
                          </div>
                          <div className="name-box">
                            {name} {surname}
                          </div>
                        </Link>
                      );
                    })}
                </div>
              )}
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
                <img src={user.image} alt="" className="img-fluid" />
              </div>
              <Icon12Dropdown className="arrow-down" />
              {showSettings && (
                <ul className="settings">
                  <li className="setting-items user-profile">
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
                  </li>
                  <hr className="divider" />
                  <li className="setting-items" onClick={() => history.push(`/edit`)}>
                    Settings
                  </li>
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
