import { CameraView, useCameraPermissions } from "expo-camera";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { activateResident } from "../api/client";
import { saveSession } from "../auth/token-store";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentActivation">;

export function ResidentActivationScreen({ navigation, route }: Props) {
  const { session } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scannerEnabled, setScannerEnabled] = useState(true);

  async function handleActivate(nextCode = code) {
    const trimmedCode = nextCode.trim();

    if (!trimmedCode) {
      Alert.alert("Code required", "Enter or scan the resident activation code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const activatedSession = await activateResident(session.accessToken, {
        code: trimmedCode,
        deviceInfo: { platform: "mobile" },
        sessionInfo: { activatedAt: new Date().toISOString() },
      });

      await saveSession(activatedSession);
      navigation.reset({
        index: 0,
        routes: [{ name: "ResidentHome", params: { session: activatedSession } }],
      });
    } catch (error) {
      Alert.alert(
        "Activation failed",
        error instanceof Error ? error.message : "Please try again.",
      );
      setScannerEnabled(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={[screenStyles.container, screenStyles.stack]}>
      <View>
        <Text style={screenStyles.title}>Activate resident access</Text>
        <Text style={screenStyles.body}>
          Scan the QR code from hostel admin or enter the activation code.
        </Text>
      </View>

      {permission?.granted ? (
        <CameraView
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={
            scannerEnabled
              ? ({ data }) => {
                  setScannerEnabled(false);
                  setCode(data);
                  void handleActivate(data);
                }
              : undefined
          }
          style={styles.camera}
        />
      ) : (
        <TouchableOpacity onPress={requestPermission} style={screenStyles.button}>
          <Text style={screenStyles.buttonText}>Enable camera</Text>
        </TouchableOpacity>
      )}

      <View style={screenStyles.field}>
        <Text style={screenStyles.label}>Activation code</Text>
        <TextInput
          autoCapitalize="characters"
          onChangeText={setCode}
          placeholder="ABCD1234"
          style={screenStyles.input}
          value={code}
        />
      </View>

      <TouchableOpacity
        disabled={isSubmitting}
        onPress={() => void handleActivate()}
        style={screenStyles.button}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={screenStyles.buttonText}>Activate</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    borderRadius: 16,
    height: 260,
    overflow: "hidden",
  },
});
