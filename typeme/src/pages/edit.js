import React, { useState, useRef, useEffect, createRef } from "react";
import { useGlobalContext } from "../components/context";
import outside from "../components/customHooks/showHide";
import { Form, Formik, Field } from "formik";
import moment from "moment";
import * as Yup from "yup";
import { useQuery } from "../components/customHooks/useQuery";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon20Dropdown } from "@vkontakte/icons";
import "../sass/_edit.scss";
import Editsidebar from "../components/editsidebar";
import ResetPassword from "../components/resetPassword";
function Edit() {
  const { ResetPasswordHandler, resetInfo, instance, user } = useGlobalContext();
  const query = useQuery();
  const [userError, setUserError] = useState(false);
  const [userEdit, setUserEdit] = useState(JSON.parse(localStorage.getItem("login")).user);
  const [loading, setLoading] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const languagesRef = useRef(null);

  useEffect(() => {
    if (user.name !== null) {
      setUserEdit({ ...userEdit, ...user });
      setLoading(true);
    }
  }, [user]);

  useEffect(() => {
    if (user.username && instance) {
      instance
        .get("profile/getalllanguages")
        .then(({ data }) => setLanguages(data))
        .catch((res) => console.log(res));

      instance
        .post("/profile/getdetailuser", { username: user.username })
        .then(({ data }) => {
          setUserEdit({ ...userEdit, language: data.profileinfo.language });
        })
        .catch((res) => console.log(res));
    }
  }, [user, loading, instance]);

  useEffect(() => {
    if (userError) {
      setTimeout(() => {
        setUserError(false);
      }, 2000);
    }
  }, [userError]);

  const DetailEditHandler = () => {
    instance
      .put("/settings/changedetail", {
        username: userEdit.username,
        gender: userEdit.gender,
        name: userEdit.name,
        surname: userEdit.surname,
        languageid: userEdit.languageId,
        birthday: userEdit.birthday,
      })
      .then((res) => console.log(res))
      .catch((res) => console.log(res));
  };

  outside(languagesRef, () => {
    if (showLanguages) {
      setShowLanguages(false);
    }
  });
  return (
    <div className="row">
      <div className="col-8">
        {query.get("page") ? (
          <div className="edit-section mCard">
            <div className="topside">Login and security</div>
            <div className="login-body">
              <div className="login-controls">
                <div className="login-topside">Login</div>
                <div className="login-content">
                  <div className="reset-password-info">
                    <div className="text-box">
                      Change password
                      <div>
                        It's a good idea to use a strong password that you're not using elsewhere
                      </div>
                    </div>
                    <button
                      className="minor-btn-slimer"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      {showSettings ? "Close" : "Edit"}
                    </button>
                  </div>
                  {showSettings && (
                    <Formik
                      initialValues={{ oldpassword: "", newpassword: "", checkpassword: "" }}
                      validationSchema={Yup.object({
                        oldpassword: Yup.string().required("Please enter current password."),
                        newpassword: Yup.string()
                          .matches(
                            /^.*(?=.{6})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                            "Characters must be '6-15' and contain digit, uppercase"
                          )
                          .required("Please enter new password."),
                        checkpassword: Yup.string()
                          .oneOf([Yup.ref("newpassword"), null], "Passwords doesn't matches")
                          .required("Please re-enter your password."),
                      })}
                      onSubmit={async (values, { setSubmitting, resetForm }) => {
                        await new Promise((resolve) => setTimeout(resolve, 500));
                        instance
                          .post("/settings/changepassword", {
                            username: user.username,
                            oldpassword: values.oldpassword,
                            newpassword: values.newpassword,
                          })
                          .then((res) => console.log(res))
                          .catch((error) => {
                            setUserError(true);
                          });
                        setSubmitting(false);
                        resetForm();
                      }}
                    >
                      {(props) => {
                        const { touched, errors, values } = props;
                        return (
                          <>
                            <hr className="divider" />
                            {userError && (
                              <>
                                <div className="input-feedback">Your old password was wrong</div>
                                <hr className="divider" />
                              </>
                            )}
                            <Form>
                              <div className="full-item">
                                <div className="item">
                                  <div className="item-key">Current:</div>
                                  <Field
                                    type="password"
                                    name="oldpassword"
                                    className="info-inp"
                                    placeholder="Enter your current password"
                                  />
                                </div>
                                {errors.oldpassword && touched.oldpassword && (
                                  <div className="input-feedback">{errors.oldpassword}</div>
                                )}
                              </div>
                              <div className="full-item">
                                <div className="item">
                                  <div className="item-key">New:</div>
                                  <Field
                                    type="password"
                                    name="newpassword"
                                    className="info-inp"
                                    placeholder="Enter new password"
                                  />
                                </div>
                                {errors.newpassword && touched.newpassword && (
                                  <div className="input-feedback">{errors.newpassword}</div>
                                )}
                              </div>
                              <div className="full-item">
                                <div className="item">
                                  <div className="item-key">Re-new:</div>
                                  <Field
                                    type="password"
                                    name="checkpassword"
                                    className="info-inp"
                                    placeholder="Re-enter new password"
                                  />
                                </div>
                                {errors.checkpassword && touched.checkpassword && (
                                  <div className="input-feedback">{errors.checkpassword}</div>
                                )}
                              </div>
                              <div
                                className="forgot"
                                onClick={() => {
                                  userEdit.email && ResetPasswordHandler(userEdit.email);
                                }}
                              >
                                Forgot your password?
                              </div>
                              <hr className="divider" />
                              <div className="btn-holder text-center">
                                <button type="submit" className="main-btn-slimer">
                                  Save changes
                                </button>
                              </div>
                            </Form>
                          </>
                        );
                      }}
                    </Formik>
                  )}
                </div>
              </div>
            </div>
            {resetInfo != null && (
              <div className="modal-box">
                <ResetPassword />
              </div>
            )}
          </div>
        ) : loading ? (
          <div className="edit-section mCard">
            <div className="topside">Basic info</div>
            <div className="settings-info">
              <form
                className="register-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  DetailEditHandler();
                }}
              >
                <div className="full-item">
                  <div className="item">
                    <div className="item-key">First name:</div>
                    <input
                      type="text"
                      name="name"
                      className="info-inp"
                      placeholder="Your first name"
                      value={userEdit.name}
                      onChange={(e) => setUserEdit({ ...userEdit, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="full-item">
                  <div className="item">
                    <div className="item-key">Last name:</div>
                    <input
                      type="text"
                      name="surname"
                      className="info-inp"
                      placeholder="Your last name"
                      value={userEdit.surname}
                      onChange={(e) => setUserEdit({ ...userEdit, surname: e.target.value })}
                    />
                  </div>
                </div>
                <div className="full-item">
                  <div className="item">
                    <div className="item-key">Birthday:</div>
                    <DatePicker
                      className="info-inp"
                      selected={new Date(userEdit.birthday)}
                      onChange={(date) =>
                        setUserEdit({
                          ...userEdit,
                          birthday: moment(user.birthday).format(),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="full-item">
                  <div className="item">
                    <div className="item-key">Gender:</div>
                    <div className="gender-radio-box">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        id="male"
                        checked={userEdit.gender === "male"}
                        onChange={(e) => setUserEdit({ ...userEdit, gender: "male" })}
                      />
                      <label htmlFor="male">Male</label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        id="female"
                        checked={userEdit.gender === "female"}
                        onChange={(e) => setUserEdit({ ...userEdit, gender: "female" })}
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                  </div>
                </div>
                <div className="full-item">
                  <div className="item">
                    <div className="item-key">Languages:</div>
                    <div ref={languagesRef} className="info-inp">
                      {userEdit.language === null ? (
                        <div className="text-muted">Select language</div>
                      ) : (
                        userEdit.language
                      )}
                      <Icon20Dropdown
                        className="dropdown-icon"
                        onClick={() => setShowLanguages(!showLanguages)}
                      />
                      {showLanguages && (
                        <div className="list">
                          {languages.map((language) => {
                            return (
                              <div
                                key={language.id}
                                className="list-item"
                                onClick={() => {
                                  setUserEdit({
                                    ...userEdit,
                                    language: language.name,
                                    languageId: language.id,
                                  });
                                  setShowLanguages(false);
                                }}
                              >
                                {language.name}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="footer text-center">
                  <button className="save-btn main-btn-slimer">Save</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="loading">
            <div className="lds-dual-ring"></div>
          </div>
        )}
      </div>
      <div className="col-4">
        <Editsidebar />
      </div>
    </div>
  );
}

export default Edit;
