import React, { useState, useEffect } from "react";
import { useGlobalContext } from "./context";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import "../sass/_register.scss";
import DatePicker from "react-date-picker";
import { Icon20CalendarOutline, Icon16Cancel } from "@vkontakte/icons";
import { RiArrowRightSFill } from "react-icons/ri";

function Register({ setVerifyEmail }) {
  const { instance } = useGlobalContext();
  const [resError, setResError] = useState({
    error: null,
    status: null,
    loading: false,
  });
  useEffect(() => {
    if (resError.error !== null) {
      setTimeout(() => {
        setResError({ error: null, status: null, loading: false });
      }, 2000);
    }
  }, [resError]);

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          surname: "",
          gender: "",
          email: "",
          password: "",
          checkpassword: "",
          birthday: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .min(3, "Your name must be at least '3' characters.")
            .max(15, "Your name can't be longer than '15' characters.")
            .required("Please enter your name."),
          surname: Yup.string()
            .min(3, "Your last name must be at least '3' characters.")
            .max(15, "Your last name can't be longer than '15' characters.")
            .required("Please enter your last name."),
          gender: Yup.string().required("Please choose your gender."),
          password: Yup.string()
            .matches(
              /^.*(?=.{6})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
              "Characters must be '6-15' and contain digit, uppercase"
            )
            .required("Please enter your password."),
          checkpassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords doesn't matches")
            .required("Please re-enter your password."),
          email: Yup.string().email("Invalid email address").required("Please enter your email."),
          birthday: Yup.string().required("Please enter your birthday."),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setResError({ ...resError, loading: true });
          await new Promise((resolve) => setTimeout(resolve, 500));
          let user = {
            ...values,
            birthday: `${values.birthday.getDate()}-${
              values.birthday.getMonth() + 1
            }-${values.birthday.getFullYear()}`,
          };
          instance
            .post(`authenticate/register`, user)
            .then((responseData) => {
              const { response } = responseData.data;
              setResError({ status: response.status, error: response.error, loading: false });
              setVerifyEmail(responseData);
              resetForm();
            })
            .catch(({ response }) => {
              console.log(response);
              setResError({
                status: response.status,
                error: response.data.error,
                loading: false,
              });
            });

          setSubmitting(false);
        }}
      >
        {(props) => {
          const { values, touched, errors, setFieldValue } = props;
          return (
            <div className="register">
              <h4 className="register-title">Sign up for TM</h4>
              {resError.status > 300 && <p className="register-error">{resError.error}</p>}
              <Form className="register-form">
                <div className="field">
                  <Field
                    type="text"
                    name="name"
                    className="reg-inp"
                    placeholder="Your first name"
                  />
                  {errors.name && touched.name && (
                    <div className="input-feedback">
                      <RiArrowRightSFill size="20" className="right-arrow" />
                      {errors.name}
                    </div>
                  )}
                </div>
                <div className="field">
                  <Field
                    type="text"
                    name="surname"
                    className="reg-inp"
                    placeholder="Your last name"
                  />
                  {errors.surname && touched.surname && (
                    <div className="input-feedback">
                      <RiArrowRightSFill size="20" className="right-arrow" />
                      {errors.surname}
                    </div>
                  )}
                </div>
                <div className="field">
                  <Field
                    type="text"
                    name="email"
                    className="reg-inp"
                    placeholder="Your email address"
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback">
                      <RiArrowRightSFill size="20" className="right-arrow" />
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="field">
                  <Field
                    type="password"
                    name="password"
                    className="reg-inp"
                    placeholder="Enter your password"
                    autoComplete="off"
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback">
                      <RiArrowRightSFill size="20" className="right-arrow" />
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
                    autoComplete="off"
                  />
                  {errors.checkpassword && touched.checkpassword && (
                    <div className="input-feedback">
                      <RiArrowRightSFill size="20" className="right-arrow" />
                      {errors.checkpassword}
                    </div>
                  )}
                </div>
                <p className="label-name">Birthday</p>
                <div className="field">
                  <Field name="birthday">
                    {() => {
                      return (
                        <DatePicker
                          value={values.birthday}
                          onChange={(val) => setFieldValue("birthday", val)}
                          id="birthday"
                          dayPlaceholder="Day"
                          maxDate={new Date()}
                          monthPlaceholder="Month"
                          yearPlaceholder="Year"
                          className="birthday-box"
                          calendarClassName="calendar"
                          calendarIcon={<Icon20CalendarOutline className="icon" />}
                          clearIcon={<Icon16Cancel className="icon" />}
                        />
                      );
                    }}
                  </Field>
                  {errors.birthday && touched.birthday && (
                    <div className="input-feedback">
                      <RiArrowRightSFill size="20" className="right-arrow" />
                      {errors.birthday}
                    </div>
                  )}
                </div>
                <p className="label-name">Your gender</p>
                <div className="field">
                  <div className="gender-radio-box">
                    <Field type="radio" name="gender" value="male" id="male" />
                    <label htmlFor="male">Male</label>
                    <Field type="radio" name="gender" value="female" id="female" />
                    <label htmlFor="female">Female</label>
                  </div>
                  {errors.gender && touched.gender && (
                    <div className="input-feedback">
                      <RiArrowRightSFill size="20" className="right-arrow" />
                      {errors.gender}
                    </div>
                  )}
                </div>
                <button type="submit" className="login-btn btn-success">
                  {resError.loading ? (
                    <div className="lds-ellipsis">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  ) : (
                    "Continue registration"
                  )}
                </button>
              </Form>
            </div>
          );
        }}
      </Formik>
    </>
  );
}

export default Register;
