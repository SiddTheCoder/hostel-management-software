import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  listResidentPayments,
  submitPaymentProof,
  type ResidentPayment,
  type ResidentPaymentProof,
} from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentPayments">;

function money(value: number) {
  return `NPR ${value.toLocaleString()}`;
}

export function ResidentPaymentsScreen({ route }: Props) {
  const { session } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<ResidentPayment[]>([]);
  const [proofs, setProofs] = useState<ResidentPaymentProof[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [proofAssetId, setProofAssetId] = useState("");
  const [transactionCode, setTransactionCode] = useState("");

  const proofByPaymentId = useMemo(
    () => new Map(proofs.map((proof) => [proof.paymentId, proof])),
    [proofs],
  );

  const loadPayments = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await listResidentPayments(session.accessToken);

      setPayments(data.payments);
      setProofs(data.proofs);
      setSelectedPaymentId((current) => current || data.payments[0]?.id || "");
    } catch (error) {
      Alert.alert(
        "Could not load payments",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  async function pickProofImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setProofAssetId(result.assets[0]?.uri ?? "");
    }
  }

  async function handleSubmitProof() {
    if (!selectedPaymentId || !proofAssetId) {
      Alert.alert("Proof required", "Choose a payment and proof image.");
      return;
    }

    try {
      await submitPaymentProof(session.accessToken, selectedPaymentId, {
        proofImageAssetId: proofAssetId,
        transactionCode: transactionCode.trim() || undefined,
      });
      setProofAssetId("");
      setTransactionCode("");
      await loadPayments();
      Alert.alert("Submitted", "Payment proof has been sent for review.");
    } catch (error) {
      Alert.alert(
        "Could not submit proof",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={screenStyles.stack}>
          <View>
            <Text style={screenStyles.title}>Payments</Text>
            <Text style={screenStyles.body}>Monthly dues and proof review status.</Text>
          </View>
          {isLoading ? <ActivityIndicator color="#10b981" /> : null}
          <View style={screenStyles.card}>
            <Text style={screenStyles.sectionTitle}>Submit proof</Text>
            <View style={screenStyles.field}>
              <Text style={screenStyles.label}>Payment</Text>
              <View style={screenStyles.filterRow}>
                {payments
                  .filter((payment) => payment.status !== "PAID")
                  .slice(0, 3)
                  .map((payment) => (
                    <TouchableOpacity
                      key={payment.id}
                      onPress={() => setSelectedPaymentId(payment.id)}
                      style={[
                        screenStyles.button,
                        selectedPaymentId === payment.id
                          ? null
                          : screenStyles.buttonSecondary,
                        { flex: 1, minHeight: 40 },
                      ]}
                    >
                      <Text
                        style={[
                          screenStyles.buttonText,
                          selectedPaymentId === payment.id
                            ? null
                            : screenStyles.buttonTextSecondary,
                        ]}
                      >
                        {payment.month}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
            <TouchableOpacity
              onPress={pickProofImage}
              style={[screenStyles.button, screenStyles.buttonSecondary]}
            >
              <Text style={screenStyles.buttonTextSecondary}>
                {proofAssetId ? "Change proof image" : "Choose proof image"}
              </Text>
            </TouchableOpacity>
            <TextInput
              onChangeText={setTransactionCode}
              placeholder="Transaction code"
              style={screenStyles.input}
              value={transactionCode}
            />
            <TouchableOpacity onPress={handleSubmitProof} style={screenStyles.button}>
              <Text style={screenStyles.buttonText}>Submit proof</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      contentContainerStyle={screenStyles.scrollContent}
      data={payments}
      keyExtractor={(item) => item.id}
      onRefresh={loadPayments}
      refreshing={isLoading}
      renderItem={({ item }) => {
        const proof = proofByPaymentId.get(item.id);

        return (
          <View style={screenStyles.card}>
            <View style={screenStyles.row}>
              <Text style={screenStyles.sectionTitle}>{item.month}</Text>
              <Text style={screenStyles.chip}>{item.status}</Text>
            </View>
            <Text style={screenStyles.body}>
              Due {money(item.dueAmount)} / Paid {money(item.paidAmount)}
            </Text>
            <Text style={screenStyles.meta}>
              Proof: {proof?.status ?? "Not submitted"}
            </Text>
          </View>
        );
      }}
    />
  );
}
