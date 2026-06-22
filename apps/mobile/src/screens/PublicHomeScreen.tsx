import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import { logout } from "../api/client";
import { clearSession } from "../auth/token-store";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "PublicHome">;

export function PublicHomeScreen({ navigation, route }: Props) {
  const { session } = route.params;

  async function handleLogout() {
    try {
      await logout(session.refreshToken);
    } catch {
      Alert.alert("Logged out locally", "The server session could not be reached.");
    } finally {
      await clearSession();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  }

  return (
    <View style={[screenStyles.container, screenStyles.stack]}>
      <View>
        <Text style={screenStyles.title}>Public mode</Text>
        <Text style={screenStyles.body}>
          Signed in as {session.user.name}. Public users can browse, inquire, and
          prepare future service-provider registration without resident access.
        </Text>
      </View>

      <TouchableOpacity onPress={handleLogout} style={screenStyles.button}>
        <Text style={screenStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
