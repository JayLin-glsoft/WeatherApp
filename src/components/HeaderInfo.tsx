import { View, Text, StyleSheet } from 'react-native'

const HeaderInfo = () => (
  <View style={styles.container}>
    <Text style={styles.headerText}>Taipei</Text>
    <Text style={styles.subText}>Monday, 12 September</Text>
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