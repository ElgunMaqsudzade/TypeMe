import React, { useState, createRef } from "react";
import { useGlobalContext } from "../context";
import outside from "../customHooks/showHide";
import { Icon16Cancel } from "@vkontakte/icons";
import "../../sass/_deleteModal.scss";

function DeletePhoto({ deleteModal, setDeleteModal }) {
  const { instance, user, RefreshUser } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const deleteModalRef = createRef();

  outside(deleteModalRef, () => {
    Cancel();
  });

  const Cancel = () => {
    if (deleteModal) {
      setDeleteModal(false);
    }
  };

  const DeleteTumbnail = () => {
    setLoading(true);
    instance
      .delete("/profile/deleteprofileimage", { data: { username: user.username } })
      .then((res) => {
        RefreshUser();
        setDeleteModal(false);
        setLoading(false);
      })
      .catch((res) => console.log(res));
  };
  return (
    <>
      <div className="modal-box">
        <div ref={deleteModalRef} className="modal-holder delete-modal">
          <div className="modal-top">
            Warning
            <Icon16Cancel className="modal-top-icon" onClick={() => Cancel()} />
          </div>
          <div className="modal-body">Are you sure you want to delete this photo?</div>
          <div className="modal-footer">
            <button className="cancel-btn minor-btn-slim" onClick={() => Cancel()}>
              Cancel
            </button>
            <button className="submit-btn main-btn-slim" onClick={() => DeleteTumbnail()}>
              {loading ? (
                <div className="lds-ellipsis slim">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeletePhoto;
