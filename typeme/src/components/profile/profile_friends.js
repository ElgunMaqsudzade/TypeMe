import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { Link, useParams } from "react-router-dom";

function Profile_friends() {
  const { instance } = useGlobalContext();
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setLoading(false);
    instance
      .post("friend/getallfriends", {
        username: username,
        status: 1,
      })
      .then(({ data }) => {
        setFriends(data.friends);
      })
      .catch((res) => console.log(res));
  }, [username, instance]);

  return (
    <div className="profile-friends">
      <div className="profile-f-title">
        Friends <span className="profile-friends-count">{friends.length}</span>
      </div>
      <div className="profile-friends-body">
        {loading ? (
          <div className="loading">
            <div className="lds-dual-ring"></div>
          </div>
        ) : (
          friends.map((friend) => {
            const { image, name, username } = friend;
            return (
              <Link key={username} to={`/user/${username}`} className="friend">
                <div className="friend-image">
                  <img src={image} alt="" />
                </div>
                <div className="friend-name">{name}</div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Profile_friends;
