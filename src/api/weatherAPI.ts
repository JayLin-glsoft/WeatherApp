// 定義 API 回傳資料的型別
export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

// 在真實應用中，您會需要一個 API Key。這裡我們模擬 API 回應。
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // 請替換成您的 OpenWeatherMap API Key
const API_URL = (city: string) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=zh_tw`;

export const fetchWeatherDataAPI = async (city: string): Promise<WeatherData> => {
  // 如果沒有 API Key，我們會回傳一個假的成功或失敗回應
  if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
    console.log('偵測到使用模擬 API');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lowerCaseCity = city.toLowerCase();
        if (lowerCaseCity === 'taipei' || lowerCaseCity === '臺北') {
          resolve({
            name: '臺北市',
            main: { temp: 28.5, humidity: 75 },
            weather: [{ description: '晴時多雲', icon: '02d' }],
          });
        } else if (lowerCaseCity === 'tokyo' || lowerCaseCity === '東京') {
           resolve({
            name: '東京都',
            main: { temp: 25.0, humidity: 60 },
            weather: [{ description: '晴天', icon: '01d' }],
          });
        } else {
          reject(new Error(`找不到城市 "${city}"`)); // 模擬找不到城市
        }
      }, 1000);
    });
  }

  // 真實的 API 請求
  const response = await fetch(API_URL(city));
  if (!response.ok) {
    throw new Error('找不到該城市的天氣資訊');
  }
  const data: WeatherData = await response.json();
  return data;
};
