// features/user/userSlice.js

import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  account: null,
  lan: "ru"
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.account = action.payload
    },
    setLanguage(state, action) {
      state.lan = action.payload
    }
  }
})

export const { setUser, setLanguage } = userSlice.actions
export default userSlice.reducer
