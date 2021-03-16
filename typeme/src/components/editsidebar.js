import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "./context";

function Editsidebar() {
  const { user } = useGlobalContext();
  return (
    <div className="edit-sidebar mCard">
      <div className="user-profile">
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
      </div>
      <hr className="divider" />
      <div className="sections">
        <Link to={`/edit`} className="item">
          Basic info
        </Link>
        <Link to={`/edit?page=login`} className="item">
          Login and security
        </Link>
      </div>
    </div>
  );
}

export default Editsidebar;
