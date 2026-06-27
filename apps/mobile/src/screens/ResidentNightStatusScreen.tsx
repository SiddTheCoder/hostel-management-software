import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getResidentNightStatus,
  updateResidentNightStatus,
  type ResidentNightStatus,
} from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentNightStatus">;

export function ResidentNightStatusScreen({ route }: Props) {
  const { session } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<ResidentNightStatus | null>(null);

  const loadStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getResidentNightStatus(session.accessToken);

      setStatus(data.status);
    } catch (error) {
      Alert.alert(
        "Could not load status",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function update(statusValue: string) {
    try {
      const data = await updateResidentNightStatus(
        session.accessToken,
        statusValue,
      );

      setStatus(data.status);
      Alert.alert("Updated", "Night status updated.");
    } catch (error) {
      Alert.alert(
        "Could not update status",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.stack}>
        <Text style={screenStyles.title}>Night status</Text>
        <Text style={screenStyles.body}>
          Share status only. No GPS is shown in dashboards.
        </Text>
        {isLoading ? <ActivityIndicator color="#10b981" /> : null}
        <View style={screenStyles.card}>
          <Text style={screenStyles.sectionTitle}>
            {status?.status ?? "NOT_VERIFIED"}
          </Text>
          <Text style={screenStyles.meta}>{status?.checkedAt ?? "-"}</Text>
        </View>
        {["INSIDE_HOSTEL", "OUTSIDE_HOSTEL", "MARKED_SAFE", "NOT_VERIFIED"].map(
          (item) => (
            <TouchableOpacity
              key={item}
              onPress={() => void update(item)}
              style={screenStyles.button}
            >
              <Text style={screenStyles.buttonText}>
                {item.replaceAll("_", " ")}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>
    </View>
  );
}
