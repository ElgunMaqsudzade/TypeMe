import React, { useState, useRef } from "react";
import { useGlobalContext } from "./../components/context";
import useOutsideClick from "../components/customHooks/showHide";
import Textarea from "../components/textarea";
import { Link } from "react-router-dom";
import Emoji from "../components/emoji_picker";
import {
  Icon20CameraOutline,
  Icon20VideoOutline,
  Icon20MusicOutline,
  Icon28SettingsOutline,
  Icon20SmileOutline,
  Icon12Dropdown,
} from "@vkontakte/icons";

const CreatePost = () => {
  const { setCreateText, createText, user } = useGlobalContext();
  const [showSubmit, setShowSubmit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPostSecurity, setShowPostSecurity] = useState(false);
  const [showPostTopic, setShowPostTopic] = useState(false);
  let refCard = useRef(null);
  let refPostSettings = useRef(null);
  useOutsideClick(refCard, () => {
    if (!createText) {
      setShowSubmit(false);
      setShowPostSecurity(false);
      setShowPostTopic(false);
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
            </div>
            <div className="text-smile">
              {showSubmit && <Icon20SmileOutline />}
              <div className={`emoji-box`}>
                <Emoji />
              </div>
            </div>
          </div>
        </div>
        <div ref={refPostSettings} className={`post-settings ${showSubmit ? "expanded" : ""}`}>
          <div className="post-security">
            <button
              type="button"
              className="post-item"
              onClick={() => {
                setShowPostSecurity(!showPostSecurity);
                setShowPostTopic(false);
              }}
            >
              Public post
              <Icon12Dropdown />
            </button>
            {showPostSecurity && (
              <ul className="post-s-content post-content">
                <li className="content-item">Public Post</li>
                <li className="content-item">Friends Only</li>
              </ul>
            )}
          </div>
          <div className="post-topic">
            <button
              type="button"
              className="post-item"
              onClick={() => {
                setShowPostSecurity(false);
                setShowPostTopic(!showPostTopic);
              }}
            >
              Topic
              <Icon12Dropdown />
            </button>
            {showPostTopic && (
              <ul className="post-t-content post-content">
                <li className="content-item">adsa</li>
              </ul>
            )}
          </div>
        </div>
        <div className={`submit-part ${showSubmit ? "expanded" : ""}`}>
          <div className="create-medias">
            <Icon20CameraOutline className="create-m-photo create-m-icon" />
            <Icon20VideoOutline className="create-m-video create-m-icon" />
            <Icon20MusicOutline className="create-m-music create-m-icon" />
          </div>
          <div className="create-more">hey</div>
          <div className="create-settings" onMouseOver={() => setShowSettings()}>
            <Icon28SettingsOutline className="create-settings-icon create-m-icon" />
          </div>
          <div className="create-submit">
            <button type="submit" className="create-s-btn">
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
