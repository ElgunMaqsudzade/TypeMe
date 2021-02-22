import React from "react";
import "../sass/_login.scss";
function Login() {
  return (
    <div className="login">
      <form className="login-form" action="">
        <input type="text" placeholder="Phone or email" />
        <input type="password" placeholder="Password" />
        <button className="login-btn">Log in</button>
        <a href="#" className="forgot">
          Forgot your password
        </a>
      </form>
    </div>
  );
}

export default Login;
