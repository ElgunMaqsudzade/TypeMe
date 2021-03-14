import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Icon24Like, Icon16Dropdown, Icon20SmileOutline, Icon24Send } from "@vkontakte/icons";
import { useGlobalContext } from "./context";
import outside from "./customHooks/showHide";
import CommentReplies from "./commentreplies";
import Emoji from "../components/emoji_picker";
import Textarea from "./textarea";

function Directcomments({ childcommentscount, description, id, likes, commenter, islike, postid }) {
  const { image, name, surname, username } = commenter;
  const { instance, user } = useGlobalContext();
  const [directLikesCount, setDirectLikesCount] = useState(likes);
  const [showChildComments, setShowChildComments] = useState(false);
  const [childComments, setChildComments] = useState([]);
  const [childCommentsLoading, setChildCommentsLoading] = useState(false);
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
    if (showChildComments || childCommentsCount) {
      setChildCommentsLoading(true);
      instance
        .post("post/getchildcomments", { commentid: id, username: user.username })
        .then(({ data }) => {
          setChildComments(data.childcomments);
          setChildCommentsLoading(false);
        })
        .catch((res) => console.log(res));
    }
  }, [showChildComments, childCommentsCount]);

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

  return (
    <div className="comment direct-comment">
      <Link to={`/user/${username}`} className="avatar-box">
        <img src={image} alt="" />
      </Link>
      <div className="comment-content">
        <div className="comment-body">
          <Link to={`/user/${username}`} className="name-box">
            {name} {surname}
          </Link>
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
                  className={`single-comment-like ${directLikesCount > 0 ? "haslike" : ""} ${
                    isLiked ? "liked" : ""
                  }`}
                >
                  <Icon24Like
                    onClick={() => {
                      if (isLiked) {
                        setDirectLikesCount(directLikesCount - 1);
                        setIsLiked(false);
                      } else {
                        setDirectLikesCount(directLikesCount + 1);
                        setIsLiked(true);
                      }
                    }}
                  />
                  <span>{directLikesCount}</span>
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
            {childCommentsLoading ? (
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
