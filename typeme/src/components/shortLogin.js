import React, { useRef, useState, useEffect } from "react";
import { useGlobalContext } from "../components/context";
import { Icon16Cancel } from "@vkontakte/icons";
import useOutsideClick from "../components/customHooks/showHide";
import axios from "axios";

const ShortLogin = ({ name, surname, image, email }) => {
  const { setLogged, ResetPasswordHandler, setShortLogin, url } = useGlobalContext();
  const refShortLoginBox = useRef(null);
  const [responseError, setResponseError] = useState({ status: null, error: null, loading: false });
  const [login, setLogin] = useState({ email: null, password: null, logined: false, store: null });

  useEffect(() => {
    setLogin((prev) => {
      return { ...prev, email };
    });
  }, [email]);

  useEffect(() => {
    if (responseError.error !== null) {
      setTimeout(() => {
        setResponseError({ error: null, status: null, loading: false });
      }, 2000);
    }
  }, [responseError]);
  useOutsideClick(refShortLoginBox, () => {
    if (email) {
      setShortLogin(null);
    }
  });
  const SubmitHandler = (e) => {
    e.preventDefault();
    setResponseError({ status: null, error: null, loading: true });
    axios
      .post(`${url}/api/authenticate/login`, login)
      .then((responseData) => {
        localStorage.setItem(
          "login",
          JSON.stringify({
            logined: true,
            token: responseData.data.token,
            user: responseData.data.user,
          })
        );
        setLogged(true);
        setShortLogin(null);
      })
      .catch(({ response }) => {
        setResponseError({
          status: response.status,
          error: response.data.error,
          loading: false,
        });
      });
  };
  return (
    <div className="shortLogin-box" ref={refShortLoginBox}>
      <Icon16Cancel className="close-icon" onClick={() => setShortLogin(null)} />
      {responseError.status > 300 && <div className="verify-error">{responseError.error}</div>}
      <div className="image-holder">
        <img src={image && require(`../images/user/${image}`).default} alt="" />
      </div>
      <div className="name-box">
        Log in as{" "}
        <strong>
          {name} {surname}
        </strong>
      </div>
      <div className="short-login-form">
        <form onSubmit={(e) => SubmitHandler(e)}>
          <input
            type="password"
            placeholder="Password"
            className="login-inp"
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
          <div className="login-btns">
            <button type="submit" className="submit-btn" onClick={() => setLogged(false)}>
              {responseError.loading ? (
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                "Log in"
              )}
            </button>
            <button
              className="forgot-btn"
              type="button"
              onClick={() => ResetPasswordHandler(email)}
            >
              Forgot your password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShortLogin;
