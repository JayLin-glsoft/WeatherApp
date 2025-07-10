import { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface HeaderInfoProps {
    name: string
    day: string
}

const HeaderInfo: FC<HeaderInfoProps> = ({
        name,
        day
    }) => (
  <View style={styles.container}>
    <Text style={styles.headerText}>{name}</Text>
    <Text style={styles.subText}>{day}</Text>
  </View>
)

export default HeaderInfo

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8
    },
    subText: {
        fontSize: 20,
        color: '#ccc'
    }
});