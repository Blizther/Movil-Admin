import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import LoadingIndicator from '../components/LoadingIndicator';
import LoginForm from '../components/LoginForm';
import QRCodeDisplay from '../components/QRCodeDisplay';

export default function ParticipantScreen() {
  const [userData, setUserData] = useState(null);  // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(false);  // Estado para manejar el loading
  const [qrUrl, setQrUrl] = useState("");  // Estado para almacenar la URL del QR
  const [activity, setActivity] = useState("");  // Estado para almacenar la actividad
  const router = useRouter();

  // Función para hacer login
  const handleLogin = async (ci, phone) => {
    setLoading(true);  // Iniciar el loading
    try {
      const response = await fetch(`https://tornemecsrl.com.bo/assystem/login.php?ci=${ci}&phone=${phone}`);
      const data = await response.json();

      if (data.ok) {
        Alert.alert("Éxito", "Inicio de sesión exitoso");

        // Redirigir según el rol
        if (data.rol === 'admin') {
          router.push({
            pathname: '/AdminScreen',
            params: { ci: data.ci, phone: data.phone, rol: data.rol },
          });
        } else {
          // Si es participante, hacer la solicitud a guest.php con el id y obtener los datos
          fetchUserData(data.id); // Llamar a la función para obtener los datos del usuario
        }
      } else {
        Alert.alert("Error", data.msg);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setLoading(false);  // Detener el loading
    }
  };

  // Función para obtener los datos del usuario usando el id
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`https://tornemecsrl.com.bo/assystem/guest.php?id=${userId}`);
      const data = await response.json();

      if (data.error) {
        Alert.alert("Error", data.error); // Mostrar error si no se encuentran datos
      } else {
        console.log('Datos del usuario:', data);  // Mostrar los datos del usuario en la consola
        // Crear la URL del QR usando la API de qrserver
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${userId}`);
        // Mostrar la actividad asociada con este id
        fetchActivity(data.id);  // Obtener la actividad asociada al id
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener los datos del usuario");
    }
  };

  // Función para obtener la actividad asociada con el id
  const fetchActivity = async (userId) => {
    try {
      const response = await fetch(`https://tornemecsrl.com.bo/assystem/assistance.php?id=${userId}`);
      const data = await response.json();

      if (data.error) {
        Alert.alert("Error", data.error);  // Mostrar error si no se encuentran actividades
      } else {
        // Mostrar la actividad obtenida
        setActivity(data[0]?.activity || "No se registró actividad");  // Obtener actividad, si no hay, mostrar un mensaje predeterminado
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo obtener la actividad");
    }
  };

  return (
    <View style={styles.container}>
      <LoginForm onLogin={handleLogin} />

      {loading && <LoadingIndicator />}

      {/* Mostrar el QR si está disponible */}
      {qrUrl && !loading && <QRCodeDisplay qrUrl={qrUrl} />}

      {/* Mostrar la actividad registrada */}
      {activity && (
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>Actividad: {activity}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    padding: 20,
  },
  activityContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#256c2bff",
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  activityText: {
    fontSize: 18,
    color: "#2e7d32",
  },
});
