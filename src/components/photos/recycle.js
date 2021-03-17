import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "../customHooks/useQuery";
import { FiPlusCircle } from "react-icons/fi";
import outside from "../customHooks/showHide";
import {
  Icon24BrowserForward,
  Icon16Cancel,
  Icon20DeleteOutline,
  Icon24CheckCircleOff,
  Icon24CheckCircleOn,
  Icon28AddSquareOutline,
} from "@vkontakte/icons";
import "../../sass/_recycle.scss";
import Camera from "../../images/camera_big.png";
import CreateAlbum from "./newAlbum";
import Imagemodal from "../imagemodal";

function Recycle({ setPhotosLoading, albums, ExitImage }) {
  const { instance, user } = useGlobalContext();
  const query = useQuery();
  const location = useLocation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [checked, setChecked] = useState([]);
  const [images, setImages] = useState([]);
  const [recycleLoading, setRecycleLoading] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState();
  const [singleId, setSingleId] = useState();
  const [showAlbumsModal, setShowAlbumsModal] = useState(false);
  const [moveImage, setMoveImage] = useState({ imageids: [], albumid: null });
  const albumModal = React.useRef(null);
  const deleteAllModalRef = React.useRef(null);
  const deleteModalRef = React.useRef(null);

  outside(deleteModalRef, () => {
    Cancel();
  });

  const Cancel = () => {
    if (showModal) {
      setShowModal(false);
    }
  };

  const DeleteImage = (id) => {
    setLoading(true);
    instance
      .delete("/albom/fromrecyclebin", { data: { imageids: [id] } })
      .then((res) => {
        setLoading(false);
        setImages(images.filter((image) => image.id !== id));
        setChecked((prev) => {
          return prev.filter((c) => c !== id);
        });
        Cancel();
      })
      .catch((res) => console.log(res));
  };

  outside(deleteAllModalRef, () => {
    if (showDeleteAllModal) {
      setShowDeleteAllModal(false);
    }
  });

  useEffect(() => {
    setRecycleLoading(true);
    if (user.username) {
      instance
        .post("/albom/getdeletedimages", { username: user.username })
        .then(({ data }) => {
          setRecycleLoading(false);
          setImages(data.images);
        })
        .catch((res) => console.log(res));
    }
  }, [user]);

  outside(albumModal, () => {
    CancelAlbumModal();
  });

  const CancelAlbumModal = () => {
    if (showAlbumsModal) {
      setShowAlbumsModal(false);
      setMoveImage({ imageids: [], albumid: null });
    }
  };

  const ChangeMultiImage = () => {
    setMoveImage({ imageids: checked });
    setShowAlbumsModal(true);
  };
  useEffect(() => {
    if (moveImage.imageids.length > 1 && moveImage.albumid) {
      console.log(moveImage);
      instance
        .put("/albom/changeimagealbom", moveImage)
        .then((res) => setPhotosLoading(true))
        .catch((res) => console.log(res));
    }
  }, [moveImage]);
  const DeleteMultiImage = () => {
    setLoading(true);
    instance
      .delete("/albom/fromrecyclebin", { data: { imageids: checked } })
      .then((res) => {
        setPhotosLoading(true);
        setLoading(true);
      })
      .catch((res) => console.log(res));
  };

  const ChangeAlbum = (id) => {
    setMoveImage({ imageids: [id] });
    setShowAlbumsModal(true);
  };
  useEffect(() => {
    if (moveImage.imageids.length === 1 && moveImage.albumid) {
      instance
        .put("/albom/changeimagealbom", moveImage)
        .then((res) => {
          console.log(res);
          setPhotosLoading(true);
        })
        .catch((res) => console.log(res));
    }
  }, [moveImage]);
  return (
    <>
      <div className="recycle mCard">
        <div className="topside">
          <div className="breadcrumps">
            <Link className="breadcrump link" to={`/photos/${user.username}`}>
              My photos
            </Link>
            <div className="breadcrump">
              <Icon24BrowserForward className="between-icon" />
            </div>
            <div className="breadcrump">Recycle Bin</div>
          </div>
        </div>
        <div className="footer-lg-side">
          <div className="footer-title">
            <div className="count">
              {checked.length > 0 ? (
                <>
                  <b>{checked.length}</b> of <b>{images.length}</b> photos selected
                </>
              ) : (
                <>
                  <b>{images.length}</b> photos
                </>
              )}
            </div>
            <div className="options">
              {checked.length > 0 ? (
                <>
                  <div
                    className="option"
                    onClick={(e) => {
                      e.stopPropagation();
                      ChangeMultiImage();
                    }}
                  >
                    Move to album
                  </div>
                  <div
                    className="option"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteAllModal(true);
                    }}
                  >
                    Delete
                  </div>
                  <div className="option" onClick={() => setChecked([])}>
                    Remove selection
                  </div>
                </>
              ) : (
                <div className="option" onClick={() => setChecked(images.map((image) => image.id))}>
                  Select all photos
                </div>
              )}
            </div>
          </div>
          <div className={`images-box-mini ${images.length === 0 ? "empty" : ""}`}>
            {recycleLoading ? (
              <div className="lds-dual-ring"></div>
            ) : (
              <>
                {images.length > 0 ? (
                  images.map((image) => {
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
                        onClick={() => {
                          history.push(`${location.pathname + location.search}&image=${id}`);
                        }}
                      >
                        {(query.get("act") === "edit" || query.get("act") === "recycle") &&
                          (checked.includes(id) ? (
                            <Icon24CheckCircleOn
                              className={`check-icon on`}
                              onClick={(e) => {
                                e.preventDefault();
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
                                e.preventDefault();
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
                          ))}
                        <div className="image-options">
                          <Icon28AddSquareOutline
                            className="image-option"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              ChangeAlbum(id);
                            }}
                          />
                          <Icon16Cancel
                            className="image-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setSingleId(id);
                              setShowModal(true);
                            }}
                          />
                        </div>
                        {showModal && (
                          <div className="modal-box">
                            <div ref={deleteModalRef} className="modal-holder delete-modal">
                              <div className="modal-top">
                                Warning
                                <Icon16Cancel
                                  className="modal-top-icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    Cancel();
                                  }}
                                />
                              </div>
                              <div className="modal-body">
                                Are you sure you want to move this photo to Recycle Bin?
                              </div>
                              <div className="modal-footer">
                                <button
                                  className="cancel-btn minor-btn-slim"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    Cancel();
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="main-btn-slim"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    DeleteImage(singleId);
                                  }}
                                >
                                  {loading !== false ? (
                                    <div className="lds-dual-ring slim"></div>
                                  ) : (
                                    "Continue"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-text">
                    <Icon20DeleteOutline className="empty-icon" />
                    There are no photos in "Recycle Bin"
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Imagemodal images={images} />
        {showAlbumsModal && (
          <div className="modal-box">
            <div ref={albumModal} className="modal-holder albums-modal delete-modal">
              <div className="albums-top modal-top">
                Move the photo to an album To a new album
                <Icon16Cancel
                  className="modal-top-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    CancelAlbumModal();
                  }}
                />
              </div>
              {albums.length > 0 ? (
                <div className="albums-body modal-body">
                  {albums.map((album) => {
                    return (
                      <div
                        key={album.id}
                        className={`albums-image ${album.cover === null ? "small-image" : ""}`}
                        style={{
                          backgroundImage: `url(${album.cover === null ? Camera : album.cover})`,
                        }}
                      >
                        <div
                          className="icon-holder"
                          onClick={() => {
                            setMoveImage({ ...moveImage, albumid: album.id });
                            setShowAlbumsModal(false);
                          }}
                        >
                          <FiPlusCircle className="move-icon" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty flex-column">
                  <p>There are no photo albums yet.</p>
                  <button
                    className="main-btn-slimer"
                    onClick={() => {
                      setShowCreateAlbum(true);
                      setShowAlbumsModal(false);
                    }}
                  >
                    To a new album
                  </button>
                </div>
              )}

              <div className="footer-side justify-content-end">
                <div
                  className="main-btn-slimer"
                  onClick={(e) => {
                    e.stopPropagation();
                    CancelAlbumModal();
                  }}
                >
                  Close
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteAllModal && (
          <div className="modal-box">
            <div ref={deleteAllModalRef} className="modal-holder delete-modal">
              <div className="modal-top">
                Warning
                <Icon16Cancel
                  className="modal-top-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteAllModal(false);
                  }}
                />
              </div>
              <div className="modal-body">
                Are you sure you want to delete permanently these photos?
              </div>
              <div className="modal-footer">
                <button
                  className="cancel-btn minor-btn-slim"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteAllModal(false);
                  }}
                >
                  Cancel
                </button>
                <button className="main-btn-slim" onClick={() => DeleteMultiImage()}>
                  {loading !== false ? <div className="lds-dual-ring slim"></div> : "Continue"}
                </button>
              </div>
            </div>
          </div>
        )}
        {showCreateAlbum && (
          <CreateAlbum
            show={showCreateAlbum}
            setshow={setShowCreateAlbum}
            reset={setPhotosLoading}
          />
        )}
      </div>
    </>
  );
}

export default Recycle;
