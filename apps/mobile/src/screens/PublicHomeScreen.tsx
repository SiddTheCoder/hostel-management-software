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

import { listPublicHostels, logout, type PublicHostel } from "../api/client";
import { clearSession } from "../auth/token-store";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "PublicHome">;

const hostelTypeLabels = {
  BOYS: "Boys",
  CO_LIVING: "Co-living",
  GIRLS: "Girls",
} satisfies Record<PublicHostel["hostelType"], string>;

function rentLabel(hostel: PublicHostel) {
  const rent = hostel.pricing?.monthlyRentMin;

  if (!rent) {
    return "Contact for rent";
  }

  return `${hostel.pricing?.currency ?? "NPR"} ${rent.toLocaleString()}/mo`;
}

export function PublicHomeScreen({ navigation, route }: Props) {
  const { session } = route.params;
  const [hostels, setHostels] = useState<PublicHostel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | PublicHostel["hostelType"]>("");

  const loadHostels = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await listPublicHostels({
        q: q.trim() || undefined,
        type: type || undefined,
      });

      setHostels(data.hostels);
    } catch (error) {
      Alert.alert(
        "Could not load hostels",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [q, type]);

  useEffect(() => {
    void loadHostels();
  }, [loadHostels]);

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
    <View style={screenStyles.container}>
      <FlatList
        ListEmptyComponent={
          isLoading ? null : (
            <View style={screenStyles.card}>
              <Text style={screenStyles.sectionTitle}>No hostels found</Text>
              <Text style={screenStyles.body}>Try a broader search or hostel type.</Text>
            </View>
          )
        }
        ListHeaderComponent={
          <View style={screenStyles.stack}>
            <View>
              <Text style={screenStyles.title}>Browse hostels</Text>
              <Text style={screenStyles.body}>
                Signed in as {session.user.name}. Search verified listings and send
                inquiries from mobile.
              </Text>
            </View>

            <View style={screenStyles.field}>
              <Text style={screenStyles.label}>Search by name or area</Text>
              <TextInput
                autoCapitalize="none"
                onChangeText={setQ}
                onSubmitEditing={() => void loadHostels()}
                placeholder="Baneshwor, Sunrise..."
                style={screenStyles.input}
                value={q}
              />
            </View>

            <View style={screenStyles.filterRow}>
              {[
                ["", "All"],
                ["BOYS", "Boys"],
                ["GIRLS", "Girls"],
                ["CO_LIVING", "Co-living"],
              ].map(([value, label]) => (
                <TouchableOpacity
                  key={value || "ALL"}
                  onPress={() => setType(value as "" | PublicHostel["hostelType"])}
                  style={[
                    screenStyles.button,
                    type === value ? null : screenStyles.buttonSecondary,
                    { flex: 1, minHeight: 40 },
                  ]}
                >
                  <Text
                    style={[
                      screenStyles.buttonText,
                      type === value ? null : screenStyles.buttonTextSecondary,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              style={[screenStyles.button, screenStyles.buttonSecondary]}
            >
              <Text style={screenStyles.buttonTextSecondary}>Logout</Text>
            </TouchableOpacity>

            {isLoading ? <ActivityIndicator color="#10b981" /> : null}
          </View>
        }
        contentContainerStyle={screenStyles.scrollContent}
        data={hostels}
        keyExtractor={(item) => item.id}
        onRefresh={loadHostels}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PublicHostelDetail", {
                session,
                slug: item.slug,
              })
            }
            style={screenStyles.card}
          >
            <View style={screenStyles.row}>
              <Text style={screenStyles.sectionTitle}>{item.name}</Text>
              <Text style={screenStyles.chip}>{hostelTypeLabels[item.hostelType]}</Text>
            </View>
            <Text style={screenStyles.meta}>
              {[item.location.area, item.location.city].filter(Boolean).join(", ")}
            </Text>
            <Text style={screenStyles.body}>{rentLabel(item)}</Text>
            <Text style={screenStyles.meta}>
              {(item.facilities ?? []).slice(0, 3).join(" / ") || "Facilities pending"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
