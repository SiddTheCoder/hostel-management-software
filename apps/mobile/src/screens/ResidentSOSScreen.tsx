import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import { triggerSOS } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentSOS">;

export function ResidentSOSScreen({ route }: Props) {
  const { session } = route.params;
  const [guardianAlertEnabled, setGuardianAlertEnabled] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSOS() {
    try {
      await triggerSOS(session.accessToken, {
        guardianAlertEnabled,
        message: message.trim() || undefined,
      });
      setMessage("");
      Alert.alert("SOS sent", "Hostel staff has been alerted.");
    } catch (error) {
      Alert.alert(
        "Could not send SOS",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.stack}>
        <Text style={screenStyles.title}>SOS</Text>
        <Text style={screenStyles.body}>
          Trigger an emergency alert for hostel staff.
        </Text>
        <TextInput
          multiline
          onChangeText={setMessage}
          placeholder="Optional message"
          style={[
            screenStyles.input,
            { minHeight: 96, textAlignVertical: "top" },
          ]}
          value={message}
        />
        <TouchableOpacity
          onPress={() => setGuardianAlertEnabled((value) => !value)}
          style={[screenStyles.button, screenStyles.buttonSecondary]}
        >
          <Text style={screenStyles.buttonTextSecondary}>
            {guardianAlertEnabled
              ? "Guardian alert: On"
              : "Guardian alert: Off"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSOS}
          style={[screenStyles.button, { backgroundColor: "#dc2626" }]}
        >
          <Text style={screenStyles.buttonText}>Trigger SOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
