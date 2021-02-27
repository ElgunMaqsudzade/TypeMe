import React from "react";
import { Link } from "react-router-dom";

function Friend({ name, image, surname, hometown, onlinestatus }) {
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
          <div className="friend-settings"></div>
        </div>
      </div>
    </>
  );
}

export default Friend;
