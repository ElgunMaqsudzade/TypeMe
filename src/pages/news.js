import React, { useState, useEffect } from "react";
import CreatePost from "../components/createpost";
import { useLocation } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import Post from "../components/post";
import { useQuery } from "../components/customHooks/useQuery";

const News = () => {
  const { instance, user } = useGlobalContext();
  const query = useQuery();
  const location = useLocation();
  const [createdPost, setCreatedPost] = useState(false);
  const [renderNewsPosts, setRenderNewsPosts] = useState(true);
  const [newsPosts, setNewsPosts] = useState([]);

  useEffect(() => {
    if (user.username && query.get("filter") === "liked") {
      setRenderNewsPosts(true);
      instance
        .post("post/getlikedposts", {
          username: user.username,
        })
        .then(({ data }) => {
          setNewsPosts(data);
          setRenderNewsPosts(false);
        })
        .catch((error) => {
          if (error) {
            setNewsPosts(null);
            setRenderNewsPosts(false);
          }
        });
    }
  }, [user.username, location]);

  useEffect(() => {
    if (user.username && query.get("filter") === "commented") {
      setRenderNewsPosts(true);
      instance
        .post("post/getcommentedposts", {
          username: user.username,
        })
        .then(({ data }) => {
          setNewsPosts(data);
          setRenderNewsPosts(false);
        })
        .catch((error) => {
          if (error) {
            setNewsPosts(null);
            setRenderNewsPosts(false);
          }
        });
    }
  }, [user.username, location]);

  useEffect(() => {
    if (query.get("filter") === null) {
      setRenderNewsPosts(true);
    }
  }, [location]);

  useEffect(() => {
    FetchData();
  }, [user.username, renderNewsPosts, location]);

  const FetchData = (skip) => {
    if (user.username && renderNewsPosts && query.get("filter") === null) {
      instance
        .post("post/getnews", {
          username: user.username,
          skip,
        })
        .then(({ data }) => {
          setNewsPosts(data);
          setRenderNewsPosts(false);
        })
        .catch((error) => {
          if (error) {
            setNewsPosts(null);
            setRenderNewsPosts(false);
          }
        });
    }
  };

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
