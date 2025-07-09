import React, { useEffect } from 'react';
import { View, Button, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { loadHistory, clearHistory } from '../redux/weatherSlice';
import { HistoryScreenProps } from '../navigation/AppNavigator';
import { useAppDispatch } from '../redux/hooks';
import { RootState } from '../redux/store';

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const dispatch = useAppDispatch();
  const { history } = useSelector((state: RootState) => state.weather);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(loadHistory());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  const handleClear = () => {
    Alert.alert("清除歷史紀錄", "您確定要清除所有查詢紀錄嗎？", [
      { text: "取消", style: "cancel" },
      { text: "確定", onPress: () => dispatch(clearHistory()), style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.pageContainer}>
      {history.length > 0 && <Button title="清除所有紀錄" color="#e74c3c" onPress={handleClear} />}
      <FlatList
        data={history}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.historyItem} 
            onPress={() => navigation.navigate('Search', { city: item })}
          >
            <Text style={styles.historyText}>{item}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>目前沒有歷史紀錄。</Text>}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: { flex: 1, padding: 20, backgroundColor: '#f0f8ff' },
  historyItem: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 10 },
  historyText: { fontSize: 18 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
});
