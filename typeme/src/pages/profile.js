import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { Link, useParams } from "react-router-dom";
import PSidebar from "../components/profile/profile_sidebar";

const Profile = () => {
  const { instance, user } = useGlobalContext();
  const { username } = useParams();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [showinfo, setShowinfo] = useState(false);
  const { name, surname, statusmessage } = profile;

  const info = [
    { title: "Language", value: "English" },
    { title: "Language", value: "English" },
  ];

  useEffect(() => {
    instance
      .post("/profile/user", { username: username })
      .then(({ data }) => {
        setProfileLoading(false);
        setProfile(data);
      })
      .catch((res) => console.log(res));
  }, [username, instance]);

  return (
    <>
      <div className={`loading ${profileLoading ? "d-flex" : "d-none"}`}>
        <div className="lds-dual-ring"></div>
      </div>

      <div className={`col-4 ${!profileLoading ? "d-block" : "d-none"}`}>
        <PSidebar />
      </div>
      <div
        style={{ marginLeft: "-15px" }}
        className={`col-8 ${!profileLoading ? "d-block" : "d-none"}`}
      >
        <div className="my-profile">
          <div className="page-block">
            <div className="page-info">
              <div className="page-info-top">
                <div className="user-basic-info">
                  <div className="user-name">
                    {name} {surname}
                  </div>
                  <div className="online-status">{"online"}</div>
                </div>
                <div className="user-current-status">
                  {statusmessage ? "hey" : "set a status message"}
                </div>
              </div>
              <div className="profile-info">
                {info.length > 0 && (
                  <div className="profile-info-box">
                    <div className="info-title">{info[0].title}:</div>
                    <div className="info-value">{info[0].value}</div>
                  </div>
                )}
                <button className="full-info" onClick={() => setShowinfo(!showinfo)}>
                  Show full information
                </button>
              </div>
              {showinfo && (
                <div className="profile-full-info">
                  {info.length > 0 &&
                    info
                      .filter((userinfo) => info[0] !== userinfo)
                      .map((userinfo) => {
                        const { value, title } = userinfo;
                        return (
                          <div key={title} className="profile-info-box">
                            <div className="info-title">{title}:</div>
                            <div className="info-value">{value}</div>
                          </div>
                        );
                      })}
                </div>
              )}
            </div>
            <div className="page-counts"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
