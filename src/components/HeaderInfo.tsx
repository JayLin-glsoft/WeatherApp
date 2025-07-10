import { View, Text, StyleSheet } from 'react-native'

interface HeaderInfoProps {
    name: string
    day: string
}

const HeaderInfo = ({ name, day }: HeaderInfoProps) => (
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