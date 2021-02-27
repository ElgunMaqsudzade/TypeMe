import React, { useState, useEffect } from "react";
import { useGlobalContext } from "./context";
import "../sass/_login.scss";
import { Redirect } from "react-router-dom";
import axios from "axios";
function Login() {
  const { setLogged, url, ResetPasswordHandler } = useGlobalContext();
  const [responseError, setResponseError] = useState({ status: null, error: null, loading: false });
  const [login, setLogin] = useState({ email: null, password: null, logined: false, store: null });

  useEffect(() => {
    if (responseError.error !== null) {
      setTimeout(() => {
        setResponseError({ error: null, status: null, loading: false });
      }, 2000);
    }
  }, [responseError]);

  const LoginSubmitHandler = (e) => {
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
      })
      .catch(({ response }) => {
        setResponseError({
          status: response.status,
          error: response.data.error,
          loading: false,
        });
      });
  };
  let store = JSON.parse(localStorage.getItem("login"));
  useEffect(() => {
    if (store && store.logined) {
      setLogin((prev) => {
        return { ...prev, logined: true, store: store };
      });
    }
  }, [store]);
  return (
    <>
      {store && store.logined ? <Redirect to="/feed" /> : null}
      <div className="login">
        <div className="login-error">{responseError.error}</div>
        <form className="login-form" onSubmit={LoginSubmitHandler}>
          <input
            type="text"
            placeholder="Phone or email"
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
          <button className="login-btn" onClick={() => setLogged(false)}>
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
            className="forgot"
            type="button"
            onClick={() => {
              login.email && ResetPasswordHandler(login.email);
            }}
          >
            Forgot your password
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
