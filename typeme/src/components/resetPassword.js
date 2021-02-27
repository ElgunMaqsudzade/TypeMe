import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../components/context";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { RiArrowLeftSFill } from "react-icons/ri";

const ResetPassword = () => {
  const { resetInfo, setResetInfo, url } = useGlobalContext();
  const [responseError, setResponseError] = useState({
    error: null,
    status: null,
    loading: false,
    isChanging: false,
  });
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (responseError.error !== null) {
      setTimeout(() => {
        setResponseError({ ...responseError, error: null, status: null, loading: false });
      }, 2000);
    }
  }, [responseError]);

  const [recoverCode, setRecoverCode] = useState("");

  const EmailSubmitHandler = (e) => {
    e.preventDefault();
    const { confirmationstring, resettoken } = resetInfo.data;
    if (recoverCode === confirmationstring) {
      setToken(resettoken);
      setResponseError({ ...responseError, isChanging: true });
    } else {
      setResponseError({
        status: 403,
        error: "The code you entered doesn’t match your's. Please try again.",
        loading: false,
      });
    }
  };

  const CancelHandler = () => {
    setResetInfo(null);
  };
  if (responseError.isChanging) {
    return (
      <div className="verify-box reset-password">
        <div className="verify-title">Change old password</div>
        <hr />
        {responseError.status > 300 && <div className="verify-error">{responseError.error}</div>}
        <Formik
          initialValues={{ password: "", checkpassword: "" }}
          validationSchema={Yup.object({
            password: Yup.string()
              .matches(
                /^.*(?=.{6})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Characters must be '6-15' and contain digit, uppercase"
              )
              .required("Please enter your password."),
            checkpassword: Yup.string()
              .oneOf([Yup.ref("password"), null], "Passwords doesn't matches")
              .required("Please re-enter your password."),
          })}
          onSubmit={async (values) => {
            setResponseError({ ...responseError, loading: true });
            await new Promise((resolve) => setTimeout(resolve, 500));
            axios
              .post(`${url}/api/authenticate/resetpassword`, {
                email: resetInfo.email,
                password: values.password,
                token: token,
              })
              .then((responseData) => {
                setResetInfo(null);
                setResponseError({
                  error: null,
                  status: null,
                  loading: false,
                  isChanging: false,
                });
              })
              .catch(({ response }) => {
                console.log(response);
                setResponseError({
                  ...responseError,
                  status: response.status,
                  error: response.data.error,
                  loading: false,
                });
              });
          }}
        >
          {(props) => {
            const { touched, errors } = props;
            return (
              <>
                <Form>
                  <div className="field">
                    <Field
                      type="password"
                      name="password"
                      className="reg-inp"
                      placeholder="Enter your password"
                    />
                    {errors.password && touched.password && (
                      <div className="input-feedback">
                        <RiArrowLeftSFill size="20" className="right-arrow" />
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="field">
                    <Field
                      type="password"
                      name="checkpassword"
                      className="reg-inp"
                      placeholder="Re-enter your password"
                    />
                    {errors.checkpassword && touched.checkpassword && (
                      <div className="input-feedback">
                        <RiArrowLeftSFill size="20" className="right-arrow" />
                        {errors.checkpassword}
                      </div>
                    )}
                  </div>
                  <div className="btn-holder">
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
                    <button type="button" className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
    );
  } else {
    return (
      <div className="verify-box">
        <form onSubmit={(e) => EmailSubmitHandler(e)}>
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
              <div className="email">{resetInfo.email}</div>
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
              <button className="cancel-btn" type="button" onClick={CancelHandler}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default ResetPassword;
