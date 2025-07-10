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

const initialState: WeatherState = {
    weatherData: null,
    history: [],
    loading: 'idle',
    error: null,
};

// 建立一個非同步 Thunk 來獲取天氣資料
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
        const newHistory = [
            locationData,
            ...history.filter(item => item.name.toLowerCase() !== locationData.name.toLowerCase())
        ].slice(0, 10);
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
    reducers: {},
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