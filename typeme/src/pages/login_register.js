import React, { useState } from "react";
import { useGlobalContext } from "../components/context";
import Login from "../components/login";
import Register from "../components/register";
import VerifyEmail from "../components/verify_email";
import ShortLogin from "../components/shortLogin";
import ResetPassword from "../components/resetPassword";
import { Icon16Cancel } from "@vkontakte/icons";
const LoginRegister = () => {
  const { setOldUsers, oldUsers, resetInfo, shortLogin, setShortLogin } = useGlobalContext();
  const [verifyEmail, setVerifyEmail] = useState(null);
  const RemoveLocaleUser = (email) => {
    let newUsers = oldUsers.filter((user) => user.email !== email);
    setOldUsers(newUsers);
  };
  return (
    <section className="login-register">
      <div className="row">
        <div className="col-8">
          <div className="short-login-content">
            <h1 className={`title no-users`}>TypeMe</h1>

            {oldUsers === null ? (
              <p className="content">
                Typeme helps you stay connected and connect with your friends.
              </p>
            ) : (
              <>
                <p className="login-content">Recent Logins</p>
                <div className="users">
                  {oldUsers.map((user) => {
                    const { name, surname, image, email } = user;
                    return (
                      <button key={email} className="old-user" onClick={() => setShortLogin(user)}>
                        <Icon16Cancel
                          className="close-icon"
                          onClick={() => RemoveLocaleUser(email)}
                        />
                        <div className="image-holder">
                          <img src={image && require(`../images/user/${image}`).default} alt="" />
                        </div>
                        <div className="name-box">
                          {name} {surname}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="col-4">
          <div className="login-register-forms">
            <div className="login-box">
              <Login />
            </div>
            <div className="register-box">
              <Register setVerifyEmail={setVerifyEmail} />
            </div>
          </div>
        </div>
      </div>
      {verifyEmail != null && (
        <div className="modal-box">
          <VerifyEmail {...verifyEmail} setVerifyEmail={setVerifyEmail} />
        </div>
      )}
      {shortLogin != null && (
        <div className="modal-box">
          <ShortLogin {...shortLogin} />
        </div>
      )}
      {resetInfo != null && (
        <div className="modal-box">
          <ResetPassword />
        </div>
      )}
    </section>
  );
};

export default LoginRegister;
