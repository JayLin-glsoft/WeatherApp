import React, { FC, ComponentType } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'

type AntDesignNames = keyof typeof AntDesign.glyphMap
type FeatherNames = keyof typeof Feather.glyphMap

interface WeatherIconConfig {
  component: ComponentType<any>
  name: AntDesignNames | FeatherNames
}

interface DailyForecastProps {
  day: string
  icon: keyof typeof weatherIcons
  tempHigh: string
  tempLow: string
}

const weatherIcons: Record<string, WeatherIconConfig> = {
  sunny: { component: Feather, name: 'sun' },
  cloudy: { component: AntDesign, name: 'cloudo' },
  rainy: { component: Feather, name: 'cloud-rain' }
}

const DailyForecast: FC<DailyForecastProps> = ({
  day,
  icon,
  tempHigh,
  tempLow
}) => {
  const IconComponent = weatherIcons[icon]?.component || AntDesign || Feather
  const iconName = weatherIcons[icon]?.name || 'question'

  return (
    <View style={styles.container}>
      <Text style={styles.day}>{day}</Text>
      <IconComponent name={iconName} size={30} color='#ded8d8' />
      <Text style={styles.temperature}>
        {tempHigh}° / {tempLow}°
      </Text>
    </View>
  )
}

export default DailyForecast

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    marginBottom: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333'
  },
  day: {
    fontSize: 24,
    color: '#666'
  }
})