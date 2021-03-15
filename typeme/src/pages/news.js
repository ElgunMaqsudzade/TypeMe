import React, { useState, useEffect } from "react";
import CreatePost from "../components/createpost";
import { Link } from "react-router-dom";
import { data } from "../data/newsdata";
import { useGlobalContext } from "../components/context";
import Post from "../components/post";
const News = () => {
  const { instance, user } = useGlobalContext();
  const [createdPost, setCreatedPost] = useState(false);
  const [renderNewsPosts, setRenderNewsPosts] = useState(true);
  const [newsPosts, setNewsPosts] = useState([]);

  useEffect(() => {
    if (user.username && renderNewsPosts) {
      instance
        .post("post/getnews", {
          username: user.username,
        })
        .then(({ data }) => {
          setNewsPosts(data);
          setRenderNewsPosts(false);
        })
        .catch((error) => {
          if (error.response.status) {
            setNewsPosts(null);
            setRenderNewsPosts(false);
          }
        });
    }
  }, [user.username, renderNewsPosts]);

  return (
    <section className="news">
      <CreatePost setCreatedPost={setCreatedPost} createdPost={createdPost} />
      <div className="user-posts">
        <div className="user-posts-topside">
          <div className="item">All posts</div>
        </div>
        {!renderNewsPosts ? (
          newsPosts === null ? (
            <div className="empty bg-white">You are not friends with the owner of account</div>
          ) : newsPosts.length === 0 ? (
            <div className="empty bg-white">There are no posts here yet</div>
          ) : (
            newsPosts.map((post) => {
              return (
                <Post
                  key={post.id}
                  posts={newsPosts}
                  {...post}
                  poster={post.user}
                  setRenderPost={setRenderNewsPosts}
                  renderPost={renderNewsPosts}
                />
              );
            })
          )
        ) : (
          <div className="loading">
            <div className="lds-dual-ring"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
