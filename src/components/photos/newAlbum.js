import React, { useRef, useState } from "react";
import { useGlobalContext } from "../context";
import { useParams } from "react-router-dom";
import "../../sass/_newalbum.scss";
import { Icon16Cancel } from "@vkontakte/icons";
import outside from "../customHooks/showHide";

function NewAlbum({ show, setshow, reset }) {
  const { instance } = useGlobalContext();
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const modalRef = useRef();

  outside(modalRef, () => {
    Cancel();
  });

  const Cancel = () => {
    if (show) {
      setshow(false);
    }
  };

  const CreateAlbum = () => {
    if (albumName.length > 0) {
      instance
        .put("albom/adduseralbom", { albumname: albumName, username: username })
        .then((res) => {
          setLoading(false);
          reset(true);
          setshow(false);
        });
    }
  };

  return (
    <>
      <div className="modal-box">
        <div className="new-album" ref={modalRef}>
          <div className="modal-top">
            New album
            <Icon16Cancel className="modal-top-icon" onClick={() => Cancel()} />
          </div>
          <div className="modal-body">
            <label htmlFor="nameInp">Album title</label>
            <input
              value={albumName}
              type="text"
              id="nameInp"
              className="album-name"
              onChange={(e) => setAlbumName(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="cancel-btn minor-btn-slim" onClick={() => Cancel()}>
              Cancel
            </button>
            <button className="submit-btn main-btn-slim" onClick={() => CreateAlbum()}>
              {loading ? (
                <div className="lds-ellipsis slim">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                "Create album"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewAlbum;
