import React, { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/login";
import Register from "../components/register";

const LoginRegister = () => {
  const [birthday, setBirthday] = useState(null);
  return (
    <section className="login-register">
      <div className="row">
        <div className="col-8">
          <div className="short-login-content">
            <h1 className={`title no-users`}>TypeMe</h1>
            <p className="content">Typeme helps you stay connected and connect with your friends.</p>
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
              <Register birthday={birthday} setBirthday={setBirthday} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginRegister;
