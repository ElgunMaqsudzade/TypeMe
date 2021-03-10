import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useQuery } from "../customHooks/useQuery";
import { Icon24BrowserForward, Icon28AddSquareOutline, Icon16Cancel } from "@vkontakte/icons";

function SingleAlbum({ id, name, cover, images, AddPhotoHandler }) {
  const { username } = useParams();
  const history = useHistory();
  const [addSinglePhoto, setAddSinglePhoto] = useState();
  const query = useQuery();

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
            <button className="minor-btn-slimer">Download Album</button>
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
                  <div
                    key={id}
                    className={`image ${imgwidth < 200 ? "small-img" : ""}`}
                    style={{
                      backgroundImage: `url(${photo})`,
                    }}
                  ></div>
                );
              })
            : "There are no photos in this album"}
        </div>
      </div>
    </div>
  );
}

export default SingleAlbum;
