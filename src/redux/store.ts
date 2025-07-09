import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});

// 從 store 本身推斷出 `RootState` 和 `AppDispatch` 的型別
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;