import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchWeather, saveHistory } from '../redux/weatherSlice';
import { SearchScreenProps } from '../navigation/AppNavigator';
import { useAppDispatch } from '../redux/hooks'; // 使用型別安全的 hook
import { RootState } from '../redux/store';
import { MaterialIcons } from '@expo/vector-icons';

export default function SearchScreen({ route, navigation }: SearchScreenProps) {
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

    const handleSearch = (searchCity: string) => {
        const finalCity = searchCity.trim();
        if (!finalCity) return;
        dispatch(fetchWeather(finalCity)).then(action => {
            if (fetchWeather.fulfilled.match(action)) {
                dispatch(saveHistory(action.payload.name));
            }
        });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '天氣查詢',
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                    <MaterialIcons name="history" size={28} color="#fff" />
                </TouchableOpacity>
            ),
        });
    }, [navigation])

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
                <Button title="搜尋" onPress={() => handleSearch(city)} />
            </View>

            {loading === 'pending' && <ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 20 }} />}

            {error && <Text style={styles.errorText}>{error}</Text>}

            {weatherData && loading === 'succeeded' && (
                <View style={styles.weatherCard}>
                    <Text style={styles.cityName}>{weatherData.name}</Text>
                    <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
                    <Text style={styles.description}>{weatherData.weather[0].description}</Text>
                    <Text style={styles.humidity}>濕度: {weatherData.main.humidity}%</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: { flex: 1, padding: 20, backgroundColor: '#f0f8ff' },
    inputContainer: { flexDirection: 'row', alignItems: 'center' },
    textInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, marginRight: 10, borderRadius: 8, backgroundColor: '#fff', fontSize: 16 },
    errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
    weatherCard: { marginTop: 30, backgroundColor: '#fff', borderRadius: 15, padding: 25, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
    cityName: { fontSize: 28, fontWeight: 'bold' },
    temperature: { fontSize: 64, fontWeight: '200', marginVertical: 10, color: '#1e90ff' },
    description: { fontSize: 20, textTransform: 'capitalize' },
    humidity: { fontSize: 16, color: '#666', marginTop: 10 },
});
