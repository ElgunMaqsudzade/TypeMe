import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { Link, useHistory, useParams } from "react-router-dom";
import CreatePost from "../components/createpost";
import PSidebar from "../components/profile/profile_sidebar";
import InputField from "../components/profile/modalInputField";

const Profile = () => {
  const history = useHistory();
  const { instance, user, profileLoading, setProfileLoading, EditInfo } = useGlobalContext();
  const { username } = useParams();
  const [statusMessage, setstatusMessage] = useState("");
  const [info, setInfo] = useState([]);
  const [statusInput, setStatusInput] = useState(false);
  const [profile, setProfile] = useState({});
  const [showinfo, setShowinfo] = useState(false);
  const { name, surname } = profile;

  useEffect(() => {
    setShowinfo(false);
  }, [username]);

  useEffect(() => {
    setProfileLoading(true);
    instance
      .post("/profile/user", { username: username })
      .then(({ data }) => {
        setProfile(data);
        setProfileLoading(false);
      })
      .catch((res) => {
        history.push("/error");
      });
    instance
      .post("/profile/getdetailuser", { username: username })
      .then(({ data }) => {
        setstatusMessage(data.statusmessage);
        setInfo(
          Object.keys(data.profileinfo).map((i) => {
            return { title: i, value: data.profileinfo[i] };
          })
        );
      })
      .catch((res) => console.log(res));
  }, [username]);

  const HandleSave = (text) => {
    setstatusMessage(text);
    EditInfo({ statusmessage: text });
  };

  const data = { info: { tim: "dsa", john: "dsds", key: "dsdsdsa" } };

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
                {user.username === username ? (
                  <button className="user-current-status" onClick={() => setStatusInput(true)}>
                    {statusMessage ? statusMessage : "set a status message"}
                  </button>
                ) : (
                  statusMessage && (
                    <>
                      <div className="user-current-status">{statusMessage}</div>
                    </>
                  )
                )}
                {statusInput && (
                  <InputField
                    setShowInput={setStatusInput}
                    showInput={statusInput}
                    handleSave={HandleSave}
                    info={statusMessage}
                  />
                )}
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
          <div className="posts">
            <CreatePost />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
