import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "../customHooks/useQuery";
import Resizer from "react-image-file-resizer";
import SlimPhoto from "./slimPhoto";
import {
  extractImageFileExtensionFromBase64,
  base64StringtoFile,
} from "../customHooks/ReuseableUtils";
import { Icon24BrowserForward } from "@vkontakte/icons";
import Imagemodal from "../imagemodal";

function AddPhoto({
  addPhoto,
  setAddPhoto,
  albums,
  setImageLoading,
  imageLoading,
  setPhotoAdded,
  photoAdded,
}) {
  const { instance } = useGlobalContext();
  const { username } = useParams();
  const query = useQuery();
  const [preview, setPreview] = useState([]);
  const photoInp = React.useRef(null);

  useEffect(() => {
    if (addPhoto) {
      Resizer.imageFileResizer(
        addPhoto,
        900,
        500,
        "JPEG",
        100,
        0,
        (res) => {
          setImageLoading(null);
          const fileExtension = extractImageFileExtensionFromBase64(res);
          const filename = "UserAlbum_Image." + fileExtension;
          const newSendImage = base64StringtoFile(res, filename);
          let fdata = new FormData();
          fdata.append("photo", newSendImage);
          fdata.append("username", username);
          if (query.get("album")) {
            fdata.append("albumid", Number(query.get("album")));
          }
          instance
            .put("/albom/saveimage", fdata)
            .then(({ data }) => {
              setPreview((prev) => {
                return [...prev, { id: data.imageid, photo: res }];
              });
              setImageLoading(true);
            })
            .catch((res) => {
              console.log(res);
            });

          setAddPhoto(null);
          setPhotoAdded(false);
        },
        "base64",
        200,
        200
      );
    }
  }, [addPhoto, photoAdded]);

  return (
    <>
      <div className="images">
        <div className="add-photos mCard">
          <div className="topside">
            <div className="breadcrumps">
              <Link to={`/photos/${username}`} className="breadcrump link">
                My photos
              </Link>
              {query.get("album") && (
                <>
                  <div className="breadcrump">
                    <Icon24BrowserForward className="between-icon" />
                  </div>
                  <Link
                    to={`/photos/${username}?album=${query.get("album")}`}
                    className="breadcrump link"
                  >
                    {albums.map((album) => {
                      if (album.id === Number(query.get("album"))) {
                        return album.name;
                      }
                    })}
                  </Link>
                </>
              )}
              <div className="breadcrump">
                <Icon24BrowserForward className="between-icon" />
              </div>
              <div className="breadcrump">Add photos</div>
            </div>
            <div className="buttons">
              <button
                className="main-btn-slimer add-photo-btn"
                onClick={(e) => {
                  if (imageLoading === false) {
                    photoInp.current.click();
                  }
                }}
              >
                {imageLoading !== false ? <div className="lds-dual-ring slim"></div> : "Add photos"}
              </button>
            </div>
          </div>
          <div className={`image-box ${preview.length === 0 ? "empty" : ""}`}>
            {preview.length > 0
              ? preview.map((image) => {
                  return (
                    <SlimPhoto key={image.id} {...image} setImages={setPreview} images={preview} />
                  );
                })
              : "You didn't add any photos"}
          </div>
          {query.get("album") === "" && (
            <div className="footer-side">
              <button className="main-btn-slim">Post to my wall</button>
              <button className="minor-btn-slim">Add to album</button>
            </div>
          )}
        </div>
      </div>
      <Imagemodal images={preview} />
      <input
        ref={photoInp}
        type="file"
        className="adding-photo d-none"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && file.type.substr(0, 5) === "image") {
            setAddPhoto(file);
          } else {
            setAddPhoto(null);
          }
        }}
      />
    </>
  );
}

export default AddPhoto;
