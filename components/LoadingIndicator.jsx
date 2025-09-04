// LoadingIndicator.js
import { StyleSheet, Text, View } from 'react-native';

const LoadingIndicator = () => {
    return (
        <View style={styles.container}>
            <Text>Cargando...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
});

export default LoadingIndicator;
