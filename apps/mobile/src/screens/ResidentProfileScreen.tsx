import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

import { getResidentProfile } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentProfile">;

type Profile = Awaited<ReturnType<typeof getResidentProfile>>["profile"];

export function ResidentProfileScreen({ route }: Props) {
  const { session } = route.params;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getResidentProfile(session.accessToken);

      setProfile(data.profile);
    } catch (error) {
      Alert.alert(
        "Could not load profile",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return (
    <ScrollView contentContainerStyle={screenStyles.scrollContent}>
      {isLoading ? <ActivityIndicator color="#10b981" /> : null}
      {profile ? (
        <>
          <View style={screenStyles.card}>
            <Text style={screenStyles.sectionTitle}>
              {profile.resident.firstName} {profile.resident.lastName}
            </Text>
            <Text style={screenStyles.body}>{profile.resident.phone}</Text>
            <Text style={screenStyles.meta}>{profile.resident.email}</Text>
          </View>
          <View style={screenStyles.card}>
            <Text style={screenStyles.sectionTitle}>Room & bed</Text>
            <Text style={screenStyles.body}>
              Room {profile.roomBed.room?.roomNumber ?? "-"} / Bed{" "}
              {profile.roomBed.bed?.bedNumber ?? "-"}
            </Text>
          </View>
          <View style={screenStyles.card}>
            <Text style={screenStyles.sectionTitle}>Contacts</Text>
            {profile.guardians.map((guardian) => (
              <Text key={guardian.id} style={screenStyles.body}>
                {guardian.firstName} {guardian.lastName} / {guardian.relation} /{" "}
                {guardian.phone}
              </Text>
            ))}
            {profile.emergencyContacts.map((contact) => (
              <Text key={contact.id} style={screenStyles.body}>
                {contact.name} / {contact.relation} / {contact.phone}
              </Text>
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}
