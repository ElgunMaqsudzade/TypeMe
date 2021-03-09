import React, { createRef, useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "../components/customHooks/useQuery";
import { Icon24BrowserForward, Icon28AddSquareOutline, Icon16Cancel } from "@vkontakte/icons";
import CreateAlbum from "../components/photos/newAlbum";
import Camera from "../images/camera_big.png";
import Shadow from "../images/shadow.png";
import Resizer from "react-image-file-resizer";
function Photos() {
  const { instance } = useGlobalContext();
  const { username } = useParams();
  const query = useQuery();
  const [photosLoading, setPhotosLoading] = useState(true);
  const [albums, setAlbums] = useState([]);
  const [images, setImages] = useState([]);
  const [addPhoto, setAddPhoto] = useState();
  const [showCreateAlbum, setShowCreateAlbum] = useState();
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
          setPreview((prev) => {
            return [...prev, { upload: true, image: res, id: new Date().getTime().toString() }];
          });
          setAddPhoto(null);
        },
        "base64",
        200,
        200
      );
    }
  }, [addPhoto]);

  useEffect(() => {
    if (albums.length > 0) {
      let photos = [];
      albums.map((album) =>
        album.images.map((images) => {
          return photos.push(images);
        })
      );
      setImages(photos);
    }
  }, [albums]);

  useEffect(() => {
    console.log(images);
  }, [images]);

  useEffect(() => {
    if (photosLoading) {
      instance
        .post("albom/getuseralboms", { username: username })
        .then(({ data }) => {
          setAlbums(data);
          setPhotosLoading(false);
        })
        .catch((res) => console.log(res));
    }
  }, [photosLoading]);

  const DeleteImage = (id) => {
    setPreview(
      preview.map((image) => {
        if (image.id === id) {
          return { ...image, upload: false };
        }
        return { ...image };
      })
    );
  };
  const RestoreImage = (id) => {
    setPreview(
      preview.map((image) => {
        if (image.id === id) {
          return { ...image, upload: true };
        }
        return { ...image };
      })
    );
  };

  if (photosLoading) {
    return (
      <>
        <div className="images">
          <div style={{ padding: "30px" }} className="mCard d-flex justify-content-center">
            <div className="lds-dual-ring"></div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {preview.length > 0 ? (
          <>
            <div className="images">
              <div className="add-photos mCard">
                <div className="topside">
                  <ul className="breadcrumps">
                    <li className="breadcrump" onClick={(e) => setPreview([])}>
                      My photos
                    </li>
                    <li className="breadcrump">
                      <Icon24BrowserForward className="between-icon" />
                    </li>
                    <li className="breadcrump">Add photos</li>
                  </ul>
                  <div className="buttons">
                    <button className="main-btn-slimer" onClick={(e) => photoInp.current.click()}>
                      Add photos
                    </button>
                  </div>
                </div>
                <div className="image-box">
                  {preview.map((obj) => {
                    return (
                      <div
                        key={obj.id}
                        className="added-image"
                        style={{
                          backgroundImage: `url(${obj.image})`,
                        }}
                      >
                        {!obj.upload && (
                          <div className="image-restore">
                            This photo has been deleted.
                            <button className="restore" onClick={() => RestoreImage(obj.id)}>
                              Restore
                            </button>
                          </div>
                        )}
                        <div className="image-options">
                          <Icon28AddSquareOutline className="image-option" />
                          <Icon16Cancel
                            className="image-option"
                            onClick={() => DeleteImage(obj.id)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="footer-side">
                  <button className="main-btn-slim">Post to my wall</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="images">
              <div className="albums-box mCard">
                <div className="topside">
                  <div className="name-box">
                    My albums <span className="count">{albums.length > 0 && albums.length}</span>
                  </div>
                  <div className="buttons">
                    <button className="minor-btn-slimer" onClick={() => setShowCreateAlbum(true)}>
                      New album
                    </button>
                    <button className="main-btn-slimer" onClick={(e) => photoInp.current.click()}>
                      Add photos
                    </button>
                  </div>
                </div>
                <div className={`body-content ${albums.length > 0 ? "" : "no-album"}`}>
                  {albums.length > 0
                    ? albums.map((album) => {
                        const { id, name, images } = album;
                        return (
                          <Link
                            to={`/photos/${username}?album=${id}`}
                            key={id}
                            style={{
                              backgroundImage: `url(${
                                images.length === 0 ? Camera : images[0].photo
                              })`,
                            }}
                            className={`album ${images.length === 0 ? "no-cover" : ""}`}
                          >
                            <div
                              style={{
                                backgroundImage: `url(${images.length !== 0 && Shadow})`,
                              }}
                              className="albom-title-wrap"
                            >
                              <div
                                className={`album-name ${
                                  images.length === 0 ? "empty-album-name" : ""
                                }`}
                              >
                                {name}
                              </div>
                              <div className="image-count">{images.length}</div>
                            </div>
                            <div className="album-edit"></div>
                          </Link>
                        );
                      })
                    : "You can store an unlimited number of photos on your page."}
                </div>
              </div>
              {images.length > 0 && (
                <div className="photos-box mCard">
                  <div className="topside">
                    <div className="name-box">
                      My photos <span className="count">{images.length}</span>
                    </div>
                  </div>
                  <div className="photos-body">
                    {images.map((image) => {
                      const { id, photo } = image;
                      return (
                        <div
                          key={id}
                          className="image"
                          style={{
                            backgroundImage: `url(${photo})`,
                          }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {showCreateAlbum && (
          <CreateAlbum
            show={showCreateAlbum}
            setshow={setShowCreateAlbum}
            reset={setPhotosLoading}
          />
        )}
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
}

export default Photos;
