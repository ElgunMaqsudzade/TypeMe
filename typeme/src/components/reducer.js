const reducer = (state, action) => {
  const { payload, type } = action;
  if (type === "CREATE_TEXT") {
    return { ...state, createText: payload };
  }
  if (type === "USER_DATA") {
    return { ...state, user: payload };
  }
  if (type === "OLD_USERS") {
    localStorage.setItem("oldusers", JSON.stringify(localStorage.getItem("oldusers") + payload));
    return { ...state };
  }

  return state;
};
export default reducer;
