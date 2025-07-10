import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWeatherDataAPI, fetchWeatherDataAPIByLocation, WeatherDataWithLocation, LocationData } from '../api/weatherAPI';
import { RootState } from './store';

const HISTORY_KEY = '@weatherHistory';

// 定義 state 的型別
interface WeatherState {
    weatherData: WeatherDataWithLocation | null;
    history: LocationData[];
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

// 定義 state 的初始值
const initialState: WeatherState = {
    weatherData: null,
    history: [],
    loading: 'idle',
    error: null,
};

// 建立一個 AsyncThun 來獲取天氣資料(用戶輸入的地名)
export const fetchWeather = createAsyncThunk<WeatherDataWithLocation, string, { rejectValue: string }>(
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

// 建立一個 AsyncThunk 來獲取天氣資料(歷史紀錄的地名)
export const fetchWeatherByHistory = createAsyncThunk<WeatherDataWithLocation, LocationData, { rejectValue: string }>(
    'weather/fetchWeatherByHistory',
    async (history, { rejectWithValue }) => {
        try {
            const data = await fetchWeatherDataAPIByLocation(history);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 讀取歷史紀錄
export const loadHistory = createAsyncThunk<LocationData[]>('weather/loadHistory', async () => {
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
});

// 儲存歷史紀錄
export const saveHistory = createAsyncThunk<LocationData[], LocationData, { state: RootState }>(
    'weather/saveHistory',
    async (locationData, { getState }) => {
        const { history } = getState().weather;
        // 把新的放前面，並移除相同名稱的紀錄
        const newHistory = [
            locationData,
            ...history.filter(item => item.name.toLowerCase() !== locationData.name.toLowerCase())
        ];
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
    }
);

// 清除歷史紀錄
export const clearHistory = createAsyncThunk<LocationData[]>('weather/clearHistory', async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return [];
});

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    // 處理「這支 slice 自己定義的 action」（通常是同步行為）。
    reducers: {},
    // 處理「其它地方產生的 action」（常見於 asyncThunk、外部 action），允許 slice 對這些 action 做反應。
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
                state.weatherData = null;
            })
            .addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherDataWithLocation>) => {
                state.loading = 'succeeded';
                state.weatherData = action.payload;
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload ?? '發生未知錯誤';
            })
            .addCase(fetchWeatherByHistory.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
                state.weatherData = null;
            })
            .addCase(fetchWeatherByHistory.fulfilled, (state, action: PayloadAction<WeatherDataWithLocation>) => {
                state.loading = 'succeeded';
                state.weatherData = action.payload;
            })
            .addCase(fetchWeatherByHistory.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload ?? '發生未知錯誤';
            })
            .addCase(loadHistory.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
                state.history = action.payload;
            })
            .addCase(saveHistory.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
                state.history = action.payload;
            })
            .addCase(clearHistory.fulfilled, (state, action: PayloadAction<LocationData[]>) => {
                state.history = action.payload;
            });
    },
});

export default weatherSlice.reducer;