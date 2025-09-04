import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  // Función para redirigir a la pantalla de participantes
  const goToParticipantScreen = () => {
    router.push({
      pathname: '/ParticipantScreen',  // Ruta a la pantalla de participantes
      params: { ci: '12345678', phone: '72249118', rol: 'participante' },  // Parámetros de ejemplo
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la app !!!</Text>
      <Button 
        title="Ir a Participantes" 
        onPress={goToParticipantScreen} 
        color="#006400"  // Color verde
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Fondo blanco
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#006400', // Verde oscuro
    marginBottom: 20,
  },
});
