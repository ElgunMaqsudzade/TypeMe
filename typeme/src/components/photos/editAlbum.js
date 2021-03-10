import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Camera from "../../images/camera_big.png";
import { Icon24BrowserForward } from "@vkontakte/icons";
import SlimPhoto from "./slimPhoto";

function EditAlbum({ id, name, cover, images, setAlbumImages, DeleteAlbum }) {
  const { username } = useParams();
  const [coverWidth, setCoverWidth] = useState();

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
              ></div>
            </div>
            <div className="col-6">
              <label className="title">Album title</label>
              <input type="text" className="title-inp" value={name} />
              <button className="main-btn-slimer save-btn">Save changes</button>
            </div>
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
    </div>
  );
}

export default EditAlbum;
