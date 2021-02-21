import React from "react";
import CreatePost from "../components/createpost";
import { useGlobalContext } from "./../components/context";
import { data } from "../data/newsdata";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
const News = () => {
  const { users } = useGlobalContext();
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
