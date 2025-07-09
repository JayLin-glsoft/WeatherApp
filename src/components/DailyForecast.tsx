import React, { FC, ComponentType } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { weatherIcons } from '../config/weatherIconsConfig'

interface DailyForecastProps {
  day: string
  icon: keyof typeof weatherIcons
  tempHigh: string
  tempLow: string
}

const DailyForecast: FC<DailyForecastProps> = ({
  day,
  icon,
  tempHigh,
  tempLow
}) => {
  const IconComponent = weatherIcons[icon]?.component || AntDesign || Feather
  const iconName = weatherIcons[icon]?.name || 'question'
  const iconColor =  weatherIcons[icon]?.color || '#ded8d8'

  return (
    <View style={styles.container}>
      <Text style={styles.day}>{day}</Text>
      <IconComponent name={iconName} size={36} color={iconColor} />
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333'
  },
  day: {
    fontSize: 32,
    color: '#666'
  }
})