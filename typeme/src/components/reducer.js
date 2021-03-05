const Reducer = (state, action) => {
  const { payload, type } = action;
  if (type === "CREATE_TEXT") {
    return { ...state, createText: payload };
  }
  if (type === "USER_DATA") {
    return { ...state, user: payload.user, token: `Bearer ${payload.token}` };
  }

  return { ...state };
};
export default Reducer;
