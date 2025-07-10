// 從環境變數讀取 API 金鑰
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

// 確保 API 金鑰存在
if (!API_KEY) {
  throw new Error('請在 .env 檔案中設定您的 OpenWeatherMap API 金鑰 (EXPO_PUBLIC_WEATHER_API_KEY)');
}
const API_2_5_URL = (city: string) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=zh_tw`;
const API_3_0_URL = (lon: number, lat: number) => `https://api.openweathermap.org/data/3.0/onecall?lon=${lon}&lat=${lat}&exclude=minutely&appid=${API_KEY}&units=metric&lang=zh_tw`;

// 直接收尋用的，會先呼叫 API_2_5_URL 取得 GPS 資訊，再呼叫 API_3_0_URL 取得天氣資料
export const fetchWeatherDataAPI = async (city: string): Promise<WeatherDataWithLocation> => {
    // 使用城市名稱查詢 GPS 資訊
    const response = await fetch(API_2_5_URL(city));
    if (!response.ok) {
        throw new Error('找不到該城市的資訊');
    }
    const data: LocationData = await response.json();
    // 改存使用者輸入的地名
    data.name = city;
    // 使用 GPS 資訊查詢天氣資料
    const weatherDataWithLocation = await fetchWeatherDataAPIByLocation(data);
    return weatherDataWithLocation;
};

// 用於歷史紀錄的查詢，直接使用歷史紀錄的 GPS 資訊查詢天氣資料
export const fetchWeatherDataAPIByLocation = async (locationData: LocationData): Promise<WeatherDataWithLocation> => {
    // 使用 GPS 資訊查詢天氣資料
    const weatherResponse = await fetch(API_3_0_URL(locationData.coord.lon, locationData.coord.lat));
    if (!weatherResponse.ok) {
        throw new Error('無法獲取天氣資料');
    }
    const weatherData: WeatherData = await weatherResponse.json();
    // 將位置資訊添加到天氣資料中
    const weatherDataWithLocation: WeatherDataWithLocation = {
        ...weatherData,
        location: {
            coord: locationData.coord,
            name: locationData.name,
        }
    };
    return weatherDataWithLocation;
};

// 定義 API 回傳資料的型別
export interface LocationData {
    coord: {
        lon: number;
        lat: number;
    };
    name: string;
}

// 天氣狀況的通用介面
export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

// 降雨量的介面
export interface RainInfo {
    '1h': number;
}

// 當前天氣資訊的介面
export interface CurrentWeather {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number; 
    weather: WeatherCondition[];
    rain?: RainInfo; 
}

// 小時預報的介面
export interface HourlyForecast extends CurrentWeather {
    pop: number; // 降雨機率
}

// 每日溫度的介面
export interface DailyTemp {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
}

// 每日體感溫度的介面
export interface DailyFeelsLike {
    day: number;
    night: number;
    eve: number;
    morn: number;
}

// 每日預報的介面
export interface DailyForecast {
    dt: number;
    sunrise: number;
    sunset: number;

    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: DailyTemp;
    feels_like: DailyFeelsLike;
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: WeatherCondition[];
    clouds: number;
    pop: number;
    rain?: number; // 每日的 rain 是 number 而不是物件
    uvi: number;
}

// 主要天氣資料的根介面
export interface WeatherData {
    timezone: string;
    timezone_offset: number;
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
}

export interface WeatherDataWithLocation extends WeatherData {
    location: LocationData;
}