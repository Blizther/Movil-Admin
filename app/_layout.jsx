// app/_layout.jsx
import { Stack } from 'expo-router'; // Para las rutas de stack
import React from 'react';

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{
            headerShown: false, // Ocultar el header en la pantalla de login
          }}
        />
        <Stack.Screen 
          name="ParticipantScreen" 
          options={{ headerShown: true }} // Configuración de la pantalla de Participante
        />
        <Stack.Screen 
          name="AdminScreen" 
          options={{ headerShown: true }} // Configuración de la pantalla de Admin
        />
      </Stack>
  );
}
