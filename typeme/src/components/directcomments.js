import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Icon24Like,
  Icon16Dropdown,
  Icon20SmileOutline,
  Icon24Send,
  Icon24PenOutline,
  Icon16Cancel,
  Icon28CancelCircleOutline,
} from "@vkontakte/icons";
import { useGlobalContext } from "./context";
import outside from "./customHooks/showHide";
import CommentReplies from "./commentreplies";
import Emoji from "../components/emoji_picker";
import Textarea from "./textarea";

function Directcomments({
  childcommentscount,
  description,
  id,
  likes,
  commenter,
  islike,
  postid,
  createtime,
  setCommentsCount,
  setRenderReplies,
}) {
  const { image, name, surname, username } = commenter;
  const { instance, user, GetCreatedTime } = useGlobalContext();
  const [editText, setEditText] = useState(description);
  const [editorMode, setEditorMode] = useState(false);
  const [directLikesCount, setDirectLikesCount] = useState(likes);
  const [showChildComments, setShowChildComments] = useState(false);
  const [childComments, setChildComments] = useState([]);
  const [renderChildComments, setRenderChildComments] = useState(false);
  const [childCommentsCount, setChildCommentsCount] = useState(childcommentscount);
  const [isLiked, setIsLiked] = useState(islike);
  const [showReplyInp, setShowReplyInp] = useState(false);
  const [createReplyComment, setCreateReplyComment] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);

  outside(emojiRef, () => {
    if (showEmoji) {
      setShowEmoji(false);
    }
  });

  useEffect(() => {
    if (showChildComments || childCommentsCount || renderChildComments) {
      instance
        .post("post/getchildcomments", { commentid: id, username: user.username })
        .then(({ data }) => {
          setChildComments(data.childcomments);
          setRenderChildComments(false);
        })
        .catch((res) => console.log(res));
    }
  }, [showChildComments, childCommentsCount, renderChildComments]);

  useEffect(() => {
    if (childCommentsCount !== childcommentscount) {
      setRenderChildComments(true);
    }
  }, [childCommentsCount]);

  const ReplyCommentHandler = () => {
    instance
      .put("/post/createcomment", {
        username: user.username,
        postid,
        parentid: id,
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
        setDirectLikesCount(directLikesCount + 1);
        setIsLiked(true);
      })
      .catch((res) => console.log(res));
  };
  const UnLikeCommentHandler = () => {
    instance
      .delete("post/unlikecomment", { data: { username: user.username, commentid: id } })
      .then(() => {
        setDirectLikesCount(directLikesCount - 1);
        setIsLiked(false);
      })
      .catch((res) => console.log(res));
  };

  const DeleteCommentHandler = () => {
    instance
      .delete("post/deletecomment", { data: { commentid: id } })
      .then(() => {
        setCommentsCount((prev) => {
          return prev - 1;
        });
      })
      .catch((res) => console.log(res));
  };
  const EditCommentHandler = () => {
    instance
      .put("post/updatecomment", { commentid: id, description: editText })
      .then(() => {
        setRenderReplies(true);
      })
      .catch((res) => console.log(res));
  };

  return (
    <div className="comment direct-comment">
      {!editorMode && (
        <Link to={`/user/${username}`} className="avatar-box">
          <img src={image} alt="" />
        </Link>
      )}
      <div className="comment-content">
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
              className="send-btn close-btn"
              onClick={() => {
                setEditorMode(false);
                setEditText(description);
              }}
            >
              <Icon28CancelCircleOutline />
            </button>
            <button type="button" className="send-btn" onClick={() => EditCommentHandler()}>
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
            <div className="comment-top-info">
              <Link to={`/user/${username}`} className="name-box">
                {name} {surname}
              </Link>
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
                    className={`single-comment-like ${directLikesCount > 0 ? "haslike" : ""} ${
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
                    <span>{directLikesCount}</span>
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
        {childCommentsCount > 0 && (
          <button
            className="childcomments-toggler"
            onClick={() => setShowChildComments(!showChildComments)}
          >
            <Icon16Dropdown className="reply-icon" />
            View <span>{childCommentsCount}</span> replies
          </button>
        )}
        {showChildComments && (
          <>
            {renderChildComments ? (
              <div className="loading">
                <div className="lds-dual-ring medium"></div>
              </div>
            ) : (
              childComments.map((child) => {
                return (
                  <CommentReplies
                    key={child.id}
                    {...child}
                    commenter={child.user}
                    setChildCommentsCount={setChildCommentsCount}
                    childCommentsCount={childCommentsCount}
                    postid={postid}
                    childComments={childComments}
                    parentfullname={name + " " + surname}
                    parentusername={username}
                    setRenderChildComments={setRenderChildComments}
                  />
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Directcomments;
