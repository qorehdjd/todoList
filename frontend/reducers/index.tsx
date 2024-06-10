import { combineReducers } from 'redux';
import axios from 'axios';

import userSlice from './user';
import postSlice from './post';

axios.defaults.baseURL = 'https://api.count101.shop:3085';
axios.defaults.withCredentials = true;
const rootReducer = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
});

export default rootReducer;
