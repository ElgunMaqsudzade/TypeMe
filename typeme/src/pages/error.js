import React from "react";
import { Link } from "react-router-dom";
import { IoIosReturnLeft } from "react-icons/io";
import Image from "../images/error.png";
const Error = () => {
  return (
    <section className="error">
      <div className="error-page">
        <div className="error-image">
          <img src={Image} alt="" />
        </div>
        <h2 className="error-title">UH OH! You're lost.</h2>
        <p className="error-text">
          The page you are looking for does not exist. How you got here is a mystery. But you can
          click the button below to go back to the homepage.
        </p>
        <Link to="/feed" className="error-btn">
          <div className="error-btn-icon">
            <IoIosReturnLeft />
          </div>
          Return
        </Link>
      </div>
    </section>
  );
};

export default Error;
