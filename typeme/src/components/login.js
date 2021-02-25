import React, { useState, useEffect } from "react";
import { useGlobalContext } from "./context";
import "../sass/_login.scss";
import { Redirect } from "react-router-dom";
import axios from "axios";
function Login() {
  const { setLogged, logged } = useGlobalContext();
  const [login, setLogin] = useState({ email: null, password: null, logined: false, store: null });

  const LoginSubmitHandler = (e) => {
    e.preventDefault();
    axios.post("https://localhost:44303/api/authenticate/login", login).then(
      (response) => {
        localStorage.setItem(
          "login",
          JSON.stringify({
            logined: true,
            token: response.data.token,
            user: response.data.user,
          })
        );
        setLogged(true);
      },
      (error) => {
        console.log(error);
      }
    );
  };
  let store = JSON.parse(localStorage.getItem("login"));
  useEffect(() => {
    if (store && store.logined) {
      setLogin({ ...login, logined: true, store: store });
    }
  }, []);
  return (
    <>
      {store && store.logined ? <Redirect to="/feed" /> : null}
      <div className="login">
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
          <button
            className={`login-btn ${logged == false ? "loading" : ""}`}
            onClick={() => setLogged(false)}
          >
            {logged != false ? (
              "Log in"
            ) : (
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </button>
          <button className="forgot">Forgot your password</button>
        </form>
      </div>
    </>
  );
}

export default Login;
