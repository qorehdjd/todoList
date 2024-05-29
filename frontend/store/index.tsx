/// <reference types="redux-persist" />

import { EnhancedStore, Store, configureStore } from '@reduxjs/toolkit';
import reducer from '../reducers';
// import { MakeStore, createWrapper } from 'next-redux-wrapper';
import storage from 'redux-persist/lib/storage/session';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// const setupStore = (context: any): EnhancedStore => store;

// const makeStore: MakeStore<any> = (context: any) => setupStore(context);

export const persistor = persistStore(store);

// const wrapper = createWrapper<Store>(makeStore, {
//   debug: process.env.NODE_ENV === 'development',
// });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
