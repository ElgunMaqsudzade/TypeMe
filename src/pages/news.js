import React, { useState, useEffect } from "react";
import CreatePost from "../components/createpost";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useLocation } from "react-router-dom";
import { useGlobalContext } from "../components/context";
import Post from "../components/post";
import { useQuery } from "../components/customHooks/useQuery";

const News = () => {
  const { instance, user } = useGlobalContext();
  const query = useQuery();
  const location = useLocation();
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [renderNewsPosts, setRenderNewsPosts] = useState(false);
  const [newsPosts, setNewsPosts] = useState([]);

  useEffect(() => {
    if (user.username && query.get("filter") === "liked") {
      instance
        .post("post/getlikedposts", {
          username: user.username,
        })
        .then(({ data }) => {
          console.log(data);
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
  }, [user.username, location, renderNewsPosts]);

  useEffect(() => {
    if (user.username && query.get("filter") === "commented") {
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
  }, [user.username, location, renderNewsPosts]);

  useEffect(() => {
    setSkip(0);
    setLoading(true);
    setRenderNewsPosts(true);
  }, [location]);

  useEffect(() => {
    FetchData();
  }, [user.username, renderNewsPosts, location, skip]);

  const FetchData = () => {
    if (user.username && query.get("filter") === null) {
      instance
        .post("post/getnews", {
          username: user.username,
          skip: skip,
        })
        .then(({ data }) => {
          if (data.length === 0) {
            setLoading(false);
          }
          if (skip === 0 && query.get("filter") === null) {
            setNewsPosts(data);
          } else {
            setNewsPosts([...newsPosts, ...data]);
          }
          setRenderNewsPosts(false);
        })
        .catch((error) => {
          if (error) {
            setNewsPosts(null);
          }
        });
    }
  };

  return (
    <section className="news">
      <CreatePost setRenderPost={setRenderNewsPosts} renderPost={renderNewsPosts} />
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
            <InfiniteScroll
              dataLength={newsPosts.length}
              next={() => setSkip(skip + 10)}
              hasMore={loading}
              loader={
                <div className="loading">
                  <div className="lds-dual-ring"></div>
                </div>
              }
            >
              {newsPosts.length > 0 &&
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
                })}
            </InfiniteScroll>
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
