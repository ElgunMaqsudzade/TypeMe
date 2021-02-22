const reducer = (state, action) => {
  const { payload, type } = action;
  if (type === "CREATE_TEXT") {
    return { ...state, createText: payload };
  }

  return state;
};
export default reducer;
