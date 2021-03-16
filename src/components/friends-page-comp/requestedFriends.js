import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { Link } from "react-router-dom";

function RequestedFriends() {
  const { AddFriend, RemoveFriend, user, instance } = useGlobalContext();
  const [showPending, setShowPending] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (user.username !== null) {
      instance
        .post("friend/getallfriends", { username: user.username, status: 3 })
        .then(({ data }) => {
          setLoading(false);
          setPending(data.friends.filter((user) => !user.isfromuser));
          setOutgoing(data.friends.filter((user) => user.isfromuser));
        })
        .catch((res) => {
          console.log(res);
        });
    }
  }, [user.username, instance]);

  return (
    <>
      <div className="friends-top">
        <div
          className={`friends-top-item ${showPending === true ? "selected" : ""}`}
          onClick={() => {
            setShowPending(true);
          }}
        >
          Pending <span className="friends-count">{pending.length}</span>
        </div>
        <div
          className={`friends-top-item ${showPending === false ? "selected" : ""}`}
          onClick={() => {
            setShowPending(false);
          }}
        >
          Outgoing <span className="friends-count">{outgoing.length}</span>
        </div>
      </div>
      <div className="pending-list">
        {loading ? (
          <div className="loading">
            <div className="lds-dual-ring"></div>
          </div>
        ) : (
          <>
            {(showPending ? pending : outgoing).map((friend) => {
              const { image, name, surname, username, isfromuser } = friend;
              console.log(image);
              return (
                <div key={username} className="pending-item">
                  <div className="image-holder">
                    <img src={image} alt="" />
                  </div>
                  <div className="pending-body">
                    <Link to={`/user/${username}`} className="name-box">
                      {name} {surname}
                    </Link>
                    {!isfromuser ? (
                      <button
                        className="add-friend"
                        onClick={() => {
                          AddFriend({ tousername: username });
                          setPending(pending.filter((friend) => friend.username !== username));
                        }}
                      >
                        Add friend
                      </button>
                    ) : (
                      <button
                        className="remove-friend s-button"
                        onClick={() => {
                          RemoveFriend({ tousername: username });
                          setOutgoing(outgoing.filter((friend) => friend.username !== username));
                        }}
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      {pending.length === 0 && showPending && (
        <div className="no-friends">There is no one at pending</div>
      )}
      {outgoing.length === 0 && !showPending && (
        <div className="no-friends">There is no one at outgoing</div>
      )}
    </>
  );
}

export default RequestedFriends;
