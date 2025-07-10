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
      <IconComponent name={iconName} size={26} color={iconColor} marginBottom={8} />
      <Text style={styles.temperature}>{temp}°</Text>
    </View>
  )
}

export default HourlyForecast

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#008cdb',
    borderRadius: 15,
    padding: 8,
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  time: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  }
})