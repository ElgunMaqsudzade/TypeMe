import React, { useState } from "react";
import { useGlobalContext } from "../components/context";
import axios from "axios";

function VerifyEmail({ setVerifyEmail, config, data }) {
  const { url } = useGlobalContext();
  const [responseError, setResponseError] = useState({ status: null, error: null, loading: false });
  const [recoverCode, setRecoverCode] = useState("");
  let email = JSON.parse(config.data).email;

  const CancelHandler = (e) => {
    e.preventDefault();
    axios
      .delete(`${url}/api/authenticate/delete`, {
        data: {
          email,
        },
      })
      .catch(({ response }) => {
        console.log(response);
      });
    setVerifyEmail(null);
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
    setResponseError({ ...responseError, loading: true });
    const { confirmationstring, confirmationtoken } = data;
    if (recoverCode === confirmationstring) {
      axios
        .post(`${url}/api/authenticate/verifyemail`, {
          email,
          token: confirmationtoken,
        })
        .then((responseData) => {
          setVerifyEmail(null);
          setResponseError({ ...responseError, loading: false });
        })
        .catch(({ response }) => {
          setResponseError({ status: response.status, error: response.data.error, loading: false });
        });
    } else {
      setResponseError({
        status: 403,
        error: "The code you entered doesn’t match your's. Please try again.",
        loading: false,
      });
    }
  };
  return (
    <div className="verify-box">
      <form onSubmit={SubmitHandler}>
        <div className="verify-title">Enter Security Code</div>
        <hr />
        {responseError.status > 300 && <div className="verify-error">{responseError.error}</div>}
        <div className="verify-dscr">
          Please check your email for a message with your code. Your code is 6 numbers long.
        </div>
        <div className="verify-body">
          <input
            placeholder="Enter Code"
            type="text"
            className="verify-inp"
            onChange={(e) => setRecoverCode(e.target.value)}
            value={recoverCode}
          />
          <div className="verify-info">
            <div className="info">We sent your code to:</div>
            <div className="email">{email}</div>
          </div>
        </div>
        <div className="verify-footer">
          <div className="re-send-box">
            <p className="re-send"></p>
          </div>
          <div className="verify-submit">
            <button type="submit" className="submit-btn">
              {responseError.loading ? (
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                "Continue"
              )}
            </button>
            <button className="cancel-btn" onClick={(e) => CancelHandler(e)}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default VerifyEmail;
