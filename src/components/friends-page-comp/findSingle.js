import React from "react";
import { Icon16UserAdd } from "@vkontakte/icons";
import { Link } from "react-router-dom";
function FindSingle({ name, image, surname, username, mediumFriend, user }) {
  return (
    <>
      <Link ref={mediumFriend} to={`/user/${username}`} className="find-single">
        <div className="image-holder">
          <img src={image} alt="" />
        </div>
        <div className="single-body">
          <div className="name-box">
            {name} {surname}
          </div>
          {username !== user.username && <Icon16UserAdd className="add-friend" />}
        </div>
      </Link>
    </>
  );
}

export default FindSingle;
