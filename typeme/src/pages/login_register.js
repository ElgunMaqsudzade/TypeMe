import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/login";
import Register from "../components/register";
import { useGlobalContext } from "./../components/context";
import axios from "axios";

const LoginRegister = () => {
  const {} = useGlobalContext();
  const RegisterSubmitHandler = (user) => {
    console.log(user);
    axios
      .post("http://jrcomerun-001-site1.ftempurl.com/api/authenticate/register", user)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <section className="login-register">
      <div className="row">
        <div className="col-8">
          <div className="short-login-content">
            <h1 className={`title no-users`}>TypeMe</h1>
            <p className="content">
              Typeme helps you stay connected and connect with your friends.
            </p>
            <p className="login-content">Recent Logins</p>
            <div className="users">salam</div>
          </div>
        </div>
        <div className="col-4">
          <div className="login-register-forms">
            <div className="login-box">
              <Login />
            </div>
            <div className="register-box">
              <Register RegisterSubmitHandler={RegisterSubmitHandler} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginRegister;
