import React, { useRef } from "react";
import { Icon16SearchOutline } from "@vkontakte/icons";
import { IoMdArrowDropup } from "react-icons/io";
import "../../sass/_searchInFriends.scss";
import useOutsideClick from "../customHooks/showHide";
import genders from "../../data/genderdata";
import { useHistory } from "react-router-dom";

function SearchInFriends({
  showSearchSettings,
  setShowSearchSettings,
  searchkeyword,
  setSearchKeyword,
  setSearchParameters,
  searchParameters,
}) {
  const refSettings = useRef(null);
  const history = useHistory();

  useOutsideClick(refSettings, () => {
    if (showSearchSettings) {
      setShowSearchSettings(false);
    }
  });
  return (
    <>
      <div className="search-bar">
        <Icon16SearchOutline className="search-icon" />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            history.push(`/friends/find?keyword=${searchkeyword}`);
          }}
        >
          <input
            autoFocus
            type="text"
            className="search-inp"
            placeholder="Search friends"
            value={searchkeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value.toLowerCase());
            }}
          />
          <div className="search-settings">
            <button
              type="button"
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
                          defaultChecked={searchParameters.gender === value && true}
                          onChange={(e) =>
                            setSearchParameters({ ...searchParameters, gender: e.target.value })
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
        </form>
      </div>
    </>
  );
}

export default SearchInFriends;
