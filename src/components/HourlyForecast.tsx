import React, { ComponentType, FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { weatherIcons } from '../config/weatherIconsConfig'

interface HourlyForecastProps {
  time: string
  icon: keyof typeof weatherIcons
  temp: string
}

const HourlyForecast: FC<HourlyForecastProps> = ({ time, icon, temp }) => {
  const IconComponent = weatherIcons[icon]?.component || AntDesign || Feather
  const iconName = weatherIcons[icon]?.name || 'question'
  const iconColor =  weatherIcons[icon]?.color || '#ded8d8'

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  time: {
    fontSize: 18,
    color: '#666'
  }
})