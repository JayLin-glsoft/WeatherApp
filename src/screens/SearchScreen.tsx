import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { fetchWeather, saveHistory } from '../redux/weatherSlice';
import { SearchScreenProps } from '../navigation/AppNavigator';
import { useAppDispatch } from '../redux/hooks'; // 使用型別安全的 hook
import { RootState } from '../redux/store';
import HeaderInfo from '../components/HeaderInfo';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';

export default function SearchScreen({ route, navigation }: SearchScreenProps) {
    console.log(`[${new Date().toLocaleTimeString()}] 👻 SearchScreen: 元件正在渲染...`);
    const [city, setCity] = useState('');
    const dispatch = useAppDispatch();

    const { weatherData, loading, error } = useSelector((state: RootState) => state.weather);

    useEffect(() => {
        if (route.params?.city) {
            const cityFromHistory = route.params.city;
            setCity(cityFromHistory);
            handleSearch(cityFromHistory);
        }
    }, [route.params?.city]);

    useLayoutEffect(() => {
        console.log(`[${new Date().toLocaleTimeString()}] 👻 SearchScreen: useLayoutEffect 被觸發了！`);
    }, []);

    const handleSearch = (searchCity: string) => {
        const finalCity = searchCity.trim();
        if (!finalCity) return;
        dispatch(fetchWeather(finalCity)).then(action => {
            if (fetchWeather.fulfilled.match(action)) {
                dispatch(saveHistory(action.payload.name));
            }
        });
    };

    const handleGotoHistory = () => {
        navigation.navigate('History');
    }

    return (
        <View style={styles.pageContainer}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="輸入城市名稱 (例如: Taipei)"
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
                    <HeaderInfo />
                    <CurrentWeather />
                    <View style={styles.weatherHourlyCard}>
                        <HourlyForecast time='4 PM' icon='sunny' temp='28' />
                        <HourlyForecast time='5 PM' icon='cloudy' temp='26' />
                        <HourlyForecast time='6 PM' icon='rainy' temp='26' />
                        <HourlyForecast time='7 PM' icon='rainy' temp='25' />
                    </View>
                    <ScrollView style={styles.weatherDaily}>
                        <View>
                            <DailyForecast
                                day='Tuesday'
                                icon='rainy'
                                tempHigh='73'
                                tempLow='60'
                            />
                            <DailyForecast
                                day='Wednesday'
                                icon='cloudy'
                                tempHigh='75'
                                tempLow='62'
                            />
                            <DailyForecast
                                day='Thursday'
                                icon='sunny'
                                tempHigh='77'
                                tempLow='64'
                            />
                            <DailyForecast day='Friday' icon='sunny' tempHigh='79' tempLow='65' />
                            <DailyForecast
                                day='Saturday'
                                icon='sunny'
                                tempHigh='81'
                                tempLow='66'
                            />
                            <DailyForecast day='Sunday' icon='sunny' tempHigh='82' tempLow='67' />
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
        borderRadius: 8,
        marginTop: 16,
        elevation: 5,
        backgroundColor: '#007cdb'
    },
    weatherHourlyCard: {
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        flexDirection: 'row', // 將子元件水平排列
        justifyContent: 'space-around', // 均勻分佈子元件
    },
    weatherDaily: {
        marginTop: 16,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    cityName: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    temperature: {
        fontSize: 64,
        fontWeight: '200',
        marginVertical: 8,
        color: '#1e90ff'
    },
    description: {
        fontSize: 20,
        textTransform: 'capitalize'
    },
    humidity: {
        fontSize: 16,
        color: '#666',
        marginTop: 8
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
