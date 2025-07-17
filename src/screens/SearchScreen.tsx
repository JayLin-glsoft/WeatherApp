import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchWeather, fetchWeatherByHistory, fetchWeatherByGPS, saveHistory } from '../redux/weatherSlice';
import { SearchScreenProps } from '../navigation/AppNavigator';
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../redux/store';
import HeaderInfo from '../components/HeaderInfo';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import { weatherIcons } from '../config/weatherIconsConfig';
import { cityNameMap} from '../config/cityMapping';

export default function SearchScreen({ route, navigation }: SearchScreenProps) {
    // 使用 useState 來管理輸入的城市名稱
    const [city, setCity] = useState('');
    // 使用 Redux 的 dispatch (透過 hooks)
    const dispatch = useDispatch<AppDispatch>();
    // 從 Redux store 中選擇需要的狀態 (透過 hooks)
    const { weatherData, loading, error } = useSelector((state: RootState) => state.weather);

    // 定義一個通用的搜尋處理函數，接受 actionCreator 作為參數
    const handleSearchAction = (actionCreator: any) => (searchParam: any) => {
        dispatch(actionCreator(searchParam)).then((action: any) => {
            if (action.meta.requestStatus === 'fulfilled') {
                // 當前位置不存到紀錄裡
                if (action.payload.location.name !== '當前位置') {
                    dispatch(saveHistory(action.payload.location));
                }
            }
        });
    };

    // 使用通用的搜尋處理函數來處理城市搜尋和歷史紀錄搜尋
    const handleSearchByCity = handleSearchAction(fetchWeather);
    const handleSearchByHistory = handleSearchAction(fetchWeatherByHistory);
    const handleSearchByGPS = handleSearchAction(fetchWeatherByGPS);

    // 處理搜尋按鈕點擊事件
    const handleSearch = (searchCity: string) => {
        const finalCity = searchCity.trim();
        if (!finalCity) return;

        // 將輸入的城市名稱轉為小寫，並使用對照表進行映射
        const mappedCity = cityNameMap.zhToEn[finalCity] || finalCity;

        handleSearchByCity(mappedCity);
    };

    const handleGotoHistory = () => {
        navigation.navigate('History');
    }

    // 將天氣圖示代碼映射到對應的圖示名稱
    const mapWeatherIcon = (iconCode: string): keyof typeof weatherIcons => {
        if (iconCode.startsWith('01')) return 'sunny';
        if (['02d', '02n', '03d', '03n', '04d', '04n', '50d', '50n'].includes(iconCode)) return 'cloudy';
        if (['09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n'].includes(iconCode)) return 'rainy';
        return 'sunny';
    };

    // 將 Unix 時間戳轉換為指定格式的日期、時間或星期幾
    const formatUnixTime = (unixTime: number, format: 'date' | 'time' | 'day') => {
        const date = new Date(unixTime * 1000);
        switch (format) {
            case 'date':
                return date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
            case 'time':
                return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', '');
            case 'day':
                return date.toLocaleDateString('zh-TW', { weekday: 'long' });
            default:
                return '';
        }
    };

    // 如果有從歷史紀錄頁面傳來的城市資料，則自動填入並搜尋
    useEffect(() => {
        if (route.params?.locationData) {
            const cityFromHistory = route.params.locationData;
            const mappedCity = cityNameMap.enToZh[cityFromHistory.name.toLowerCase()] || cityFromHistory.name;
            setCity(mappedCity);
            handleSearchByHistory(cityFromHistory);
        }
    }, [route.params?.locationData]);

    return (
        <View style={styles.pageContainer}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="輸入城市名稱 (例如: 臺中)"
                    value={city}
                    onChangeText={setCity}
                    onSubmitEditing={() => handleSearch(city)}
                />
                <Pressable style={styles.searchButton} onPress={() => handleSearch(city)}>
                    <Text style={styles.searchButtonText}>搜尋</Text>
                </Pressable>
                <Pressable style={styles.iconButton} onPress={handleSearchByGPS}>
                    <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#007cdb" />
                </Pressable>
                <Pressable style={styles.historyContainer}>
                    <MaterialIcons name="history" size={24} color="#007cdb" onPress={handleGotoHistory} />
                </Pressable>
            </View>

            {/* 左邊的判別式為 true 或是物件不為空，才會渲染右邊的 UI */}
            {loading === 'pending' && <ActivityIndicator size="large" color="#007cdb" style={{ marginTop: 36 }} />}

            {error && <Text style={styles.errorText}>{error}</Text>}

            {weatherData && loading === 'succeeded' && (
                <View style={styles.weatherContainer}>
                    <HeaderInfo
                        name={cityNameMap.enToZh[weatherData.location.name.toLowerCase()] || weatherData.location.name}
                        day={formatUnixTime(weatherData.current.dt, 'date')}
                    />
                    <CurrentWeather
                        icon={mapWeatherIcon(weatherData.current.weather[0].icon)}
                        temp={Math.round(weatherData.current.temp).toString()}
                        description={weatherData.current.weather[0].description}
                    />
                    <View style={styles.weatherHourlyCard}>
                        {weatherData.hourly.slice(0, 4).map((hour, index) => (
                            <HourlyForecast
                                key={index}
                                time={formatUnixTime(hour.dt, 'time')}
                                icon={mapWeatherIcon(hour.weather[0].icon)}
                                temp={Math.round(hour.temp).toString()}
                            />
                        ))}
                    </View>
                    <ScrollView style={styles.weatherDaily} showsVerticalScrollIndicator={false}>
                        <View>
                            {weatherData.daily.slice(0, 7).map((day, index) => (
                                <DailyForecast
                                    key={index}
                                    day={formatUnixTime(day.dt, 'day')}
                                    icon={mapWeatherIcon(day.weather[0].icon)}
                                    tempHigh={Math.round(day.temp.max).toString()}
                                    tempLow={Math.round(day.temp.min).toString()}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f8ff'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 16
    },
    weatherContainer: {
        flex: 1,
        padding: 16,
        borderRadius: 15,
        marginTop: 16,
        elevation: 5,
        backgroundColor: '#007cdb'
    },
    weatherHourlyCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        elevation: 5,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row', // 將元件水平排列
        justifyContent: 'space-between', // 均勻分佈元件
    },
    weatherDaily: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 16,
    },
    searchButton: {
        backgroundColor: '#007cdb',
        padding: 8,
        borderRadius: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
    historyContainer: {
        paddingLeft: 8,
    },
    iconButton: {
        paddingLeft: 8,
    }
});
