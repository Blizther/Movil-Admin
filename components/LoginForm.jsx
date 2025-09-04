// LoginForm.js
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';

const LoginForm = ({ onLogin }) => {
  const [ci, setCi] = useState("");
  const [phone, setPhone] = useState("");

  const handleLogin = () => {
    if (!ci || !phone) {
      Alert.alert("Error", "Por favor, ingresa el CI y el teléfono.");
      return;
    }
    onLogin(ci, phone);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Cédula de Identidad"
        placeholderTextColor="#666"
        value={ci}
        onChangeText={setCi}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#666"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    gap: 12,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#006400",
    fontSize: 16,
    color: "#0F172A",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  button: {
    marginTop: 8,
    backgroundColor: "#006400",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,          // grosor del borde
    borderColor: "#FFFFFF",  // color blanco del borde
  },
  buttonText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default LoginForm;
