import React, { useState, useRef, useEffect } from "react";
import { useGlobalContext } from "./../components/context";
import useOutsideClick from "../components/customHooks/showHide";
import Textarea from "../components/textarea";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import SelectPhoto from "./selectphoto";
import Emoji from "../components/emoji_picker";
import { Icon20CameraOutline, Icon20SmileOutline, Icon16Cancel } from "@vkontakte/icons";
import Imagemodal from "./imagemodal";

const CreatePost = () => {
  const { user, instance } = useGlobalContext();
  const { username } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [createText, setCreateText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [postImages, setPostImages] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [albumsLoading, setAlbumsLoading] = useState([]);
  const uploadRef = useRef(null);

  let refCard = useRef(null);
  const emojiRef = useRef();

  useOutsideClick(refCard, () => {
    if (!createText && postImages.length === 0) {
      setShowSubmit(false);
      setShowEmoji(false);
    }
  });
  useOutsideClick(emojiRef, () => {
    if (showEmoji) {
      setShowEmoji(false);
    }
  });
  useOutsideClick(uploadRef, () => {
    if (showUpload) {
      setShowUpload(false);
    }
  });

  useEffect(() => {
    if (postImages.length > 0) {
      setShowSubmit(true);
    }
  }, [postImages]);

  useEffect(() => {
    setAlbumsLoading(true);
    if (user.username) {
      instance
        .post("albom/getuseralboms", { username: user.username })
        .then(({ data }) => {
          setAlbums(data.filter((album) => album.images.length !== 0));
          let array = [];
          data
            .filter((album) => album.images.length !== 0)
            .map((album) => {
              album.images.map((image) => {
                return array.push(image);
              });
            });
          setAllImages(array);
          setAlbumsLoading(false);
        })
        .catch((res) => console.log(res));
    }
  }, [showUpload, user.username]);

  const SubmitHandler = () => {
    instance
      .put("/post/createpost", {
        username: user.username,
        imageids: Object.keys(postImages).map((e) => {
          return postImages[e].id;
        }),
        description: createText,
      })
      .then((res) => {
        setPostImages([]);
        setCreateText("");
      })
      .catch((res) => console.log(res));
  };

  const UploadPhoto = (images) => {
    let isExist = false;
    if (postImages.length > 0) {
      postImages.map((postimage) => {
        images.map((image) => {
          if (postimage.id === image.id) {
            return (isExist = true);
          }
        });
      });
      if (!isExist) {
        setPostImages([...postImages, ...images]);
      }
    } else {
      setPostImages([...postImages, ...images]);
    }
  };

  return (
    <>
      <div className="create mCard" ref={refCard}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (postImages.length > 0 || createText) {
              SubmitHandler();
            }
          }}
        >
          <div className="create-main">
            <div className="profile">
              <Link to={`/user/${user.username}`}>
                <div className="profile-link">
                  <img src={user.image} alt="" />
                </div>
              </Link>
            </div>
            <div className="create-body">
              <div className="create-text-box">
                <Textarea
                  setShowSubmit={setShowSubmit}
                  showSubmit={showSubmit}
                  placeholder={"What's new?"}
                  text={createText}
                  setText={setCreateText}
                />
                {!showSubmit && (
                  <div className="short-adds closed">
                    <Icon20CameraOutline className="photo" onClick={() => setShowUpload(true)} />
                  </div>
                )}
              </div>
              <div className="text-smile">
                {showSubmit && (
                  <Icon20SmileOutline
                    className="emoji-toggler"
                    onClick={() => setShowEmoji(!showEmoji)}
                  />
                )}
                {showEmoji && (
                  <div ref={emojiRef} className={`emoji-box`}>
                    <Emoji text={createText} setText={setCreateText} />
                  </div>
                )}
              </div>
            </div>
          </div>
          {postImages.length > 0 && (
            <>
              <div className={`postimages ${postImages.length === 1 ? "single-row" : ""}`}>
                {postImages.map((image) => {
                  const { id, photo } = image;
                  return (
                    <div
                      key={id}
                      className="image"
                      style={{ backgroundImage: `url(${photo})` }}
                      onClick={() => history.push(`${location.pathname}?image=${id}`)}
                    >
                      <Icon16Cancel
                        className="exit-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPostImages(postImages.filter((image) => image.id !== id));
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {showSubmit && (
            <div className="create-footer">
              <div className="footer-options">
                <div className="short-adds">
                  <Icon20CameraOutline className="photo" onClick={() => setShowUpload(true)} />
                </div>
              </div>
              <button type="submit" className="main-btn-slim">
                Post
              </button>
            </div>
          )}
        </form>
      </div>
      <Imagemodal images={allImages} />
      {showUpload && (
        <SelectPhoto
          uploadRef={uploadRef}
          albums={albums}
          setShow={setShowUpload}
          UploadPhoto={UploadPhoto}
          albumsLoading={albumsLoading}
        />
      )}
    </>
  );
};

export default CreatePost;
