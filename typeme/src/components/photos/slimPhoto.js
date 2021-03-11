import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import {
  Icon28AddSquareOutline,
  Icon16Cancel,
  Icon24CheckCircleOff,
  Icon24CheckCircleOn,
} from "@vkontakte/icons";
import { useQuery } from "../customHooks/useQuery";
import outside from "../customHooks/showHide";
import "../../sass/_slimPhoto.scss";

function SlimPhoto({ id, photo, setImages, images, ischecked, setChecked, ChangeAlbum }) {
  const { instance, user } = useGlobalContext();
  const query = useQuery();
  const [imgwidth, setImgwidth] = useState();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const deleteModalRef = React.useRef(null);
  useEffect(() => {
    const img = new Image();
    img.src = photo;
    img.onload = function () {
      setImgwidth(img.width);
    };
  }, [photo]);

  const DeleteImage = () => {
    setLoading(true);
    instance
      .delete("/albom/deleteimage", { data: { imageid: id, username: user.username } })
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

  outside(deleteModalRef, () => {
    Cancel();
  });

  const Cancel = () => {
    if (showModal) {
      setShowModal(false);
    }
  };

  return (
    <div
      className={`image ${imgwidth < 200 ? "small-img" : ""}`}
      style={{
        backgroundImage: `url(${photo})`,
      }}
    >
      {(query.get("act") === "edit" || query.get("act") === "recycle") &&
        (ischecked.includes(id) ? (
          <Icon24CheckCircleOn
            className={`check-icon on`}
            onClick={() =>
              setChecked((prev) => {
                return prev.filter((check) => check !== id);
              })
            }
          />
        ) : (
          <Icon24CheckCircleOff
            className={`check-icon`}
            onClick={() => {
              if (ischecked.length === 0) {
                setChecked([...ischecked, id]);
              } else if (ischecked.length > 0) {
                ischecked.map((num) => {
                  if (num !== id) {
                    return setChecked([...ischecked, id]);
                  }
                });
              }
            }}
          />
        ))}
      <div className="image-options">
        <Icon28AddSquareOutline className="image-option" onClick={() => ChangeAlbum(id)} />
        <Icon16Cancel
          className="image-option"
          onClick={() => {
            setShowModal(true);
          }}
        />
      </div>
      {showModal && (
        <div className="modal-box">
          <div ref={deleteModalRef} className="modal-holder delete-modal">
            <div className="modal-top">
              Warning
              <Icon16Cancel className="modal-top-icon" onClick={() => Cancel()} />
            </div>
            <div className="modal-body">
              Are you sure you want to move this photo to Recycle Bin?
            </div>
            <div className="modal-footer">
              <button className="cancel-btn minor-btn-slim" onClick={() => Cancel()}>
                Cancel
              </button>
              <button className="main-btn-slim" onClick={() => DeleteImage()}>
                {loading !== false ? <div className="lds-dual-ring slim"></div> : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SlimPhoto;
