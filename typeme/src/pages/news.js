import React from "react";
import CreatePost from "../components/createpost";
import { data } from "../data/newsdata";
import logo from "../images/logo.png";
const News = () => {
  return (
    <section className="news">
      <CreatePost logo={logo} />
      {data &&
        data.map((item) => {
          return <div key={item} className=""></div>;
        })}
    </section>
  );
};

export default News;
