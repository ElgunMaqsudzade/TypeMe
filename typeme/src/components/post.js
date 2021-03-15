import React, { useState, useEffect, useRef } from "react";
import outside from "./customHooks/showHide";
import Emoji from "../components/emoji_picker";
import { Link, useLocation } from "react-router-dom";
import {
  Icon24LikeOutline,
  Icon24Like,
  Icon24CommentOutline,
  Icon20View,
  Icon20SmileOutline,
  Icon24Send,
  Icon20Dropdown,
} from "@vkontakte/icons";
import "../sass/_post.scss";
import { useGlobalContext } from "./context";
import Textarea from "./textarea";
import Directcomments from "./directcomments";
import CreatePost from "./createpost";

function Post({
  id,
  poster,
  likes,
  images,
  description,
  islike,
  views,
  commentscount,
  createtime,
  setRenderPost,
  renderPost,
  posts,
}) {
  const { username, name, surname, image } = poster;
  const { instance, user, GetCreatedTime } = useGlobalContext();
  const location = useLocation();
  const [createComment, setCreateComment] = useState("");
  const [editerMode, setEditerMode] = useState(false);
  const [isLiked, setIsliked] = useState(islike);
  const [likescount, setLikesCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentsCount, setCommentsCount] = useState(commentscount);
  const [mainComments, setMainComments] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [renderReplies, setRenderReplies] = useState(false);
  const emojiRef = useRef(null);
  const optionsRef = useRef(null);

  outside(emojiRef, () => {
    if (showEmoji) {
      setShowEmoji(false);
    }
  });

  outside(optionsRef, () => {
    if (showOptions) {
      setShowOptions(false);
    }
  });

  useEffect(() => {
    console.log("1");
    if (
      showComments ||
      commentscount !== commentsCount ||
      commentscount > 0 ||
      renderReplies === true
    ) {
      instance
        .post("/post/getcomments", { postid: id, username: user.username })
        .then(({ data }) => {
          setMainComments(data);
          setRenderReplies(false);
        })
        .catch((res) => console.log(res));
    }
  }, [showComments, commentsCount, commentscount, renderReplies]);

  useEffect(() => {
    if (commentsCount !== commentscount) {
      setRenderReplies(true);
    }
  }, [commentsCount]);

  const DirectCommentHandler = () => {
    instance
      .put("/post/createcomment", {
        username: user.username,
        postid: id,
        description: createComment,
      })
      .then((res) => {
        setCreateComment("");
        setCommentsCount(commentsCount + 1);
      })
      .catch((res) => console.log(res));
  };
  const LikePostHandler = () => {
    instance
      .put("/post/likepost", { username: user.username, postid: id })
      .then(() => {
        setIsliked(true);
        setLikesCount(likescount + 1);
      })
      .catch((res) => console.log(res));
  };
  const UnLikePostHandler = () => {
    instance
      .delete("post/unlikepost", { data: { username: user.username, postid: id } })
      .then(() => {
        setIsliked(false);
        setLikesCount(likescount - 1);
      })
      .catch((res) => console.log(res));
  };
  const PostDeleteHandler = () => {
    instance
      .delete("post/deletepost", { data: { postid: id } })
      .then((res) => {
        setRenderPost(true);
      })
      .catch((res) => console.log(res));
  };
  return (
    <>
      <div className={`post ${posts[0].id === id ? "topcard" : ""} mCard`}>
        {editerMode ? (
          <CreatePost
            setRenderPost={setRenderPost}
            renderPost={renderPost}
            text={description}
            images={images}
            editerMode={editerMode}
            setEditerMode={setEditerMode}
            postid={id}
          />
        ) : (
          <>
            <div className="post-topside">
              <Link to={`/user/${username}`} className="user-avatar">
                <img src={image} alt="" />
              </Link>
              <div className="user-info">
                <Link to={`/user/${username}`} className="fullname">
                  {name} {surname}
                </Link>
                <div className="time">{GetCreatedTime(createtime)}</div>
              </div>
              {username === user.username && (
                <div ref={optionsRef} className="dropdown">
                  <Icon20Dropdown
                    className="dropdown-icon"
                    onClick={() => setShowOptions(!showOptions)}
                  />
                  {showOptions && (
                    <div className="options showCard">
                      <div className="item" onClick={() => setEditerMode(true)}>
                        Edit post
                      </div>
                      <div className="item" onClick={() => PostDeleteHandler()}>
                        Delete post
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="post-content">
              <div className="description">{description}</div>
              <div className={`postimages ${images.length === 1 ? "single-row" : ""}`}>
                {images.map((image) => {
                  const { id, photo } = image;
                  return (
                    <Link
                      to={`${location.pathname}?image=${id}`}
                      key={id}
                      className="post-image image"
                      style={{ backgroundImage: `url(${photo})` }}
                    ></Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
        <div className="post-popularity">
          <div className="post-numbers">
            <div className="main-box">
              <div className="item">
                {isLiked ? (
                  <Icon24Like
                    className="item-icon liked"
                    onClick={() => {
                      if (isLiked) {
                        UnLikePostHandler();
                      }
                    }}
                  />
                ) : (
                  <Icon24LikeOutline
                    className="item-icon"
                    onClick={() => {
                      if (!isLiked) {
                        LikePostHandler();
                      }
                    }}
                  />
                )}
                {likescount !== 0 && likescount}
              </div>
              <div className="item">
                <Icon24CommentOutline
                  className="item-icon"
                  onClick={() => {
                    setShowComments(!showComments);
                  }}
                />
                {commentsCount !== 0 && commentsCount}
              </div>
              <div className="item"></div>
            </div>
            <div className="minor-box">
              <div className="item">
                {views !== 0 && (
                  <>
                    <Icon20View className="item-icon" />
                    {views}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {showComments && (
          <div className="post-comments">
            {renderReplies ? (
              <div className="loading">
                <div className="lds-dual-ring medium"></div>
              </div>
            ) : (
              <div className="comments-box">
                {mainComments.map((comment) => {
                  return (
                    <Directcomments
                      key={comment.id}
                      {...comment}
                      commenter={comment.user}
                      postid={id}
                      setCommentsCount={setCommentsCount}
                      setRenderReplies={setRenderReplies}
                    />
                  );
                })}
              </div>
            )}

            <div className="create-comment">
              <Link to={`/user/${user.username}`} className="avatar-box">
                <img src={user.image} alt="" />
              </Link>
              <div className="comment-input">
                <Textarea
                  placeholder={"Leave a comment..."}
                  text={createComment}
                  setText={setCreateComment}
                />
                <div className={`emoji-toggler ${showEmoji ? "on" : ""}`}>
                  <Icon20SmileOutline onClick={() => setShowEmoji(!showEmoji)} />
                </div>
              </div>
              <button type="submit" className="send-btn" onClick={() => DirectCommentHandler()}>
                <Icon24Send />
              </button>
              {showEmoji && (
                <div ref={emojiRef} className="emoji-holder">
                  <Emoji text={createComment} setText={setCreateComment} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Post;
