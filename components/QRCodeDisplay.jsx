// QRCodeDisplay.js
import { Image, StyleSheet, Text, View } from 'react-native';

const QRCodeDisplay = ({ qrUrl }) => {
    return (
        <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Escanea el QR para registrar asistencia</Text>
            <Image
                source={{ uri: qrUrl }}  // Usamos la URL generada por la API
                style={styles.qrImage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    qrContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    qrTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: "#006400",
    },
    qrImage: {
        width: 300,
        height: 300,
    },
});

export default QRCodeDisplay;