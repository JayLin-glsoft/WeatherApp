import { ComponentType } from 'react'
import { AntDesign, Feather } from '@expo/vector-icons'

export type AntDesignNames = keyof typeof AntDesign.glyphMap
export type FeatherNames = keyof typeof Feather.glyphMap
export type WeatherIconName = AntDesignNames | FeatherNames;

export interface WeatherIconConfig {
  component: ComponentType<any>
  name: WeatherIconName
  color: string
}

export const weatherIcons: Record<string, WeatherIconConfig> = {
  sunny: { component: Feather, name: 'sun', color: '#FFD700' },
  cloudy: { component: AntDesign, name: 'cloudo', color: '#cfd8e2' },
  rainy: { component: Feather, name: 'cloud-rain', color: '#a9b2bc' },
}