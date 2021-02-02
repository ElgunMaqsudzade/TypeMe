const reducer = (state, action) => {
  const { payload, type } = action;
  if (type === "SEARCH") {
    const newUsers = payload.data.users.filter((user) =>
      user.username.toLowerCase().includes(payload.searchValue)
    );
    return { ...state, users: newUsers };
  }
  return state;
};
export default reducer;
