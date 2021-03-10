import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context";
import { Icon28AddSquareOutline, Icon16Cancel } from "@vkontakte/icons";
import outside from "../customHooks/showHide";
import "../../sass/_slimPhoto.scss";

function SlimPhoto({ id, photo, setImages, images }) {
  const { instance, user } = useGlobalContext();
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
        console.log(res);
        setLoading(false);
        setImages(images.filter((image) => image.id !== id));
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
      <div className="image-options">
        <Icon28AddSquareOutline className="image-option" />
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
