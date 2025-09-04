import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";

// El endpoint para registrar la asistencia
const ASISTENCIA_ENDPOINT =
  "https://tornemecsrl.com.bo/assystem/asistencia.php";

// Función de encriptación XOR (Método Korgal)
const korgalEncrypt = (text, key) => {
  let encrypted = "";
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    ); // XOR entre el carácter y la clave
  }
  return encrypted;
};

// Función de desencriptación XOR (Método Korgal) - La misma función que para encriptar
const korgalDecrypt = (encryptedText, key) => {
  let decrypted = "";
  for (let i = 0; i < encryptedText.length; i++) {
    decrypted += String.fromCharCode(
      encryptedText.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    ); // XOR entre el carácter y la clave
  }
  return decrypted;
};

export default function ScanScreen() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedUserId, setScannedUserId] = useState(null);
  const [sending, setSending] = useState(false);
  const qrCodeLock = useRef(false);

  const secretKey = "mi_clave_secreta"; // La misma clave secreta utilizada para cifrar en la App 1

  async function handleOpenCamera() {
    const { granted } = await requestPermission();
    if (!granted) {
      return Alert.alert(
        "Permiso requerido",
        "Otorga permiso para usar la cámara."
      );
    }
    setModalIsVisible(true);
    qrCodeLock.current = false;
  }

  // Extrae el ID desde el QR (ahora solo extraemos el id, sin apikey)
  function extractParams(data) {
    let id = null;

    const s = String(data || "");

    // 1) Intentar como URL
    try {
      const u = new URL(s);
      id = u.searchParams.get("id");

      if (!id) {
        const segs = u.pathname.split("/").filter(Boolean);
        id = segs[segs.length - 1] || null;
      }
    } catch {
      // 2) Intentar con regex en texto plano
      const mid = s.match(/(?:\b|[?&])id=([^&\s]+)/i);
      if (mid) id = mid[1];

      // 3) Último segmento como id
      if (!id) {
        const parts = s.split("/").filter(Boolean);
        id = parts[parts.length - 1] || null;
      }
    }

    // Normalizar id a solo dígitos si aplica
    if (id) {
      const onlyDigits = id.replace(/\D+/g, "");
      if (onlyDigits) id = onlyDigits;
    }

    return { id };
  }

  async function handleQRCodeRead(data) {
    setModalIsVisible(false);

    const { id } = extractParams(data);
    if (!id) {
      return Alert.alert(
        "Código inválido",
        "No se encontró el ID del trabajador en el QR."
      );
    }

    // Desencriptar el ID utilizando el mismo método y clave secreta
    const decryptedId = korgalDecrypt(id, secretKey);
    if (!decryptedId) {
      return Alert.alert("Error", "El ID no pudo ser desencriptado.");
    }

    setScannedUserId(decryptedId); // Establecer el ID desencriptado

    try {
      setSending(true);
      const params = new URLSearchParams({ id: decryptedId }); // Usar el ID desencriptado
      const url = `${ASISTENCIA_ENDPOINT}?${params.toString()}`;

      const resp = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      let json = null;
      try {
        json = await resp.json();
      } catch {
        const txt = await resp.text();
        throw new Error(`Respuesta no válida: ${txt.slice(0, 200)}…`);
      }

      if (!resp.ok) throw new Error(json?.mensaje || `HTTP ${resp.status}`);

      const msg =
        json?.mensaje ||
        (json?.evento ? `Evento: ${json.evento}` : "Evento registrado");
      Alert.alert("Asistencia", msg);
    } catch (e) {
      Alert.alert(
        "Error",
        (e && e.message) || "No se pudo registrar la asistencia"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <ImageBackground
      source={require("../assets/fondoo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: "#E8F5E9" }]}>
                  <Ionicons name="qr-code-outline" size={28} color="#2E7D32" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Escanear código QR</Text>
                  <Text style={styles.cardText}>
                    Apunta al código para registrar asistencia
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.btn, sending && { opacity: 0.7 }]}
                onPress={handleOpenCamera}
                disabled={sending}
              >
                <Ionicons name="camera-outline" size={18} color="white" />
                <Text style={styles.btnText}>
                  {sending ? "Procesando..." : "Abrir Cámara"}
                </Text>
                {sending && (
                  <ActivityIndicator color="#fff" style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>

              {!!scannedUserId && (
                <View style={styles.resultBox}>
                  <Text style={styles.resultLabel}>ID escaneado</Text>
                  <Text style={styles.resultValue}>{scannedUserId}</Text>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>

        <Modal
          visible={modalIsVisible}
          animationType="slide"
          transparent={false}
        >
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={({ data }) => {
              if (data && !qrCodeLock.current) {
                qrCodeLock.current = true;
                setTimeout(() => handleQRCodeRead(data), 400);
              }
            }}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
          <View style={styles.footerCamera}>
            <TouchableOpacity
              onPress={() => setModalIsVisible(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF8E1" }, // fondo institucional suave

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },

  topTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textShadowColor: "rgba(0,0,0,0.18)", // borde sutil para legibilidad
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  container: { flex: 1, padding: 16 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: "#E8F5E9", // ya se sobreescribe en tu JSX
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textShadowColor: "rgba(0,0,0,0.18)", // “borde” de texto ligero
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  cardText: {
    marginTop: 4,
    color: "#64748B",
  },

  btn: {
    marginTop: 8,
    backgroundColor: "#006400", // verde institucional
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 2, // borde blanco solicitado
    borderColor: "#FFFFFF",
  },

  btnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    marginLeft: 8,
    textShadowColor: "rgba(0,0,0,0.22)", // contorno sutil para texto del botón
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  resultBox: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
  },

  resultLabel: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 6,
  },

  resultValue: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 16,
  },

  footerCamera: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  cancelBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cancelText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safe: {
    flex: 1,
    backgroundColor: "transparent", // importante para que se vea la imagen
  },
});
