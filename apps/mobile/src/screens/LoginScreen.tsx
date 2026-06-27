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

import { login } from "../api/client";
import { saveSession } from "../auth/token-store";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  async function handleLogin() {
    setIsSubmitting(true);

    try {
      const session = await login(identifier, password);

      await saveSession(session);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: session.user.role === "RESIDENT" ? "ResidentHome" : "PublicHome",
            params: { session },
          },
        ],
      });
    } catch (error) {
      Alert.alert(
        "Login failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={[screenStyles.container, screenStyles.stack]}>
      <View>
        <Text style={screenStyles.title}>Welcome back</Text>
        <Text style={screenStyles.body}>
          Login with your email and password. Mobile requests include the HostelHub
          mobile client header so refresh tokens can be stored securely on device.
        </Text>
      </View>

      <View style={screenStyles.field}>
        <Text style={screenStyles.label}>Email</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setIdentifier}
          placeholder="you@example.com"
          style={screenStyles.input}
          value={identifier}
        />
      </View>

      <View style={screenStyles.field}>
        <Text style={screenStyles.label}>Password</Text>
        <TextInput
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          style={screenStyles.input}
          value={password}
        />
      </View>

      <TouchableOpacity
        disabled={isSubmitting}
        onPress={handleLogin}
        style={screenStyles.button}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={screenStyles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        style={[screenStyles.button, screenStyles.buttonSecondary]}
      >
        <Text style={[screenStyles.buttonText, screenStyles.buttonTextSecondary]}>
          Create public account
        </Text>
      </TouchableOpacity>
    </View>
  );
}
