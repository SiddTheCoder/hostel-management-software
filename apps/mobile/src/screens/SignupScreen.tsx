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

import { requestOtp, signInWithGoogle } from "../api/client";
import { saveSession } from "../auth/token-store";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Signup">;

export function SignupScreen({ navigation }: Props) {
  const [googleIdToken, setGoogleIdToken] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleRequestOtp() {
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const challenge = await requestOtp(normalizedEmail);

      navigation.navigate("OtpVerification", {
        challengeId: challenge.challengeId,
        channel: "email",
        email: normalizedEmail,
        identifier: normalizedEmail,
        name,
        password,
      });
    } catch (error) {
      Alert.alert(
        "OTP request failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!googleIdToken.trim()) {
      Alert.alert("Google token required", "Paste a native Google ID token first.");
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await signInWithGoogle(googleIdToken);

      await saveSession(session);
      navigation.reset({
        index: 0,
        routes: [{ name: "PublicHome", params: { session } }],
      });
    } catch (error) {
      Alert.alert(
        "Google sign-in failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={[screenStyles.container, screenStyles.stack]}>
      <View>
        <Text style={screenStyles.title}>Create account</Text>
        <Text style={screenStyles.body}>
          Public registrations use email OTP and password. Resident access still
          requires QR activation against an admin-created resident record.
        </Text>
      </View>

      <View style={screenStyles.field}>
        <Text style={screenStyles.label}>Full name</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Your name"
          style={screenStyles.input}
          value={name}
        />
      </View>

      <View style={screenStyles.field}>
        <Text style={screenStyles.label}>Email address</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="you@example.com"
          style={screenStyles.input}
          value={email}
        />
      </View>

      <View style={screenStyles.field}>
        <Text style={screenStyles.label}>Password</Text>
        <TextInput
          onChangeText={setPassword}
          placeholder="Minimum 8 characters"
          secureTextEntry
          style={screenStyles.input}
          value={password}
        />
      </View>

      <TouchableOpacity
        disabled={isSubmitting}
        onPress={handleRequestOtp}
        style={screenStyles.button}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={screenStyles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      <View style={screenStyles.field}>
        <Text style={screenStyles.label}>Google ID token</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setGoogleIdToken}
          placeholder="Paste token from native Google auth"
          style={screenStyles.input}
          value={googleIdToken}
        />
      </View>

      <TouchableOpacity
        disabled={isSubmitting}
        onPress={handleGoogleSignIn}
        style={[screenStyles.button, screenStyles.buttonSecondary]}
      >
        <Text style={[screenStyles.buttonText, screenStyles.buttonTextSecondary]}>
          Continue with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
