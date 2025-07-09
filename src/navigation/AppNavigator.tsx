import React from 'react';
import { TouchableOpacity, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import SearchScreen from '../screens/SearchScreen';
import HistoryScreen from '../screens/HistoryScreen';

// 定義導覽畫面的參數型別
export type RootStackParamList = {
    Search: { city?: string }; // Search 頁可以接收一個可選的 city 參數
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
                    initialRouteName="Search"
                    screenOptions={{
                        headerStyle: { backgroundColor: '#1e90ff' },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold' },
                    }}
                >
                    <Stack.Screen
                        name="Search"
                        component={SearchScreen}
                    />
                    <Stack.Screen
                        name="History"
                        component={HistoryScreen}
                        options={{ title: '查詢歷史' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e90ff',
    },
});
