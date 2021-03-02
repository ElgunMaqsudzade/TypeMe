import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import outside from "../customHooks/showHide";
import { IoSettingsOutline } from "react-icons/io5";

function Friend({ name, image, surname, hometown, onlinestatus, username }) {
  const [settings, setSettings] = useState(false);

  const refOut = useRef(null);
  outside(refOut, () => {
    if (settings) {
      setSettings(false);
    }
  });

  return (
    <>
      <div className="friend">
        <div className="image-holder">
          <img src={image && require(`../../images/user/${image}`).default} alt="" />
          <div className={`check ${onlinestatus ? "online" : "offline"}`}></div>
        </div>
        <div className="friend-body">
          <Link to="/user" className="friend-name">
            {name} {surname}
          </Link>
          {hometown && <p className="status">{hometown}</p>}
          <Link to="/messenger" className="send-message">
            Write message
          </Link>
        </div>
        <button className="friend-settings" onClick={() => setSettings(!settings)}>
          <IoSettingsOutline />
          {settings && (
            <div className="settings showCard" ref={refOut}>
              <div className="item">Unfriend</div>
            </div>
          )}
        </button>
      </div>
    </>
  );
}

export default Friend;
