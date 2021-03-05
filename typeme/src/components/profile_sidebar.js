import React, { useEffect, useState, useRef, createRef } from "react";
import { useGlobalContext } from "./context";
import { useParams } from "react-router-dom";
import ReactCrop from "react-image-crop";
import { image64toCanvasRef } from "./customHooks/ReuseableUtils";
import "react-image-crop/lib/ReactCrop.scss";
import Friends from "./profile/profile_friends";
import "../sass/_profile-sidebar.scss";
import { Icon16Cancel, Icon24Upload } from "@vkontakte/icons";
import outClick from "./customHooks/showHide";

function Profile_sidebar() {
  const { instance, user, RefreshUser } = useGlobalContext();
  const { username } = useParams();
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState({});
  const [crop, setCrop] = useState({
    aspect: 1 / 1,
    unit: "px",
    width: 180,
    height: 180,
  });
  const [preview, setPreview] = useState(null);
  const [cropPreview, setCropPreview] = useState(null);
  const [cropPreviewShow, setCropPreviewShow] = useState(false);
  const [showavatar, setShowavatar] = useState(false);
  const modal = useRef(null);
  const imagePreviewCanvasRef = createRef();

  const Cancel = () => {
    setProfileImage(null);
  };

  outClick(modal, () => {
    if (showavatar) {
      return Cancel();
    }
  });

  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let fdata = new FormData();
        fdata.append("photo", profileImage);
        fdata.append("username", user.username);
        setPreview(reader.result);
      };
      reader.readAsDataURL(profileImage);
    } else {
      setPreview(null);
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

  const SendImage = () => {
    setImageLoading(true);
    let fdata = new FormData();
    fdata.append("photo", profileImage);
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

  const CropImageLoaded = (image) => {};
  const HandleCropOnChange = (crop) => {
    setCrop(crop);
  };
  const HandleCropComplete = (crop) => {
    const canvasRef = imagePreviewCanvasRef.current;
    const imgSrc = preview;
    console.log(crop);
    image64toCanvasRef(canvasRef, imgSrc, crop);
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
          <div className="avatar close-card" onClick={() => setShowavatar(true)}>
            {profile.image !==
              "http://jrcomerun-001-site1.ftempurl.com/images/profile/default.png" && (
              <Icon16Cancel
                className="close-icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            )}

            <img src={profile.image} alt="" />
            <div className="text-box">
              <div className="avatar-text">
                <Icon24Upload className="avatar-icon" />
                Upload photo
              </div>
            </div>
          </div>
          <div className="edit">Edit</div>
        </div>
        <div className="page-block">
          <Friends />
        </div>
      </div>
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
                  {!cropPreviewShow && (
                    <ReactCrop
                      src={preview}
                      crop={crop}
                      minWidth={200}
                      minHeight={200}
                      onChange={HandleCropOnChange}
                      onImageLoaded={CropImageLoaded}
                      onComplete={HandleCropComplete}
                    />
                  )}
                </div>
              </div>
              <div className="preview-footer">
                <button
                  onClick={() => {
                    setCropPreviewShow(true);
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
                    setCropPreviewShow(false);
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
