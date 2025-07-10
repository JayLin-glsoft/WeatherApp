import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { fetchWeather, fetchWeatherByHistory, saveHistory } from '../redux/weatherSlice';
import { SearchScreenProps } from '../navigation/AppNavigator';
import { useAppDispatch } from '../redux/hooks'; // 使用型別安全的 hook
import { RootState } from '../redux/store';
import HeaderInfo from '../components/HeaderInfo';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import { LocationData } from '../api/weatherAPI';
import { weatherIcons } from '../config/weatherIconsConfig';
import { cityMapping, englishToChineseMapping } from '../config/cityMapping';

export default function SearchScreen({ route, navigation }: SearchScreenProps) {
    const [city, setCity] = useState('');
    const dispatch = useAppDispatch();

    const { weatherData, loading, error } = useSelector((state: RootState) => state.weather);

    useEffect(() => {
        if (route.params?.locationData) {
            const cityFromHistory = route.params.locationData;
            const mappedCity = cityMapping[cityFromHistory.name.toLowerCase()] || cityFromHistory.name;
            setCity(cityFromHistory.name);
            handleSearchByHistory(cityFromHistory);
        }
    }, [route.params?.locationData]);

    const handleSearchByHistory = (locationData: LocationData) => {
        dispatch(fetchWeatherByHistory(locationData)).then(action => {
            if (fetchWeather.fulfilled.match(action)) {
                dispatch(saveHistory(action.payload.location));
            }
        });
    };

    const handleSearch = (searchCity: string) => {
        const finalCity = searchCity.trim();
        if (!finalCity) return;

        const mappedCity = cityMapping[finalCity.toLowerCase()] || finalCity;

        dispatch(fetchWeather(mappedCity)).then(action => {
            if (fetchWeather.fulfilled.match(action)) {
                dispatch(saveHistory(action.payload.location));
            }
        });
    };

    const handleGotoHistory = () => {
        navigation.navigate('History');
    }

    const mapWeatherIcon = (iconCode: string): keyof typeof weatherIcons => {
        if (iconCode.startsWith('01')) return 'sunny';
        if (['02d', '02n', '03d', '03n', '04d', '04n', '50d', '50n'].includes(iconCode)) return 'cloudy';
        if (['09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n'].includes(iconCode)) return 'rainy';
        return 'sunny';
    };

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
                <Pressable style={styles.historyContainer}>
                    <MaterialIcons name="history" size={24} color="#007cdb" onPress={handleGotoHistory} />
                </Pressable>
            </View>

            {loading === 'pending' && <ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 20 }} />}

            {error && <Text style={styles.errorText}>{error}</Text>}

            {weatherData && loading === 'succeeded' && (
                <View style={styles.weatherContainer}>
                    <HeaderInfo
                        name={englishToChineseMapping[weatherData.location.name.toLowerCase()] || weatherData.location.name}
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
});
