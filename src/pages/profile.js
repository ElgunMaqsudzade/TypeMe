import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { Link, useHistory, useParams } from "react-router-dom";
import CreatePost from "../components/createpost";
import PSidebar from "../components/profile/profile_sidebar";
import InputField from "../components/profile/modalInputField";
import Post from "../components/post";

const Profile = () => {
  const history = useHistory();
  const { instance, user, profileLoading, setProfileLoading, EditInfo } = useGlobalContext();
  const { username } = useParams();
  const [statusMessage, setstatusMessage] = useState("");
  const [info, setInfo] = useState([]);
  const [statusInput, setStatusInput] = useState(false);
  const [renderPost, setRenderPost] = useState(true);
  const [profile, setProfile] = useState({});
  const [images, setImages] = useState([]);
  const [profilePosts, setProfilePosts] = useState([]);
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
          Object.keys(data.profileinfo)
            .map((i) => {
              return { title: i, value: data.profileinfo[i] };
            })
            .filter((v) => v.value !== null)
        );
      })
      .catch((res) => console.log(res));
  }, [username]);

  useEffect(() => {
    if (!renderPost) {
      setRenderPost(true);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      instance
        .post("albom/getuseralboms", { username: username })
        .then(({ data }) => {
          let array = [];
          data
            .filter((album) => album.images.length !== 0)
            .map((album) => {
              album.images.map((image) => {
                return array.push(image);
              });
            });
          setImages(array);
        })
        .catch((res) => console.log(res));
    }
  }, [username]);

  useEffect(() => {
    if (user.username && renderPost) {
      instance
        .post("post/getposts", {
          username: user.username,
          postusername: username,
        })
        .then(({ data }) => {
          setProfilePosts(data);
          setRenderPost(false);
        })
        .catch((error) => {
          if (error.response.status) {
            setProfilePosts(null);
            setRenderPost(false);
          }
        });
    }
  }, [username, user.username, renderPost]);

  const HandleSave = (text) => {
    setstatusMessage(text);
    EditInfo({ statusmessage: text });
  };

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
        className={`col-8  ${!profileLoading ? "d-block" : "d-none"}`}
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
                {info.filter((userinfo) => info[0] !== userinfo).length > 0 && (
                  <button className="full-info" onClick={() => setShowinfo(!showinfo)}>
                    Show full information
                  </button>
                )}
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
          </div>
          <div className="profile-content">
            {images.length > 0 && (
              <div className="page-photos mCard">
                <Link to={`/photos/${username}`} className="page-photos-top">
                  Photos <span>{images.length}</span>
                </Link>
                <div className="page-photos-list">
                  {images.slice(-3).map((image) => {
                    return (
                      <Link
                        to={`/user/${username}?image=${image.id}`}
                        key={image.id}
                        className="image"
                        style={{ backgroundImage: `url(${image.photo})` }}
                      ></Link>
                    );
                  })}
                </div>
              </div>
            )}
            {user.username === username && (
              <CreatePost setRenderPost={setRenderPost} renderPost={renderPost} />
            )}
            <div className="user-posts">
              <div className="user-posts-topside">
                <div className="item">All posts</div>
              </div>
              {!renderPost ? (
                profilePosts === null ? (
                  <div className="empty bg-white">
                    You are not friends with the owner of account
                  </div>
                ) : profilePosts.length === 0 ? (
                  <div className="empty bg-white">There are no posts here yet</div>
                ) : (
                  profilePosts.map((post) => {
                    return (
                      <Post
                        key={post.id}
                        posts={profilePosts}
                        {...post}
                        poster={post.user}
                        setRenderPost={setRenderPost}
                        renderPost={renderPost}
                      />
                    );
                  })
                )
              ) : (
                <div className="loading">
                  <div className="lds-dual-ring"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
