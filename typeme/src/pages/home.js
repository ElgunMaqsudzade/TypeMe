import React from "react";
import { useGlobalContext } from "./../components/context";

const Home = () => {
  const { users } = useGlobalContext();
  return <section>hello</section>;
};

export default Home;
