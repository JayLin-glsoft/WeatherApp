import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    // 使用 Provider 將 Redux store 提供給整個應用程式
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}