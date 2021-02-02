import React from "react";
import { useGlobalContext } from "./../components/context";

const Home = () => {
  const { users } = useGlobalContext();
  return <section className="section"></section>;
};

export default Home;
