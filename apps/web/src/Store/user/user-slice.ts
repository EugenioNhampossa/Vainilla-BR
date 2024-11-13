import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    role: '',
  },
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
