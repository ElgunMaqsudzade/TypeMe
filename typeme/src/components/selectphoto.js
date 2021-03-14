import React, { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "./context";
import Resizer from "react-image-file-resizer";
import {
  extractImageFileExtensionFromBase64,
  base64StringtoFile,
} from "./customHooks/ReuseableUtils";
import { Link, useParams } from "react-router-dom";
import "../sass/_selecetphoto.scss";
import Shadow from "../images/shadow.png";
import {
  Icon16Add,
  Icon16Cancel,
  Icon24CheckCircleOff,
  Icon24CheckCircleOn,
} from "@vkontakte/icons";

function Selectphoto({ albums, setShow, albumsLoading, uploadRef, UploadPhoto }) {
  const { user, instance } = useGlobalContext();
  const [images, setImages] = useState([]);
  const [checked, setChecked] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loadingUploadedFile, setLoadingUploadedFile] = useState(false);
  const photoRef = useRef(null);

  useEffect(() => {
    if (uploadedFile) {
      Resizer.imageFileResizer(
        uploadedFile,
        900,
        500,
        "JPEG",
        100,
        0,
        (res) => {
          setLoadingUploadedFile(true);
          const fileExtension = extractImageFileExtensionFromBase64(res);
          const filename = "UserPost_Image." + fileExtension;
          const newSendImage = base64StringtoFile(res, filename);
          let fdata = new FormData();
          fdata.append("photo", newSendImage);
          fdata.append("username", user.username);
          instance
            .put("/albom/saveimage", fdata)
            .then(({ data }) => {
              console.log(data);
              UploadPhoto([{ id: data.imageid, photo: res }]);
              setLoadingUploadedFile(false);
              setShow(false);
            })
            .catch((res) => {
              console.log(res);
            });
        },
        "base64",
        200,
        200
      );
    }
  }, [uploadedFile, user.username]);

  const PhotoHandler = (id) => {
    albums.map((album) => {
      if (album.id === id) {
        return setImages(album.images);
      }
    });
  };

  const Back = () => {
    setChecked([]);
    setImages([]);
  };

  return (
    <>
      <div className="modal-box">
        <div ref={uploadRef} className="modal-holder upload">
          {images.length === 0 ? (
            <div className="modal-top">
              Choose photo
              <Icon16Cancel className="modal-top-icon" onClick={() => setShow(false)} />
            </div>
          ) : (
            <div className="modal-top">
              Attach photo from the album
              <Icon16Cancel className="modal-top-icon" onClick={() => Back()} />
            </div>
          )}
          {albumsLoading ? (
            <div className="loading">
              <div className="lds-dual-ring"></div>
            </div>
          ) : (
            <div className="albums">
              <div className="modal-body">
                {loadingUploadedFile ? (
                  <div className="loading">
                    <div className="lds-dual-ring medium"></div>
                  </div>
                ) : (
                  <button
                    className="upload-local"
                    onClick={(e) => {
                      e.stopPropagation();
                      photoRef.current.click();
                    }}
                  >
                    <Icon16Add className="add-icon" />
                    Upload photo
                  </button>
                )}
                <input
                  type="file"
                  className="d-none"
                  ref={photoRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type.substr(0, 5) === "image") {
                      setUploadedFile(file);
                    } else {
                      setUploadedFile(null);
                    }
                  }}
                />
                {images.length === 0 ? (
                  <div className="albums">
                    {albums.length > 0 ? (
                      albums.map((album) => {
                        return (
                          <div
                            key={album.id}
                            style={{ backgroundImage: `url(${album.cover})` }}
                            className="album"
                            onClick={(e) => {
                              e.stopPropagation();
                              PhotoHandler(album.id);
                            }}
                          >
                            <div
                              style={{
                                backgroundImage: `url(${Shadow})`,
                              }}
                              className="albom-title-wrap"
                            >
                              <div className="album-name">{album.name}</div>
                              <div className="image-count">{album.images.length}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty">You have no photos</div>
                    )}
                  </div>
                ) : (
                  <div className="images">
                    {images.map((image) => {
                      const { id, photo } = image;
                      return (
                        <div
                          key={id}
                          className="image"
                          style={{ backgroundImage: `url(${photo})` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            UploadPhoto([{ id, photo }]);
                            setShow(false);
                          }}
                        >
                          {checked.includes(id) ? (
                            <Icon24CheckCircleOn
                              className={`check-icon on`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setChecked((prev) => {
                                  return prev.filter((check) => check !== id);
                                });
                              }}
                            />
                          ) : (
                            <Icon24CheckCircleOff
                              className={`check-icon`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (checked.length === 0) {
                                  setChecked([...checked, id]);
                                } else if (checked.length > 0) {
                                  checked.map((num) => {
                                    if (num !== id) {
                                      return setChecked([...checked, id]);
                                    }
                                  });
                                }
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {checked.length > 0 && (
                  <div className="footer-side upload-footer">
                    <button
                      className="minor-btn-slimer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChecked([]);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="main-btn-slimer"
                      onClick={(e) => {
                        let arr = [];
                        e.stopPropagation();
                        images.map((image) => {
                          checked.map((id) => {
                            if (id === image.id) {
                              arr.push(image);
                            }
                          });
                        });
                        UploadPhoto(arr);
                        setShow(false);
                      }}
                    >
                      Attach {checked.length} photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Selectphoto;
