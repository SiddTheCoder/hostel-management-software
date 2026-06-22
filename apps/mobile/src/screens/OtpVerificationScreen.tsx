import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { register, verifyOtp } from "../api/client";
import { saveSession } from "../auth/token-store";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "OtpVerification">;

export function OtpVerificationScreen({ navigation, route }: Props) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleVerifyAndRegister() {
    setIsSubmitting(true);

    try {
      await verifyOtp(route.params.challengeId, code);
      const session = await register({
        email: route.params.email,
        name: route.params.name,
        otpChallengeId: route.params.challengeId,
        password: route.params.password,
        phone: route.params.phone,
      });

      await saveSession(session);
      navigation.reset({
        index: 0,
        routes: [{ name: "PublicHome", params: { session } }],
      });
    } catch (error) {
      Alert.alert(
        "Verification failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={[screenStyles.container, screenStyles.stack]}>
      <View>
        <Text style={screenStyles.title}>Verify {route.params.channel}</Text>
        <Text style={screenStyles.body}>
          Enter the 6-digit code sent to {route.params.identifier}. After
          verification, HostelHub creates a public user account only.
        </Text>
      </View>

      <View style={screenStyles.field}>
        <Text style={screenStyles.label}>OTP code</Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setCode}
          placeholder="123456"
          style={screenStyles.input}
          value={code}
        />
      </View>

      <TouchableOpacity
        disabled={isSubmitting}
        onPress={handleVerifyAndRegister}
        style={screenStyles.button}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={screenStyles.buttonText}>Verify and register</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
