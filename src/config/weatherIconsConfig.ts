import { ComponentType } from 'react'
import { AntDesign, Feather } from '@expo/vector-icons'

// 引入 AntDesign 和 Feather 的字型映射
export type AntDesignNames = keyof typeof AntDesign.glyphMap
export type FeatherNames = keyof typeof Feather.glyphMap
export type WeatherIconName = AntDesignNames | FeatherNames;

// 定義天氣圖示的配置介面
export interface WeatherIconConfig {
  component: ComponentType<any>
  name: WeatherIconName
  color: string
}

// 定義天氣圖示的配置物件
export const weatherIcons: Record<string, WeatherIconConfig> = {
  sunny: { component: Feather, name: 'sun', color: '#FFD700' },
  cloudy: { component: AntDesign, name: 'cloudo', color: '#cfd8e2' },
  rainy: { component: Feather, name: 'cloud-rain', color: '#a9b2bc' },
}