import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Icon24BrowserForward } from "@vkontakte/icons";
import Imagemodal from "../imagemodal";

function SingleAlbum({ id, name, images, AddPhotoHandler }) {
  const { username } = useParams();
  const location = useLocation();

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
            <div className="breadcrump">
              {name} <span className="count">{images.length !== 0 && images.length}</span>
            </div>
          </div>
          <div className="buttons">
            <Link to={`/photos/${username}?album=${id}&act=edit`} className="minor-btn-slimer">
              Edit Album
            </Link>
            <button className="main-btn-slimer" onClick={() => AddPhotoHandler(id)}>
              Add photos
            </button>
          </div>
        </div>
        <div className={`body-side images-box-mini ${images.length === 0 ? "empty" : ""}`}>
          {images.length > 0
            ? images.map((image) => {
                const { id, photo } = image;
                let imgwidth;
                const img = new Image();
                img.src = photo;
                img.onload = function () {
                  imgwidth = img.width;
                };
                return (
                  <Link
                    key={id}
                    to={`${location.pathname}${location.search}&image=${id}`}
                    className={`image ${imgwidth < 200 ? "small-img" : ""}`}
                    style={{
                      backgroundImage: `url(${photo})`,
                    }}
                  ></Link>
                );
              })
            : "There are no photos in this album"}
        </div>
      </div>
      <Imagemodal images={images} />
    </div>
  );
}

export default SingleAlbum;
