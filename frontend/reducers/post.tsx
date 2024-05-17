import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const initialState = {};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder,
});

export default postSlice;
