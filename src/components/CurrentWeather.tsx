import { View, Text, StyleSheet } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { weatherIcons } from '../config/weatherIconsConfig'

interface CurrentWeatherProps {
    description: string
    icon: keyof typeof weatherIcons
    temp: string
}

const CurrentWeather = ({
    description,
    icon,
    temp
}: CurrentWeatherProps) => {
    const IconComponent = weatherIcons[icon]?.component || AntDesign || Feather
    const iconName = weatherIcons[icon]?.name || 'question'
    const iconColor = weatherIcons[icon]?.color || '#ded8d8'

    return (
        <View style={styles.container}>
            <Text style={styles.description}>{description}</Text>
            <IconComponent name={iconName} size={60} color={iconColor} />
            <Text style={styles.temperature}>{temp}°</Text>
        </View>
    )
}

export default CurrentWeather

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        borderRadius: 15,
        marginBottom: 16,
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff'
    },
    description: {
        fontSize: 24,
        color: '#fff'
    },
});