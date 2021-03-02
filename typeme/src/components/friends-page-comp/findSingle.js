import React, { useEffect } from "react";
import { Icon16UserAdd, Icon16Cancel } from "@vkontakte/icons";
function FindSingle({ name, image, surname, username, mediumFriend }) {
  return (
    <>
      <div ref={mediumFriend} className="find-single">
        <div className="image-holder">
          <img src={image && require(`../../images/user/${image}`).default} alt="" />
          <Icon16Cancel className="close-friend" />
        </div>
        <div className="single-body">
          <div className="name-box">
            {name} {surname}
          </div>
          <Icon16UserAdd className="add-friend" />
        </div>
      </div>
    </>
  );
}

export default FindSingle;
