import React, { useState, useEffect } from "react";
import "../sass/_register.scss";
import DatePicker from "react-date-picker";
import { Icon20CalendarOutline, Icon16Cancel } from "@vkontakte/icons";
function Register() {
  const [birthday, setBirthday] = useState(null);
  const [user, setUser] = useState({
    name: null,
    surname: null,
    gender: null,
    email: null,
    password: null,
    checkpassword: null,
    birthday: null,
  });
  useEffect(() => {
    if (birthday != null) {
      setUser({
        ...user,
        birthday: `${birthday.getDate()}-${birthday.getMonth() + 1}-${birthday.getFullYear()}`,
      });
    }
  }, [user, birthday]);
  let date = new Date();
  date.setFullYear(date.getFullYear() - 100);

  const RegisterSubmitHandler = (e) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <div className="register">
      <h4 className="register-title">Sign up for VK</h4>
      <form className="register-form" onSubmit={RegisterSubmitHandler}>
        <input
          type="text"
          className="reg-inp"
          placeholder="Your first name"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="text"
          className="reg-inp"
          placeholder="Your last name"
          onChange={(e) => setUser({ ...user, surname: e.target.value })}
        />
        <input
          type="text"
          className="reg-inp"
          placeholder="Your email address"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          className="reg-inp"
          placeholder="Enter your password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <input
          type="password"
          className="reg-inp"
          placeholder="Re-enter your password"
          onChange={(e) => setUser({ ...user, checkpassword: e.target.value })}
        />
        <p className="label-name">Birthday</p>
        <DatePicker
          onChange={setBirthday}
          value={birthday}
          dayPlaceholder="Day"
          monthPlaceholder="Month"
          yearPlaceholder="Year"
          className="birthday-box"
          calendarClassName="calendar"
          maxDate={new Date()}
          minDate={date}
          calendarIcon={<Icon20CalendarOutline className="icon" />}
          clearIcon={<Icon16Cancel className="icon" />}
        />
        <p className="label-name">Your gender</p>
        <div className="gender-radio-box">
          <input
            type="radio"
            name="gender"
            id="male"
            onChange={() => setUser({ ...user, gender: "male" })}
          />
          <label htmlFor="male">Male</label>
          <input
            type="radio"
            name="gender"
            id="female"
            onChange={() => setUser({ ...user, gender: "female" })}
          />
          <label htmlFor="female">Female</label>
        </div>
        <button className="login-btn btn-success">Continue registration</button>
      </form>
    </div>
  );
}

export default Register;
