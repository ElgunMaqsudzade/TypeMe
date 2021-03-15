import React, { useState } from "react";
import CreatePost from "../components/createpost";
import { data } from "../data/newsdata";
const News = () => {
  const [createdPost, setCreatedPost] = useState(false);
  return (
    <section className="news">
      <CreatePost setCreatedPost={setCreatedPost} createdPost={createdPost} />
      {data &&
        data.map((item) => {
          return <div key={item} className=""></div>;
        })}
    </section>
  );
};

export default News;
