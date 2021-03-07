import React, { useState, useRef } from "react";
import { useGlobalContext } from "./../components/context";
import useOutsideClick from "../components/customHooks/showHide";
import Textarea from "../components/textarea";
import { Link } from "react-router-dom";
import Emoji from "../components/emoji_picker";
import {
  Icon20CameraOutline,
  Icon28SettingsOutline,
  Icon20SmileOutline,
  Icon12Dropdown,
} from "@vkontakte/icons";

const CreatePost = () => {
  const { setCreateText, createText, user } = useGlobalContext();
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  let refCard = useRef(null);
  const emojiRef = useRef();

  useOutsideClick(refCard, () => {
    if (!createText) {
      setShowSubmit(false);
      setShowEmoji(false);
    }
  });
  useOutsideClick(emojiRef, () => {
    if (showEmoji) {
      setShowEmoji(false);
    }
  });

  return (
    <div className="create mCard" ref={refCard}>
      <form>
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
              />
              {!showSubmit && (
                <div className="short-adds closed">
                  <Icon20CameraOutline className="photo" />
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
                  <Emoji />
                </div>
              )}
            </div>
          </div>
        </div>
        {showSubmit && (
          <div className="create-footer">
            <div className="footer-options">
              <div className="short-adds">
                <Icon20CameraOutline className="photo" />
              </div>
            </div>
            <button className="main-btn-slim">Post</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
