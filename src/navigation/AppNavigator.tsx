import React from 'react';
import { Platform, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { LocationData } from '../api/weatherAPI';

// 定義導覽畫面的參數型別
export type RootStackParamList = {
    Search: { locationData?: LocationData }; // Search 頁可以接收一個可選的 LocationData 參數
    History: undefined; // History 頁不需要參數
};

// 方便在 Screen 元件中使用的 Props 型別
export type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;
export type HistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'History'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <NavigationContainer>
            <Stack.Navigator
                id={undefined}
                screenOptions={{
                    headerStyle: { backgroundColor: '#007cdb' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold', color: '#fff' },
                    ...Platform.select({
                        ios: {
                            headerTitleAlign: 'center',
                        },
                        android: {
                            headerTitleAlign: 'left',
                        },
                    }),

                }}
            >
                <Stack.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{ title: '查詢歷史', headerBackTitle: null }}
                />
            </Stack.Navigator>
        </NavigationContainer>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#007cdb',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    historyContainer: {
        backgroundColor: 'red', // 給一個鮮紅的背景色
        justifyContent: 'center',
        alignItems: 'center',
    },
});
