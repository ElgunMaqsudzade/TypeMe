import React from "react";
import "../sass/_register.scss";
import DatePicker from "react-date-picker";
import { Icon20CalendarOutline, Icon16Cancel } from "@vkontakte/icons";
function Register({ birthday, setBirthday }) {
  let date = new Date();
  date.setFullYear(date.getFullYear() - 100);
  return (
    <div className="register">
      <h4 className="register-title">First time here?</h4>
      <p className="register-subtitle">Sign up for VK</p>
      <form className="register-form" action="">
        <input type="text" className="reg-inp" placeholder="Your first name" />
        <input type="text" className="reg-inp" placeholder="Your first name" />
        <input type="text" className="reg-inp" placeholder="Your email address" />
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
          <input type="radio" name="gender" id="male" />
          <label htmlFor="male">Male</label>
          <input type="radio" name="gender" id="female" />
          <label htmlFor="female">Female</label>
        </div>
        <button className="login-btn btn-success">Continue registration</button>
      </form>
    </div>
  );
}

export default Register;
