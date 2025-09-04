import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";

export default function Index() {
  const router = useRouter();

  const goToParticipantScreen = () => {
    router.push({
      pathname: "/ParticipantScreen",
      params: { ci: "12345678", phone: "72249118", rol: "participante" },
    });
  };

  return (
    <ImageBackground
      source={require('../assets/fondoo.jpg')} // Ruta de tu imagen
      style={styles.background}
      resizeMode="cover" // más recomendado que 'stretch' para que no se deforme
    >
      <View style={styles.overlay}>
        {/* Parte superior */}
        <Image source={require("../assets/logo.png")} style={styles.logo} />

        {/* Parte central */}
        <View style={styles.centerContent}>
          <Text style={styles.titleLine1}>PRIMER ENCUENTRO DEPARTAMENTAL</Text>
          <Text style={styles.titleLine2}>SISTEMAS INFORMÁTICOS</Text>
          <Text style={styles.titleLine3}>
            INSTITUTOS TÉCNICOS TECNOLÓGICOS DE COCHABAMBA
          </Text>
        </View>

        {/* Parte inferior */}
        <TouchableOpacity style={styles.button} onPress={goToParticipantScreen}>
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between", // reparte arriba/abajo
    alignItems: "center",
    padding: 100,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  logo: {
  width: 260,
  height: 260,
  resizeMode: 'contain',
  marginBottom: 5,
  marginTop: 10, // sube el logo
},
 titleLine1: {
  fontSize: 20,
  fontWeight: "600",
  color: "#108227ff",
  textAlign: "center",
  marginBottom: 0,
  textShadowColor: "#000",      // color del borde (negro en este ejemplo)
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
},

  titleLine2: {
    fontSize: 28,
    fontWeight: "900",
    color: "#108227ff",
    textAlign: "center",
    marginBottom: 4,
    textShadowColor: "#000",      // color del borde (negro en este ejemplo)
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  titleLine3: {
    fontSize: 16,
    fontWeight: "500",
    color: "#108227ff",
    textAlign: "center",
    marginBottom: 24,
     textShadowColor: "#000",      // color del borde (negro en este ejemplo)
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  button: {
    backgroundColor: "#0d8838ff",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,          // grosor del borde
    borderColor: "#FFFFFF",  // color blanco del borde  
  },
  buttonText: {
    color: "#14df39ff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
