import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Icon24Like, Icon20SmileOutline, Icon24Send } from "@vkontakte/icons";
import { useGlobalContext } from "./context";
import Emoji from "../components/emoji_picker";
import Textarea from "./textarea";

function CommentReplies({
  description,
  id,
  likes,
  parentid,
  replyid,
  commenter,
  setChildCommentsCount,
  childCommentsCount,
  postid,
  childComments,
  parentfullname,
  parentusername,
}) {
  const { user, instance } = useGlobalContext();
  const { image, name, surname, username } = commenter;
  const [replytoinfo, setReplyToInfo] = useState({ username: null, fullname: null });
  const [repliesLikesCount, setRepliesLikesCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyInp, setShowReplyInp] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [createReplyComment, setCreateReplyComment] = useState("");
  const emojiRef = useRef(null);

  useEffect(() => {
    childComments.map((child) => {
      if (child.id === replyid) {
        return setReplyToInfo({
          username: child.user.username,
          fullname: child.user.name + " " + child.user.surname,
        });
      }
    });
  }, [parentfullname, childComments]);

  const ReplyCommentHandler = () => {
    // console.log(id);
    instance
      .put("/post/createcomment", {
        username: user.username,
        postid,
        parentid,
        replyto: id,
        description: createReplyComment,
      })
      .then((res) => {
        setCreateReplyComment("");
        setChildCommentsCount(childCommentsCount + 1);
      })
      .catch((res) => console.log(res));
  };

  return (
    <div className="comment reply-comment">
      <div className="comment-body">
        <Link to={`/user/${username}`} className="avatar-box">
          <img src={image} alt="" />
        </Link>
        <div className="comment-content">
          <Link to={`/user/${username}`} className="name-box">
            {name} {surname}
          </Link>
          <span className="reply-info">
            replied to{" "}
            <Link
              to={`/user/${replyid === null ? parentusername : replytoinfo.username}`}
              className="repliedto"
            >
              {replyid === null ? parentfullname : replytoinfo.fullname}
            </Link>
          </span>
          <div className="comment-description">{description}</div>
          <div className="comment-footer">
            <div className="main-items">
              <div className="time"></div>
              <button className="reply-btn" onClick={() => setShowReplyInp(!showReplyInp)}>
                Reply
              </button>
            </div>
            <div className="minor-items">
              <div className="single-item">
                <div
                  className={`single-comment-like ${repliesLikesCount > 0 ? "haslike" : ""} ${
                    isLiked ? "liked" : ""
                  }`}
                >
                  <Icon24Like
                    onClick={() => {
                      if (isLiked) {
                        setRepliesLikesCount(repliesLikesCount - 1);
                        setIsLiked(false);
                      } else {
                        setRepliesLikesCount(repliesLikesCount + 1);
                        setIsLiked(true);
                      }
                    }}
                  />
                  <span>{repliesLikesCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showReplyInp && (
        <div className="create-comment reply-area">
          <Link to={`/user/${user.username}`} className="avatar-box">
            <img src={user.image} alt="" />
          </Link>
          <div className="comment-input">
            <Textarea
              placeholder={"Leave a comment..."}
              text={createReplyComment}
              setText={setCreateReplyComment}
            />
            <div className={`emoji-toggler ${showEmoji ? "on" : ""}`}>
              <Icon20SmileOutline onClick={() => setShowEmoji(!showEmoji)} />
            </div>
          </div>
          <button type="submit" className="send-btn" onClick={() => ReplyCommentHandler()}>
            <Icon24Send />
          </button>
          {showEmoji && (
            <div ref={emojiRef} className="emoji-holder">
              <Emoji text={createReplyComment} setText={setCreateReplyComment} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentReplies;
