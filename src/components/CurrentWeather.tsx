import { View, Text, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

const CurrentWeather = () => (
  <View style={styles.container}>
    <AntDesign name='cloudo' size={60} color='#ded8d8' />
    <Text style={styles.temperature}>28°</Text>
    <Text style={styles.description}>Partly Cloudy</Text>
  </View>
)

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