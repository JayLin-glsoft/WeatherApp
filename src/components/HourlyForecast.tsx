import React, { ComponentType, FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'

type AntDesignNames = keyof typeof AntDesign.glyphMap
type FeatherNames = keyof typeof Feather.glyphMap

interface WeatherIconConfig {
  component: ComponentType<any>
  name: AntDesignNames | FeatherNames
}

interface HourlyForecastProps {
  time: string
  icon: keyof typeof weatherIcons
  temp: string
}

const weatherIcons: Record<string, WeatherIconConfig> = {
  sunny: { component: Feather, name: 'sun' },
  cloudy: { component: AntDesign, name: 'cloudo' },
  rainy: { component: Feather, name: 'cloud-rain' }
}

const HourlyForecast: FC<HourlyForecastProps> = ({ time, icon, temp }) => {
  const IconComponent = weatherIcons[icon]?.component || AntDesign || Feather
  const iconName = weatherIcons[icon]?.name || 'question'
  const iconColor = '#ffffff'

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <IconComponent name={iconName} size={30} color={iconColor} />
      <Text style={styles.temperature}>{temp}°</Text>
    </View>
  )
}

export default HourlyForecast

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff'
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333'
  },
  time: {
    fontSize: 24,
    color: '#666'
  }
})