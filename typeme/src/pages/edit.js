import React, { useState, useRef, useEffect, createRef } from "react";
import outside from "../components/customHooks/showHide";
import DatePicker from "react-date-picker";
import { Icon20CalendarOutline, Icon16Cancel, Icon20Dropdown } from "@vkontakte/icons";
import "../sass/_edit.scss";
import Editsidebar from "../components/editsidebar";
function Edit() {
  const [showLanguages, setShowLanguages] = useState(false);
  const [birthday, setBirthDay] = useState("");
  const languagesRef = useRef(null);

  outside(languagesRef, () => {
    if (showLanguages) {
      setShowLanguages(false);
    }
  });
  return (
    <div className="row">
      {" "}
      <div className="col-8">
        <div className="edit-section mCard">
          <div className="topside">Basic info</div>
          <div className="info">
            <form className="register-form">
              <div className="full-item">
                <div className="item">
                  <div className="item-key">First name:</div>
                  <input
                    type="text"
                    name="name"
                    className="info-inp"
                    placeholder="Your first name"
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
                  />
                </div>
              </div>
              <div className="full-item">
                <div className="item">
                  <div className="item-key">Birthday:</div>
                  <DatePicker
                    value={birthday}
                    onChange={setBirthDay}
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
                </div>
              </div>
              <div className="full-item">
                <div className="item">
                  <div className="item-key">Gender:</div>
                  <div className="gender-radio-box">
                    <input type="radio" name="gender" value="male" id="male" />
                    <label htmlFor="male">Male</label>
                    <input type="radio" name="gender" value="female" id="female" />
                    <label htmlFor="female">Female</label>
                  </div>
                </div>
              </div>
              <div className="full-item">
                <div className="item">
                  <div className="item-key">Languages:</div>
                  <div ref={languagesRef} className="info-inp">
                    {true ? <div className="text-muted">Select language</div> : "ds"}
                    <Icon20Dropdown
                      className="dropdown-icon"
                      onClick={() => setShowLanguages(!showLanguages)}
                    />
                    {showLanguages && (
                      <div className="list">
                        <div className="list-item">SDA</div>
                        <div className="list-item">ddsa</div>
                        <div className="list-item">dsad</div>
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
      </div>
      <div className="col-4">
        <Editsidebar />
      </div>
    </div>
  );
}

export default Edit;
