import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { useParams, Link, useHistory } from "react-router-dom";
import { useQuery } from "../components/customHooks/useQuery";
import { Icon24PenOutline } from "@vkontakte/icons";
import Album from "../components/photos/singleAlbum";
import EditAlbum from "../components/photos/editAlbum";
import AddPhoto from "../components/photos/addPhoto";
import CreateAlbum from "../components/photos/newAlbum";
import Camera from "../images/camera_big.png";
import Shadow from "../images/shadow.png";
function Photos() {
  const { instance } = useGlobalContext();
  const { username } = useParams();
  const history = useHistory();
  const query = useQuery();
  const [photosLoading, setPhotosLoading] = useState(true);
  const [addPhoto, setAddPhoto] = useState();
  const [photoAdded, setPhotoAdded] = useState(false);
  const [albumId, setAlbumId] = useState("");
  const [albums, setAlbums] = useState([]);
  const [images, setImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [showCreateAlbum, setShowCreateAlbum] = useState();
  const photoInp = React.useRef(null);

  useEffect(() => {
    if (addPhoto) {
      history.push(`/photos/${username}?album=${albumId}&act=addphoto`);
    }
  }, [addPhoto, albumId]);

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
    if (query.get("album")) {
      setAlbumId(Number(query.get("album")));
    } else {
      setAlbumId("");
    }
  }, [username, query.get("album")]);

  useEffect(() => {
    if (photosLoading || imageLoading) {
      instance
        .post("albom/getuseralboms", { username: username })
        .then(({ data }) => {
          setAlbums(data);
          setImageLoading(false);
          setPhotosLoading(false);
        })
        .catch((res) => console.log(res));
    }
  }, [photosLoading, imageLoading]);

  const AddPhotoHandler = (albumId) => {
    photoInp.current.click();
    if (albumId) {
      setAlbumId(albumId);
    }
  };
  const setAlbumImages = (data) => {
    setAlbums(
      albums.map((album) => {
        if (album.id === Number(query.get("album"))) {
          return { ...album, images: data };
        }
        return { ...album };
      })
    );
  };

  const DeleteAlbum = (id) => {
    instance
      .delete("/albom/deletealbom", { data: { albumid: id } })
      .then(() => {
        history.push(`/photos/${username}`);
        setPhotosLoading(true);
      })
      .catch((res) => console.log(res));
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
  } else if (query.get("act") === "addphoto") {
    return (
      <AddPhoto
        setAddPhoto={setAddPhoto}
        photoAdded={photoAdded}
        setPhotoAdded={setPhotoAdded}
        addPhoto={addPhoto}
        albums={albums}
        setImageLoading={setImageLoading}
        imageLoading={imageLoading}
      />
    );
  } else if (query.get("act") === "edit") {
    return albums.map((album) => {
      let albumId = query.get("album");
      if (album.id === Number(albumId)) {
        return (
          <EditAlbum
            key={album.id}
            setAlbumImages={setAlbumImages}
            {...album}
            DeleteAlbum={DeleteAlbum}
          />
        );
      }
    });
  } else if (query.get("album") && !query.get("act")) {
    let albumId = query.get("album");
    return (
      <>
        {albums.map((album) => {
          if (album.id === Number(albumId)) {
            return <Album key={album.id} {...album} AddPhotoHandler={AddPhotoHandler} />;
          }
        })}
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
  } else {
    return (
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
                <button className="main-btn-slimer" onClick={() => AddPhotoHandler()}>
                  Add photos
                </button>
              </div>
            </div>
            <div className={`body-content ${albums.length > 0 ? "" : "empty"}`}>
              {albums.length > 0
                ? albums.map((album) => {
                    const { id, name, images, cover } = album;
                    return (
                      <Link
                        to={`/photos/${username}?album=${id}`}
                        key={id}
                        style={{
                          backgroundImage: `url(${images.length === 0 ? Camera : cover})`,
                        }}
                        className={`album ${images.length === 0 ? "no-cover" : ""}`}
                      >
                        <div className="edit-shortcut">
                          <Icon24PenOutline
                            className="edit-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              history.push(`/photos/${username}?album=${id}&act=edit`);
                            }}
                          />
                        </div>
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
              setPhotoAdded(true);
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
