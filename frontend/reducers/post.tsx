import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { CustomError } from '../types/error';

export interface InitailState {
  date: string;
  lists: { title: string; count: number }[];
  saveDataLoading: boolean;
  saveDataDone: boolean;
  saveDataError: boolean;
}

export const initialState: InitailState = {
  date: '',
  lists: [],
  saveDataLoading: false,
  saveDataDone: false,
  saveDataError: false,
};

export const saveData = createAsyncThunk(
  'save/post',
  async (data: { lists: { title: string; count: number }[]; date: string }, thunkAPI) => {
    try {
      const response = await axios.post('/post', data);
      return response.data;
    } catch (err) {
      const customErr = err as CustomError;
      return thunkAPI.rejectWithValue(customErr.response?.data || customErr.message);
    }
  },
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addlist(state, action) {
      const list = state.lists.find((list) => list.title === action.payload.title);
      if (list) {
        list.count = list.count + 1;
        return;
      }
      state.lists.push(action.payload);
    },
    increaseCount(state, action) {
      const list = state.lists.find((list) => list.title === action.payload);
      if (list) list.count += 1;
    },
    decreaseCount(state, action) {
      const list = state.lists.find((list) => list.title === action.payload);
      if (list) list.count -= 1;
    },
    deleteList(state, action) {
      const lists = state.lists.filter((list) => list.title !== action.payload);
      state.lists = lists;
    },
    reviseDate(state, action) {
      state.date = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(saveData.pending, (state) => {
      state.saveDataLoading = true;
      state.saveDataDone = false;
      state.saveDataError = false;
    }),
});

export default postSlice;
