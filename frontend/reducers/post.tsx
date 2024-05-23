import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { CustomError } from '../types/error';

export interface Item {
  count: number;
  title: string;
  _id: string;
}

export interface List {
  date: string;
  userId: string;
  _id: string;
  items: Item[];
}

export interface InitailState {
  date: string;
  posts: { lists: List[]; dateLists: { _id: string; title: string; count: number }[] };
  saveListLoading: boolean;
  saveListDone: boolean;
  saveListError: boolean | any;
  getDateListLoading: boolean;
  getDateListDone: boolean;
  getDateListError: boolean | any;
  getListsLoading: boolean;
  getListsDone: boolean;
  getListsError: boolean | any;
}

export const initialState: InitailState = {
  date: '',
  posts: {
    lists: [], // 달력페이지 모든 list들을 가져옴
    dateLists: [], // 날짜 별로 클릭했을 때 list들
  },
  saveListLoading: false,
  saveListDone: false,
  saveListError: false,
  getDateListLoading: false, // 달력 날짜 클릭했을 때 가져올 데이터 list
  getDateListDone: false,
  getDateListError: false,
  getListsLoading: false, // 첫 달력에서 로딩됐을 때 가져올 전체 데이터 list
  getListsDone: false,
  getListsError: false,
};

export const saveList = createAsyncThunk(
  'save/list',
  async (data: { dateLists: { title: string; count: number }[]; date: string }, thunkAPI) => {
    try {
      const response = await axios.post('/post', data);
      return response.data;
    } catch (err) {
      const customErr = err as CustomError;
      return thunkAPI.rejectWithValue(customErr.response?.data || customErr.message);
    }
  },
);

export const getDateList = createAsyncThunk('get/datelist', async (date: string, thunkAPI) => {
  try {
    const response = await axios.get(`/post?date=${date}`);
    return response.data;
  } catch (err) {
    const customErr = err as CustomError;
    return thunkAPI.rejectWithValue(customErr.response?.data || customErr.message);
  }
});

export const getLists = createAsyncThunk('get/lists', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/posts');
    return response.data;
  } catch (err) {
    const customErr = err as CustomError;
    return thunkAPI.rejectWithValue(customErr.response?.data || customErr.message);
  }
});

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addlist(state, action) {
      const list = state.posts.dateLists.find((list) => list.title === action.payload.title);
      if (list) {
        list.count = list.count + 1;
        return;
      }
      state.posts.dateLists.push(action.payload);
    },
    increaseCount(state, action) {
      const list = state.posts.dateLists.find((list) => list.title === action.payload);
      if (list) list.count += 1;
    },
    decreaseCount(state, action) {
      const list = state.posts.dateLists.find((list) => list.title === action.payload);
      if (list) list.count -= 1;
    },
    deleteList(state, action) {
      const lists = state.posts.dateLists.filter((list) => list.title !== action.payload);
      state.posts.dateLists = lists;
    },
    reviseDate(state, action) {
      state.date = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(saveList.pending, (state) => {
        state.saveListLoading = true;
        state.saveListDone = false;
        state.saveListError = false;
      })
      .addCase(saveList.fulfilled, (state, action) => {
        state.saveListLoading = false;
        state.saveListDone = true;
        state.posts.dateLists = action.payload.dateLists.items;
      })
      .addCase(saveList.rejected, (state, action) => {
        state.saveListLoading = false;
        state.saveListError = action.payload;
      })
      .addCase(getDateList.pending, (state) => {
        state.getDateListLoading = true;
        state.getDateListDone = false;
        state.getDateListError = false;
      })
      .addCase(getDateList.fulfilled, (state, action) => {
        state.getDateListLoading = false;
        state.getDateListDone = true;
        state.posts.dateLists = action.payload.lists;
      })
      .addCase(getDateList.rejected, (state, action) => {
        state.getDateListLoading = false;
        state.getDateListError = action.payload;
      })
      .addCase(getLists.pending, (state) => {
        state.getDateListLoading = true;
        state.getDateListDone = false;
        state.getDateListError = false;
      })
      .addCase(getLists.fulfilled, (state, action) => {
        state.getListsLoading = false;
        state.getListsDone = true;
        state.posts.lists = action.payload;
      })
      .addCase(getLists.rejected, (state, action) => {
        state.getListsLoading = false;
        state.getListsError = action.payload;
      }),
});

export default postSlice;
