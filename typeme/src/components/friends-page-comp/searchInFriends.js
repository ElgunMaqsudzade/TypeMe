import React, { useState, useRef } from "react";
import { Icon16SearchOutline } from "@vkontakte/icons";
import { IoMdArrowDropup } from "react-icons/io";
import "../../sass/_searchInFriends.scss";
import useOutsideClick from "../customHooks/showHide";
import genders from "../../data/genderdata";

function SearchInFriends({ setSearchKeyword, searchkeyword, setSearchParameters }) {
  const [showSearchSettings, setShowSearchSettings] = useState(false);

  const refSettings = useRef(null);

  useOutsideClick(refSettings, () => {
    if (showSearchSettings) {
      setShowSearchSettings(false);
    }
  });
  return (
    <>
      <div className="search-bar">
        <Icon16SearchOutline className="search-icon" />
        <input
          autoFocus
          type="text"
          className="search-inp"
          placeholder="Search friends"
          value={searchkeyword}
          onChange={(e) => setSearchKeyword(e.target.value.toLowerCase())}
        />
        <div className="search-settings">
          <button
            className="settings-title"
            onClick={() => setShowSearchSettings(!showSearchSettings)}
          >
            Parameters
          </button>
          {showSearchSettings && (
            <ul className="settings" ref={refSettings}>
              <IoMdArrowDropup className="arrow-up" />
              <li className="setting-item gender">
                <div className="title">Gender</div>
                {genders.map((gender) => {
                  const { id, value } = gender;
                  return (
                    <div key={id} className="radio-item">
                      <input
                        type="radio"
                        value={value}
                        name="gender"
                        id={value}
                        defaultChecked={value === "any" && true}
                        onChange={(e) =>
                          setSearchParameters((prev) => {
                            return { ...prev, gender: e.target.value };
                          })
                        }
                      />
                      <label htmlFor={value}>{value}</label>
                    </div>
                  );
                })}
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchInFriends;
