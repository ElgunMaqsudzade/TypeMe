import React, { useEffect, useState, useRef, createRef } from "react";
import { useGlobalContext } from "../context";
import { useParams } from "react-router-dom";
import ReactCrop from "react-image-crop";
import Resizer from "react-image-file-resizer";
import DeletePhoto from "./DeletePhoto";
import {
  image64toCanvasRef,
  extractImageFileExtensionFromBase64,
  base64StringtoFile,
} from "../customHooks/ReuseableUtils";
import "react-image-crop/lib/ReactCrop.scss";
import Friends from "./profile_friends";
import "../../sass/_profile-sidebar.scss";
import { Icon16Cancel, Icon24Upload, Icon24ReportOutline } from "@vkontakte/icons";
import outClick from "../customHooks/showHide";

function Profile_sidebar() {
  const {
    instance,
    user,
    RefreshUser,
    AddFriend,
    RemoveFriend,
    friendsLoading,
    setFriendsLoading,
  } = useGlobalContext();
  const { username } = useParams();
  const [deleteModal, setDeleteModal] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isReqFriend, setIsReqFriend] = useState(null);
  const [userfriends, setUserFriends] = useState([]);
  const [userReqfriends, setUserReqFriends] = useState([]);
  const [friendOptions, setFriendOptions] = useState({ showFriendSettings: false });
  const [ImgWidth, setImgWidth] = useState("650px");
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImage, setProfileImage] = useState();
  const [profile, setProfile] = useState({});
  const [crop, setCrop] = useState({
    aspect: 1 / 1,
    unit: "px",
    width: 200,
    height: 200,
  });
  const [preview, setPreview] = useState(null);
  const [cropPreviewShow, setCropPreviewShow] = useState(false);
  const [showavatar, setShowavatar] = useState(false);
  const modal = useRef(null);
  const imagePreviewCanvasRef = createRef();
  const friendSettings = createRef();

  const Cancel = () => {
    setProfileImage(null);
  };

  outClick(friendSettings, () => {
    if (friendOptions.showFriendSettings) {
      return setFriendOptions({ ...friendOptions, showFriendSettings: false });
    }
  });

  outClick(modal, () => {
    if (showavatar) {
      return Cancel();
    }
  });

  useEffect(() => {
    setIsReqFriend(null);
    setIsFriend(false);
    userfriends.map((friend) => {
      if (friend.username === username) {
        return setIsFriend(true);
      }
    });
    userReqfriends.map((friend) => {
      if (friend.username === username) {
        if (friend.isfromuser) {
          return setIsReqFriend(true);
        } else {
          return setIsReqFriend(false);
        }
      }
    });
  }, [username, userfriends, userReqfriends]);

  useEffect(() => {
    if (user.username && friendsLoading) {
      instance
        .post("friend/getallfriends", {
          username: user.username,
          status: 1,
        })
        .then(({ data }) => {
          setUserFriends(data.friends);
        })
        .catch((res) => {
          console.log(res);
        });
      instance
        .post("friend/getallfriends", {
          username: user.username,
          status: 3,
        })
        .then(({ data }) => {
          setUserReqFriends(data.friends);
          setFriendsLoading(false);
        })
        .catch((res) => {
          console.log(res);
        });
      setFriendOptions((prev) => {
        return { ...prev, showFriendSettings: false };
      });
    }
  }, [user.username, friendsLoading]);

  useEffect(() => {
    if (profileImage) {
      Resizer.imageFileResizer(
        profileImage,
        900,
        500,
        "JPEG",
        100,
        0,
        (res) => {
          setPreview(res);
          var i = new Image();
          i.onload = function () {
            setImgWidth(`${i.width}px`);
          };
          i.src = res;
        },
        "base64",
        200,
        200
      );
    } else {
      setShowavatar(false);
      setCropPreviewShow(false);
      setImageLoading(false);
      setCrop({
        aspect: 1 / 1,
        unit: "px",
        width: 200,
        height: 200,
      });
    }
  }, [profileImage, user.username]);

  const SendProfileImage = () => {
    setImageLoading(true);
    const canvasRef = imagePreviewCanvasRef.current;
    const fileExtension = extractImageFileExtensionFromBase64(preview);
    const filename = "User_Image." + fileExtension;
    const imgData64 = canvasRef.toDataURL("image/" + fileExtension);
    const newSendImage = base64StringtoFile(imgData64, filename);
    let fdata = new FormData();
    fdata.append("photo", newSendImage);
    fdata.append("username", user.username);
    instance
      .put("/profile/changeimage", fdata)
      .then((res) => {
        RefreshUser();
        setImageLoading(false);
        setShowavatar(false);
        setProfileImage(null);
      })
      .catch((res) => console.log(res));
  };
  const SendAlbomImage = () => {
    setImageLoading(true);
    const fileExtension = extractImageFileExtensionFromBase64(preview);
    const filename = "UserFull_Image." + fileExtension;
    const newSendImage = base64StringtoFile(preview, filename);
    let fdata = new FormData();
    fdata.append("photo", newSendImage);
    fdata.append("username", user.username);
    instance
      .put("/profile/saveimage", fdata)
      .then((res) => {
        setPreview(null);
        RefreshUser();
        setImageLoading(false);
        setShowavatar(false);
        setProfileImage(null);
      })
      .catch((res) => {
        console.log(res);
      });
  };

  const CropImageLoaded = (crop) => {
    setCrop(crop);
  };
  const HandleCropOnChange = (crop) => {
    setCrop(crop);
  };
  const HandleCropComplete = (crop) => {
    const canvasRef = imagePreviewCanvasRef.current;
    const image64 = preview;
    image64toCanvasRef(canvasRef, image64, crop);
  };

  useEffect(() => {
    instance
      .post("/profile/user", { username: username })
      .then(({ data }) => {
        setProfile(data);
      })
      .catch((res) => console.log(res));
  }, [username, instance]);

  return (
    <>
      <div className="profile-sidebar">
        <div className="page-block profile-box">
          <div
            className="avatar close-card"
            onClick={() => {
              if (user.username === username) setShowavatar(true);
            }}
          >
            {profile.image &&
              !profile.image.includes("cutedProfile/default.png") &&
              user.username === username && (
                <Icon16Cancel
                  className="close-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal(true);
                  }}
                />
              )}

            <img src={profile.image} alt="" />
            {user.username === username && (
              <div className="text-box">
                <div className="avatar-text">
                  <Icon24Upload className="avatar-icon" />
                  Upload photo
                </div>
              </div>
            )}
          </div>
          <div className="profile-sidebar-settings">
            {user.username === username ? (
              <>
                <div className="edit profile-sidebar-minor-item">Edit</div>
              </>
            ) : (
              <>
                <div className="write profile-sidebar-main-item">Write message</div>
                {isFriend ? (
                  <div className="sidebar-item-holder">
                    <div
                      ref={friendSettings}
                      className={`profile-sidebar-minor-item dropdown ${
                        friendOptions.showFriendSettings ? "active" : ""
                      }`}
                      onClick={() =>
                        setFriendOptions({
                          ...friendOptions,
                          showFriendSettings: !friendOptions.showFriendSettings,
                        })
                      }
                    >
                      You're friends
                    </div>
                    {friendOptions.showFriendSettings && (
                      <>
                        <div className="profile-sidebar-friend-settings">
                          <div
                            className="friend-settings-item"
                            onClick={() => RemoveFriend({ tousername: username })}
                          >
                            Unfriend
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      className="add-friend profile-sidebar-main-item"
                      onClick={() => {
                        if (isReqFriend) {
                          RemoveFriend({ tousername: username });
                        } else if (!isReqFriend) {
                          AddFriend({ tousername: username });
                        } else {
                          AddFriend({ tousername: username });
                        }
                      }}
                    >
                      {friendsLoading ? (
                        <div className="lds-ellipsis slim">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : isReqFriend === null ? (
                        "Add friend"
                      ) : isReqFriend ? (
                        "Unfollow"
                      ) : (
                        "Add friend"
                      )}
                    </div>
                    {isReqFriend === false && (
                      <div className="following">{profile.name} is following you</div>
                    )}
                  </>
                )}
                <div className="sidebar-minor-items">
                  <hr className="divider" />
                  <div className="sidebar-minor-item">
                    <Icon24ReportOutline className="sidebar-minor-item-icon" />
                    Report
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="page-block">
          <Friends />
        </div>
      </div>
      {deleteModal && <DeletePhoto setDeleteModal={setDeleteModal} deleteModal={deleteModal} />}
      {showavatar &&
        (!preview ? (
          <div className="modal-box">
            <div ref={modal} className="avatar-picker-box">
              <div className="picker-top">
                Upload new photo
                <Icon16Cancel
                  className="close-icon"
                  onClick={() => {
                    setShowavatar(false);
                  }}
                />
              </div>
              <div className="picker-body">
                <div className="picker-options">
                  Please upload a real photo of yourself so your friends can recognize you. We
                  support JPG, GIF or PNG files.
                </div>
                <div className="selecter">
                  <form
                    encType="multipart/form-data"
                    accept="image/*"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <label htmlFor="avatar-picker" type="submit" className="main-btn">
                      Select file
                    </label>
                    <input
                      type="file"
                      className="avatar-picker"
                      id="avatar-picker"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && file.type.substr(0, 5) === "image") {
                          setProfileImage(file);
                        } else {
                          setProfileImage(null);
                        }
                      }}
                    />
                  </form>
                </div>
                <div className="picker-footer">
                  <div className="footer-text">
                    If you have any problems with your upload, try using a smaller picture.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="modal-box">
            <div className="preview">
              <div className="preview-top">
                Your profile photo
                <Icon16Cancel className="close-icon" onClick={() => Cancel()} />
              </div>
              <div className="preview-body">
                <div className="preview-title">
                  {cropPreviewShow
                    ? "The thumbnail will appear next to your posts, private messages and comments."
                    : "Please select an area for your profile picture."}
                </div>
                <div className="preview-box">
                  <canvas
                    className={`crop-preview ${cropPreviewShow ? "show" : ""}`}
                    ref={imagePreviewCanvasRef}
                  ></canvas>
                  <div className={`crop-preview ${!cropPreviewShow ? "show" : ""}`}>
                    <ReactCrop
                      src={preview}
                      style={{ width: ImgWidth }}
                      crop={crop}
                      minWidth={200}
                      minHeight={200}
                      maxWidth={900}
                      maxHeight={600}
                      onChange={HandleCropOnChange}
                      onImageLoaded={CropImageLoaded}
                      onComplete={HandleCropComplete}
                    />
                  </div>
                </div>
              </div>
              <div className="preview-footer">
                <button
                  onClick={() => {
                    if (cropPreviewShow) {
                      SendProfileImage();
                      SendAlbomImage();
                    } else {
                      if (crop.width >= 200) {
                        setCropPreviewShow(true);
                      }
                    }
                  }}
                  className="save-btn"
                >
                  {imageLoading ? (
                    <div className="lds-ellipsis">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    "Save and continue"
                  )}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    if (cropPreviewShow) {
                      setCropPreviewShow(false);
                    } else {
                      Cancel();
                    }
                  }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}

export default Profile_sidebar;
