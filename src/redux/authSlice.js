import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  password: "",
  token: "",
  userId: "",
  role: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { username, password, token, userId, role } = action.payload;
      state.username = username || state.username;
      state.password = password || state.password;
      state.token = token || state.token;
      state.userId = userId || state.userId;
      state.role = role || state.role;
    },

    logout: (state) => {
      state.username = "";
      state.password = "";
      state.token = "";
      state.userId = "";
      state.role = "";
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;