import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { Link, useParams } from "react-router-dom";
import PSidebar from "../components/profile/profile_sidebar";
import InputField from "../components/profile/modalInputField";

const Profile = () => {
  const { instance, user, text, profileLoading, setProfileLoading } = useGlobalContext();
  const { username } = useParams();
  const [statusMessage, setstatusMessage] = useState({
    show: false,
    message: "set a status message",
  });
  const [profile, setProfile] = useState({});
  const [showinfo, setShowinfo] = useState(false);
  const { name, surname, statusmessage } = profile;

  const info = [
    { title: "Language", value: "English" },
    { title: "Language", value: "English" },
  ];

  useEffect(() => {
    setstatusMessage((prev) => {
      return { ...prev, message: text };
    });
  }, [text]);

  useEffect(() => {
    setProfileLoading(true);
    instance
      .post("/profile/user", { username: username })
      .then(({ data }) => {
        setProfile(data);
        setProfileLoading(false);
      })
      .catch((res) => console.log(res));
    // instance
    //   .post("/profile/addetailuser", { username: username })
    //   .then(({ data }) => {
    //     console.log(data);
    //   })
    //   .catch((res) => console.log(res));
  }, [username]);

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
                {statusmessage ? (
                  <div className="user-current-status">{statusMessage.message}</div>
                ) : (
                  user.username === username && (
                    <>
                      <button
                        className="user-current-status"
                        onClick={() => setstatusMessage({ ...statusMessage, show: true })}
                      >
                        {statusMessage.message}
                      </button>
                    </>
                  )
                )}
                {statusMessage.show && <InputField />}
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
