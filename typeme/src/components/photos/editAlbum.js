import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { Link, useParams } from "react-router-dom";
import Camera from "../../images/camera_big.png";
import outside from "../customHooks/showHide";
import { Icon24BrowserForward, Icon24Gallery, Icon16Cancel } from "@vkontakte/icons";
import { FiPlusCircle } from "react-icons/fi";
import SlimPhoto from "./slimPhoto";
import CreateAlbum from "./newAlbum";
import Imagemodal from "../imagemodal";

function EditAlbum({
  id,
  name,
  cover,
  images,
  setAlbumImages,
  DeleteAlbum,
  albums,
  ChangeAlbumName,
  ChangeCover,
  setPhotosLoading,
}) {
  const { instance, user } = useGlobalContext();
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeletAlbumModal, setShowDeletAlbumModal] = useState(false);
  const [coverWidth, setCoverWidth] = useState();
  const [albumName, setAlbumName] = useState(name);
  const [showAlbumsModal, setShowAlbumsModal] = useState(false);
  const [showCoverImages, setShowCoverImages] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState();
  const [moveImage, setMoveImage] = useState({ imageids: [], albumid: null });
  const [checked, setChecked] = useState([]);
  const coverModal = React.useRef(null);
  const albumModal = React.useRef(null);
  const deleteModalRef = React.useRef(null);
  const deleteAlbumModalRef = React.useRef(null);

  outside(deleteModalRef, () => {
    if (showModal) {
      setShowModal(false);
    }
  });
  outside(deleteAlbumModalRef, () => {
    if (showDeletAlbumModal) {
      setShowAlbumsModal(false);
    }
  });
  outside(coverModal, () => {
    Cancel();
  });

  const Cancel = () => {
    if (showCoverImages) {
      setShowCoverImages(false);
    }
  };
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
      instance
        .put("/albom/changeimagealbom", moveImage)
        .then((res) => setPhotosLoading(true))
        .catch((res) => console.log(res));
    }
  }, [moveImage]);
  const DeleteMultiImage = () => {
    setLoading(true);
    instance
      .delete("/albom/deleteimagelist", { data: { imageids: checked, username: user.username } })
      .then((res) => {
        setPhotosLoading(true);
        setLoading(false);
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
        .then((res) => setPhotosLoading(true))
        .catch((res) => console.log(res));
    }
  }, [moveImage]);

  useEffect(() => {
    const img = new Image();
    img.src = cover;
    if (images.length === 0 || cover === null) {
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
            <button className="minor-btn-slimer" onClick={() => setShowDeletAlbumModal(true)}>
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
                  backgroundImage: `url(${images.length === 0 || cover === null ? Camera : cover})`,
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
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </div>
                  <div
                    className="option"
                    onClick={(e) => {
                      e.stopPropagation();
                      setChecked([]);
                    }}
                  >
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
            {images.length > 0
              ? images.map((image) => {
                  return (
                    <SlimPhoto
                      key={image.id}
                      {...image}
                      images={images}
                      ischecked={checked}
                      setImages={setAlbumImages}
                      setChecked={setChecked}
                      ChangeAlbum={ChangeAlbum}
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
      {showAlbumsModal && (
        <div className="modal-box">
          <div ref={albumModal} className="modal-holder albums-modal delete-modal">
            <div className="albums-top modal-top">
              Move the photo to an album To a new album
              <Icon16Cancel className="modal-top-icon" onClick={() => CancelAlbumModal()} />
            </div>
            {albums.filter((album) => album.id !== id).length > 0 ? (
              <div className="albums-body modal-body">
                {albums
                  .filter((album) => album.id !== id)
                  .map((album) => {
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
              <div className="main-btn-slimer" onClick={() => CancelAlbumModal()}>
                Close
              </div>
            </div>
          </div>
        </div>
      )}
      <Imagemodal images={images} />
      {showModal && (
        <div className="modal-box">
          <div ref={deleteModalRef} className="modal-holder delete-modal">
            <div className="modal-top">
              Warning
              <Icon16Cancel className="modal-top-icon" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              Are you sure you want to move these photos to Recycle Bin?
            </div>
            <div className="modal-footer">
              <button className="cancel-btn minor-btn-slim" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="main-btn-slim" onClick={() => DeleteMultiImage()}>
                {loading !== false ? <div className="lds-dual-ring slim"></div> : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeletAlbumModal && (
        <div className="modal-box">
          <div ref={deleteAlbumModalRef} className="modal-holder delete-modal">
            <div className="modal-top">
              Warning
              <Icon16Cancel
                className="modal-top-icon"
                onClick={() => setShowDeletAlbumModal(false)}
              />
            </div>
            <div className="modal-body">Are you sure you want to delete album?</div>
            <div className="modal-footer">
              <button
                className="cancel-btn minor-btn-slim"
                onClick={() => setShowDeletAlbumModal(false)}
              >
                Cancel
              </button>
              <button className="main-btn-slim" onClick={() => DeleteAlbum(id)}>
                {loading !== false ? <div className="lds-dual-ring slim"></div> : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreateAlbum && (
        <CreateAlbum show={showCreateAlbum} setshow={setShowCreateAlbum} reset={setPhotosLoading} />
      )}
    </div>
  );
}

export default EditAlbum;
