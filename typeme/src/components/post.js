import React, { useState, useEffect, useRef } from "react";
import outside from "./customHooks/showHide";
import Emoji from "../components/emoji_picker";
import { Link } from "react-router-dom";
import {
  Icon24LikeOutline,
  Icon24Like,
  Icon24CommentOutline,
  Icon20View,
  Icon20SmileOutline,
  Icon24Send,
} from "@vkontakte/icons";
import "../sass/_post.scss";
import { useGlobalContext } from "./context";
import Textarea from "./textarea";
import Directcomments from "./directcomments";

function Post({
  posts,
  id,
  poster,
  likes,
  images,
  description,
  islike,
  views,
  commentscount,
  createtime,
}) {
  const { username, name, surname, image } = poster;
  const { instance, user } = useGlobalContext();
  const [createComment, setCreateComment] = useState("");
  const [isLiked, setIsliked] = useState(islike);
  const [likescount, setLikesCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(commentscount);
  const [mainComments, setMainComments] = useState([]);
  const [directCommentsLoading, setDirectCommentsLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);

  outside(emojiRef, () => {
    if (showEmoji) {
      setShowEmoji(false);
    }
  });

  const GetCreatedTime = (time) => {
    // let createdtime = new Date(time);
    // let currenttime = new Date();
    // let months = [
    //   "Jan",
    //   "Feb",
    //   "Mar",
    //   "Apr",
    //   "May",
    //   "June",
    //   "July",
    //   "Aug",
    //   "Sept",
    //   "Oct",
    //   "Nov",
    //   "Dec",
    // ];
    // if (new Date(time).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
    //   return `today at ${createdtime.getHours()}:${createdtime.getMinutes()}`;
    // } else if (new Date(time).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) - 86400000) {
    //   return `yesterday at ${createdtime.getHours()}:${createdtime.getMinutes()}`;
    // }
    // return `${currenttime.getDate()} ${
    //   months[currenttime.getMonth()]
    // } at ${createdtime.getHours()}:${createdtime.getMinutes()}`;
  };

  useEffect(() => {
    if (showComments && commentsCount > 0) {
      setDirectCommentsLoading(true);
      instance
        .post("/post/getcomments", { postid: id, username: user.username })
        .then(({ data }) => {
          setMainComments(data);
          setDirectCommentsLoading(false);
        })
        .catch((res) => console.log(res));
    }
  }, [showComments, commentsCount]);

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

  return (
    <>
      <div className="post mCard">
        <div className="post-topside">
          <Link to={`/user/${username}`} className="user-avatar">
            <img src={image} alt="" />
          </Link>
          <div className="user-info">
            <Link to={`/user/${username}`} className="fullname">
              {name} {surname}
            </Link>
            <div className="time">{}</div>
          </div>
        </div>
        <div className="post-content">
          <div className="description">{description}</div>
          <div className="images">
            {images.map((image) => {
              const { id, photo } = image;
              return (
                <div key={id} className="post-image">
                  <img src={photo} alt="" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="post-popularity">
          <div className="post-numbers">
            <div className="main-box">
              <div className="item">
                {isLiked ? (
                  <Icon24Like
                    className="item-icon liked"
                    onClick={() => {
                      if (isLiked) {
                        setIsliked(false);
                        setLikesCount(likescount - 1);
                      }
                    }}
                  />
                ) : (
                  <Icon24LikeOutline
                    className="item-icon"
                    onClick={() => {
                      if (!isLiked) {
                        setIsliked(true);
                        setLikesCount(likescount + 1);
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
            {directCommentsLoading ? (
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
