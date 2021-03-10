import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { Link, useParams } from "react-router-dom";
import Camera from "../../images/camera_big.png";
import outside from "../customHooks/showHide";
import { Icon24BrowserForward, Icon24Gallery, Icon16Cancel } from "@vkontakte/icons";
import SlimPhoto from "./slimPhoto";

function EditAlbum({
  id,
  name,
  cover,
  images,
  setAlbumImages,
  DeleteAlbum,
  ChangeAlbumName,
  ChangeCover,
}) {
  const { instance } = useGlobalContext();
  const { username } = useParams();
  const [coverWidth, setCoverWidth] = useState();
  const [albumName, setAlbumName] = useState(name);
  const [showCoverImages, setShowCoverImages] = useState(false);
  const coverModal = React.useRef(null);

  outside(coverModal, () => {
    Cancel();
  });

  const Cancel = () => {
    if (showCoverImages) {
      setShowCoverImages(false);
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = cover;
    if (images.length === 0) {
      img.src = Camera;
    }
    img.onload = function () {
      setCoverWidth(img.width);
    };
  }, [cover, images]);

  return (
    <div className="images mCard">
      <div className="single-album">
        <div className="topside">
          <div className="breadcrumps">
            <Link className="breadcrump link" to={`/photos/${username}`}>
              My photos
            </Link>
            <div className="breadcrump">
              <Icon24BrowserForward className="between-icon" />
            </div>
            <Link to={`/photos/${username}?album=${id}`} className="breadcrump link">
              {name}
            </Link>
            <div className="breadcrump">
              <Icon24BrowserForward className="between-icon" />
            </div>
            <div className="breadcrump">Manage album</div>
          </div>
          <div className="buttons">
            <button className="minor-btn-slimer" onClick={() => DeleteAlbum(id)}>
              Delete Album
            </button>
          </div>
        </div>
        <div className="body-side edit-side">
          <div className="row justify-content-center">
            <div className="col-4">
              <div className="title">Use as album cover</div>
              <div
                className={`cover ${coverWidth < 200 ? "small-img" : ""}`}
                style={{
                  backgroundImage: `url(${images.length === 0 ? Camera : cover})`,
                }}
              >
                {images.length !== 0 && (
                  <div className="text-box">
                    <div className="avatar-text" onClick={() => setShowCoverImages(true)}>
                      <Icon24Gallery className="avatar-icon" />
                      Edit cover
                    </div>
                  </div>
                )}
              </div>
            </div>
            {name !== "Photos on my wall" && name !== "My profile photos" && (
              <div className="col-6">
                <label className="title">Album title</label>
                <input
                  type="text"
                  className="title-inp"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                />
                <button
                  className="main-btn-slimer save-btn"
                  onClick={() => ChangeAlbumName(id, albumName)}
                >
                  Save changes
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="footer-lg-side">
          <div className="footer-title">
            <div className="count">
              <b>{images.length}</b> photos
            </div>
            <div className="options">
              <div className="option">Select all photos</div>
            </div>
          </div>
          <div className={`images-box-mini ${images.length === 0 ? "empty" : ""}`}>
            {images.length > 0
              ? images.map((image) => {
                  return (
                    <SlimPhoto
                      key={image.id}
                      {...image}
                      images={images}
                      setImages={setAlbumImages}
                    />
                  );
                })
              : "There are no photos in this album"}
          </div>
        </div>
      </div>
      {showCoverImages && (
        <div className="modal-box">
          <div ref={coverModal} className="modal-holder cover-modal delete-modal">
            <div className="cover-top modal-top">
              Choose a cover for the album «{name}»
              <Icon16Cancel className="modal-top-icon" onClick={() => Cancel()} />
            </div>
            <div className="cover-body modal-body">
              {images.map((image) => {
                return (
                  <div
                    key={image.id}
                    className="cover-image"
                    style={{
                      backgroundImage: `url(${image.photo})`,
                    }}
                    onClick={() => ChangeCover(id, image.id)}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditAlbum;
