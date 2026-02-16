// features/user/userSlice.js

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  lan: "ru"
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    setLanguage(state, action) {
      state.lan = action.payload
    }
  }
})

export const { setUser, setLanguage } = userSlice.actions
export default userSlice.reducer
