import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWeatherDataAPI, WeatherData } from '../api/weatherAPI';
import { RootState } from './store';

const HISTORY_KEY = '@weatherHistory';

// 定義 state 的型別
interface WeatherState {
  weatherData: WeatherData | null;
  history: string[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WeatherState = {
  weatherData: null,
  history: [],
  loading: 'idle',
  error: null,
};

// 建立一個非同步 Thunk 來獲取天氣資料
export const fetchWeather = createAsyncThunk<WeatherData, string, { rejectValue: string }>(
  'weather/fetchWeather',
  async (city, { rejectWithValue }) => {
    try {
      const data = await fetchWeatherDataAPI(city);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 讀取歷史紀錄
export const loadHistory = createAsyncThunk<string[]>('weather/loadHistory', async () => {
  const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
  return historyJson ? JSON.parse(historyJson) : [];
});

// 儲存歷史紀錄
export const saveHistory = createAsyncThunk<string[], string, { state: RootState }>(
  'weather/saveHistory',
  async (cityName, { getState }) => {
    const { history } = getState().weather;
    const newHistory = [cityName, ...history.filter(item => item.toLowerCase() !== cityName.toLowerCase())].slice(0, 10);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  }
);

// 清除歷史紀錄
export const clearHistory = createAsyncThunk<string[]>('weather/clearHistory', async () => {
  await AsyncStorage.removeItem(HISTORY_KEY);
  return [];
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
        state.weatherData = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
        state.loading = 'succeeded';
        state.weatherData = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload ?? '發生未知錯誤';
      })
      .addCase(loadHistory.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.history = action.payload;
      })
      .addCase(saveHistory.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.history = action.payload;
      })
      .addCase(clearHistory.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.history = action.payload;
      });
  },
});

export default weatherSlice.reducer;