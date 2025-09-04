// LoginForm.js
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';

const LoginForm = ({ onLogin }) => {
    const [ci, setCi] = useState("");
    const [phone, setPhone] = useState("");

    const handleLogin = async () => {
        if (!ci || !phone) {
            Alert.alert("Error", "Por favor, ingresa el CI y el teléfono.");
            return;
        }
        onLogin(ci, phone); // Llamar a la función onLogin que está en el componente principal
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Cédula de Identidad"
                value={ci}
                onChangeText={setCi}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
                secureTextEntry
            />

            <Button title="Iniciar sesión" onPress={handleLogin} color="#006400" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 20,
    },
    input: {
        width: "100%",
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#006400",
    },
});

export default LoginForm;
