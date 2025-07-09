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
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff'
    },
    subText: {
        fontSize: 14,
        color: '#ccc'
    }
});