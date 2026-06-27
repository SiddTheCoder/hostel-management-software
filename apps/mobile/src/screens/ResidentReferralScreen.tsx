import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

import {
  getResidentReferral,
  type ResidentReferral,
  type ResidentReferralCode,
} from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentReferral">;

export function ResidentReferralScreen({ route }: Props) {
  const { session } = route.params;
  const [code, setCode] = useState<ResidentReferralCode | null>(null);
  const [referrals, setReferrals] = useState<ResidentReferral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getResidentReferral(session.accessToken);

      setCode(data.referralCode);
      setReferrals(data.referrals);
    } catch (error) {
      Alert.alert(
        "Could not load referral",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScrollView contentContainerStyle={screenStyles.scrollContent}>
      <View>
        <Text style={screenStyles.title}>Referral</Text>
        <Text style={screenStyles.body}>Share your code with a future resident.</Text>
      </View>

      {isLoading ? <ActivityIndicator color="#10b981" /> : null}

      {code ? (
        <View style={screenStyles.card}>
          <Text style={screenStyles.meta}>Your code</Text>
          <Text style={[screenStyles.title, { letterSpacing: 2 }]}>{code.code}</Text>
          <Text style={screenStyles.body}>
            Joined {code.joinedCount} / Rewards {code.rewardCount}
          </Text>
          <Text style={screenStyles.meta}>{code.link}</Text>
        </View>
      ) : null}

      <View style={screenStyles.card}>
        <Text style={screenStyles.sectionTitle}>Referred inquiries</Text>
        {referrals.length === 0 ? (
          <Text style={screenStyles.body}>No referrals yet.</Text>
        ) : (
          referrals.map((referral) => (
            <View key={referral.id} style={screenStyles.row}>
              <View>
                <Text style={screenStyles.body}>{referral.name}</Text>
                <Text style={screenStyles.meta}>{referral.phone}</Text>
              </View>
              <Text style={screenStyles.chip}>{referral.status}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
