import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Icon24Like,
  Icon20SmileOutline,
  Icon24Send,
  Icon24PenOutline,
  Icon16Cancel,
  Icon28CancelCircleOutline,
} from "@vkontakte/icons";
import { useGlobalContext } from "./context";
import Emoji from "../components/emoji_picker";
import Textarea from "./textarea";

function CommentReplies({
  createtime,
  description,
  id,
  likes,
  parentid,
  islike,
  replyid,
  commenter,
  setChildCommentsCount,
  childCommentsCount,
  postid,
  childComments,
  parentfullname,
  parentusername,
  setRenderChildComments,
}) {
  const { user, instance, GetCreatedTime } = useGlobalContext();
  const { image, name, surname, username } = commenter;
  const [editText, setEditText] = useState(description);
  const [editorMode, setEditorMode] = useState(false);
  const [replytoinfo, setReplyToInfo] = useState({ username: null, fullname: null });
  const [repliesLikesCount, setRepliesLikesCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(islike);
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
    instance
      .put("/post/createcomment", {
        username: user.username,
        postid,
        parentid,
        replyid: id,
        description: createReplyComment,
      })
      .then((res) => {
        setCreateReplyComment("");
        setChildCommentsCount(childCommentsCount + 1);
      })
      .catch((res) => console.log(res));
  };

  const LikeCommentHandler = () => {
    instance
      .put("/post/likecomment", { username: user.username, commentid: id })
      .then(() => {
        setRepliesLikesCount(repliesLikesCount + 1);
        setIsLiked(true);
      })
      .catch((res) => console.log(res));
  };
  const UnLikeCommentHandler = () => {
    instance
      .delete("post/unlikecomment", { data: { username: user.username, commentid: id } })
      .then(() => {
        setRepliesLikesCount(repliesLikesCount - 1);
        setIsLiked(false);
      })
      .catch((res) => console.log(res));
  };

  const DeleteCommentHandler = () => {
    instance
      .delete("post/deletecomment", { data: { commentid: id } })
      .then(() => {
        setChildCommentsCount((prev) => {
          return prev - 1;
        });
      })
      .catch((res) => console.log(res));
  };

  const EditCommentHandler = () => {
    instance
      .put("post/updatecomment", { commentid: id, description: editText })
      .then(() => {
        setRenderChildComments(true);
      })
      .catch((res) => console.log(res));
  };

  return (
    <div className="comment reply-comment">
      {editorMode ? (
        <div className="create-comment reply-area">
          <Link to={`/user/${user.username}`} className="avatar-box">
            <img src={user.image} alt="" />
          </Link>
          <div className="comment-input">
            <Textarea placeholder={"Leave a comment..."} text={editText} setText={setEditText} />
            <div className={`emoji-toggler ${showEmoji ? "on" : ""}`}>
              <Icon20SmileOutline onClick={() => setShowEmoji(!showEmoji)} />
            </div>
          </div>
          <button
            type="button"
            className="edit-btn close-btn"
            onClick={() => {
              setEditorMode(false);
              setEditText(description);
            }}
          >
            <Icon28CancelCircleOutline />
          </button>
          <button type="button" className="edit-btn" onClick={() => EditCommentHandler()}>
            <Icon24Send />
          </button>
          {showEmoji && (
            <div ref={emojiRef} className="emoji-holder">
              <Emoji text={editText} setText={setEditText} />
            </div>
          )}
        </div>
      ) : (
        <div className="comment-body">
          <Link to={`/user/${username}`} className="avatar-box">
            <img src={image} alt="" />
          </Link>
          <div className="comment-content">
            <div className="comment-top-info">
              <div className="comment-user-info">
                <Link to={`/user/${username}`} className="name-box">
                  {name} {surname}
                </Link>
                <span className="reply-info">
                  replied to{" "}
                  <Link
                    to={`/user/${
                      replytoinfo.username === null ? parentusername : replytoinfo.username
                    }`}
                    className="repliedto"
                  >
                    {replytoinfo.fullname === null ? parentfullname : replytoinfo.fullname}
                  </Link>
                </span>
              </div>
              {user.username === username && (
                <div className="options">
                  <Icon24PenOutline className="option-item" onClick={() => setEditorMode(true)} />
                  <Icon16Cancel className="option-item" onClick={() => DeleteCommentHandler()} />
                </div>
              )}
            </div>
            <div className="comment-description">{description}</div>
            <div className="comment-footer">
              <div className="main-items">
                <div className="time">{GetCreatedTime(createtime)}</div>
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
                          UnLikeCommentHandler();
                        } else {
                          LikeCommentHandler();
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
      )}

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
