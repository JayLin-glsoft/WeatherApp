import { View, Text, StyleSheet } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { weatherIcons } from '../config/weatherIconsConfig'

interface DailyForecastProps {
  day: string
  icon: keyof typeof weatherIcons
  tempHigh: string
  tempLow: string
}

const DailyForecast = ({
  day,
  icon,
  tempHigh,
  tempLow
}: DailyForecastProps) => {
  const IconComponent = weatherIcons[icon]?.component || AntDesign || Feather
  const iconName = weatherIcons[icon]?.name || 'question'
  const iconColor =  weatherIcons[icon]?.color || '#ded8d8'

  return (
    <View style={styles.container}>
      <Text style={styles.day}>{day}</Text>
      <IconComponent name={iconName} size={48} color={iconColor} />
      <Text style={styles.temperature}>
        {tempHigh}° / {tempLow}°
      </Text>
    </View>
  )
}

export default DailyForecast

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#008cdb',
    flexDirection: 'row',
    borderRadius: 15,
    marginBottom: 16,
    padding: 16,
  },
  temperature: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff'
  },
  day: {
    fontSize: 26,
    color: '#fff'
  }
})