import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  listNotifications,
  markNotificationRead,
  saveDeviceToken,
  type NotificationItem,
} from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "ResidentNotifications"
>;

export function ResidentNotificationsScreen({ route }: Props) {
  const { session } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [token, setToken] = useState("");

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listNotifications(session.accessToken);

      setNotifications(data.notifications);
    } catch (error) {
      Alert.alert(
        "Could not load notifications",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  async function markRead(id: string) {
    try {
      await markNotificationRead(session.accessToken, id);
      await loadNotifications();
    } catch (error) {
      Alert.alert(
        "Could not mark read",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  async function saveToken() {
    if (!token.trim()) {
      Alert.alert("Token required", "Enter a device token.");
      return;
    }

    try {
      await saveDeviceToken(session.accessToken, {
        platform: "ANDROID",
        token: token.trim(),
      });
      setToken("");
      Alert.alert("Saved", "Device token saved.");
    } catch (error) {
      Alert.alert(
        "Could not save token",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={screenStyles.stack}>
          <View>
            <Text style={screenStyles.title}>Notifications</Text>
            <Text style={screenStyles.body}>
              In-app feed and mobile device token.
            </Text>
          </View>
          {isLoading ? <ActivityIndicator color="#10b981" /> : null}
          <View style={screenStyles.card}>
            <Text style={screenStyles.sectionTitle}>Device token</Text>
            <TextInput
              onChangeText={setToken}
              placeholder="FCM token"
              style={screenStyles.input}
              value={token}
            />
            <TouchableOpacity onPress={saveToken} style={screenStyles.button}>
              <Text style={screenStyles.buttonText}>Save token</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      contentContainerStyle={screenStyles.scrollContent}
      data={notifications}
      keyExtractor={(item) => item.id}
      onRefresh={loadNotifications}
      refreshing={isLoading}
      renderItem={({ item }) => (
        <View style={screenStyles.card}>
          <View style={screenStyles.row}>
            <Text style={screenStyles.sectionTitle}>{item.title}</Text>
            <Text style={screenStyles.chip}>
              {item.isRead ? "READ" : "NEW"}
            </Text>
          </View>
          <Text style={screenStyles.body}>{item.body}</Text>
          {!item.isRead ? (
            <TouchableOpacity
              onPress={() => void markRead(item.id)}
              style={screenStyles.button}
            >
              <Text style={screenStyles.buttonText}>Mark read</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    />
  );
}
