import React from "react";
import CreatePost from "../components/createpost";
import { data } from "../data/newsdata";
const News = () => {
  return (
    <section className="news">
      <CreatePost />
      {data &&
        data.map((item) => {
          return <div key={item} className=""></div>;
        })}
    </section>
  );
};

export default News;
