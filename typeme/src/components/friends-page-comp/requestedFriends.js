import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";

function RequestedFriends({ myfriends, loading }) {
  const { AddFriend, addFriendRes } = useGlobalContext();
  const [showPending, setShowPending] = useState(true);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (friends.filter((friend) => !friend.isfromuser).length !== 0) {
      setShowPending(true);
    } else {
      setShowPending(false);
    }
  }, [friends]);

  useEffect(() => {
    setFriends(myfriends.filter((user) => !user.isfromuser));
  }, [myfriends, loading]);

  return (
    <>
      <div className="friends-top">
        {myfriends.filter((friend) => !friend.isfromuser).length !== 0 && (
          <div
            className={`friends-top-item ${showPending === true ? "selected" : ""}`}
            onClick={() => {
              setShowPending(true);
              setFriends(myfriends.filter((user) => !user.isfromuser));
            }}
          >
            Pending{" "}
            <span className="friends-count">
              {myfriends.filter((friend) => !friend.isfromuser).length}
            </span>
          </div>
        )}
        {myfriends.filter((friend) => friend.isfromuser).length !== 0 && (
          <div
            className={`friends-top-item ${showPending === false ? "selected" : ""}`}
            onClick={() => {
              setShowPending(false);
              setFriends(myfriends.filter((user) => user.isfromuser));
            }}
          >
            Outgoing{" "}
            <span className="friends-count">
              {myfriends.filter((friend) => friend.isfromuser).length}
            </span>
          </div>
        )}
      </div>
      <div className="pending-list">
        {loading ? (
          <div className="loading">
            <div className="lds-dual-ring"></div>
          </div>
        ) : (
          <div>
            {friends.map((friend) => {
              const { image, name, surname, username, isfromuser } = friend;
              return (
                <div key={username} className="pending-item">
                  <div className="image-holder">
                    <img src={image && require(`../../images/user/${image}`).default} alt="" />
                  </div>
                  <div className="pending-body">
                    <div className="name-box">
                      {name} {surname}
                    </div>
                    {addFriendRes.added && addFriendRes.username === username ? (
                      <div className="addfriend-content">
                        <span style={{ textTransform: "capitalize" }}>{name}</span> is now your
                        friend.
                      </div>
                    ) : !isfromuser ? (
                      <button
                        className="add-friend"
                        onClick={() => {
                          AddFriend({ tousername: username });
                        }}
                      >
                        Add friend
                      </button>
                    ) : (
                      <button className="remove-friend s-button">Unfollow</button>
                    )}
                  </div>
                </div>
              );
            })}
            {friends.length === 0 && <div className="no-friends">You aren't following anyone</div>}
          </div>
        )}
      </div>
    </>
  );
}

export default RequestedFriends;
