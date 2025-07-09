import { View, Text, StyleSheet } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { weatherIcons } from '../config/weatherIconsConfig'
import { FC } from 'react'

interface CurrentWeatherProps {
    description: string
    icon: keyof typeof weatherIcons
    temp: string
}

const CurrentWeather: FC<CurrentWeatherProps> = ({
    description,
    icon,
    temp
}) => {
    const IconComponent = weatherIcons[icon]?.component || AntDesign || Feather
    const iconName = weatherIcons[icon]?.name || 'question'
    const iconColor = weatherIcons[icon]?.color || '#ded8d8'

    return (
        <View style={styles.container}>
            <IconComponent name={iconName} size={60} color={iconColor} />
            <Text style={styles.temperature}>{temp}°</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    )
}

export default CurrentWeather

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        borderRadius: 15,
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333'
    },
    description: {
        fontSize: 24,
        color: '#666'
    },
});