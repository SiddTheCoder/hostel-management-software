import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

import {
  listResidentNotices,
  markNoticeAsRead,
  type ResidentNotice,
} from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentNotices">;

export function ResidentNoticesScreen({ route }: Props) {
  const { session } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [notices, setNotices] = useState<ResidentNotice[]>([]);

  const loadNotices = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await listResidentNotices(session.accessToken);

      setNotices(data.notices);
    } catch (error) {
      Alert.alert(
        "Could not load notices",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken]);

  useEffect(() => {
    void loadNotices();
  }, [loadNotices]);

  async function handleRead(noticeId: string) {
    try {
      await markNoticeAsRead(session.accessToken, noticeId);
      await loadNotices();
    } catch (error) {
      Alert.alert(
        "Could not update notice",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={screenStyles.stack}>
          <Text style={screenStyles.title}>Notices</Text>
          {isLoading ? <ActivityIndicator color="#10b981" /> : null}
        </View>
      }
      contentContainerStyle={screenStyles.scrollContent}
      data={notices}
      keyExtractor={(item) => item.id}
      onRefresh={loadNotices}
      refreshing={isLoading}
      renderItem={({ item }) => (
        <View style={screenStyles.card}>
          <View style={screenStyles.row}>
            <Text style={screenStyles.sectionTitle}>{item.title}</Text>
            <Text style={screenStyles.chip}>{item.isRead ? "Read" : item.category}</Text>
          </View>
          <Text style={screenStyles.body}>{item.content}</Text>
          {!item.isRead ? (
            <TouchableOpacity onPress={() => void handleRead(item.id)} style={screenStyles.button}>
              <Text style={screenStyles.buttonText}>Mark read</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    />
  );
}
