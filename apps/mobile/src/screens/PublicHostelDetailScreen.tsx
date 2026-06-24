import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createPublicInquiry,
  getPublicHostel,
  type PublicHostel,
} from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "PublicHostelDetail">;

function rentRange(hostel: PublicHostel) {
  const currency = hostel.pricing?.currency ?? "NPR";
  const min = hostel.pricing?.monthlyRentMin;
  const max = hostel.pricing?.monthlyRentMax;

  if (min && max) {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}/mo`;
  }

  if (min) {
    return `From ${currency} ${min.toLocaleString()}/mo`;
  }

  return "Contact for rent";
}

export function PublicHostelDetailScreen({ route }: Props) {
  const { session, slug } = route.params;
  const [hostel, setHostel] = useState<PublicHostel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    message: "",
    name: session.user.name,
    phone: session.user.phone ?? "",
    preferredVisitDate: "",
  });

  const loadHostel = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getPublicHostel(slug);

      setHostel(data.hostel);
    } catch (error) {
      Alert.alert(
        "Could not load hostel",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadHostel();
  }, [loadHostel]);

  async function submitInquiry() {
    if (!hostel) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createPublicInquiry(hostel.id, {
        message: form.message || undefined,
        name: form.name,
        phone: form.phone,
        preferredVisitDate: form.preferredVisitDate || undefined,
      });
      setForm((current) => ({
        ...current,
        message: "",
        preferredVisitDate: "",
      }));
      Alert.alert("Inquiry submitted", "The hostel team can now follow up.");
    } catch (error) {
      Alert.alert(
        "Could not submit inquiry",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <View style={[screenStyles.container, screenStyles.stack]}>
        <ActivityIndicator color="#10b981" />
      </View>
    );
  }

  if (!hostel) {
    return (
      <View style={[screenStyles.container, screenStyles.stack]}>
        <Text style={screenStyles.title}>Hostel unavailable</Text>
        <TouchableOpacity onPress={loadHostel} style={screenStyles.button}>
          <Text style={screenStyles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={screenStyles.scrollContent}>
      <View style={screenStyles.card}>
        <Text style={screenStyles.chip}>
          {hostel.verificationStatus === "VERIFIED" ? "Verified" : "Public listing"}
        </Text>
        <Text style={screenStyles.title}>{hostel.name}</Text>
        <Text style={screenStyles.body}>
          {[hostel.location.address, hostel.location.area, hostel.location.city]
            .filter(Boolean)
            .join(", ")}
        </Text>
        <Text style={screenStyles.sectionTitle}>{rentRange(hostel)}</Text>
      </View>

      <View style={screenStyles.card}>
        <Text style={screenStyles.sectionTitle}>Details</Text>
        <Text style={screenStyles.body}>
          {hostel.description ||
            "This verified hostel has published facilities, room types, and inquiry access through HostelHub."}
        </Text>
        <Text style={screenStyles.meta}>
          Facilities: {hostel.facilities.slice(0, 6).join(" / ") || "Pending"}
        </Text>
        <Text style={screenStyles.meta}>
          Room types: {hostel.roomTypes.slice(0, 6).join(" / ") || "Pending"}
        </Text>
        <Text style={screenStyles.meta}>
          Vacant beds: {hostel.capacitySummary?.vacantBeds ?? "Ask hostel"}
        </Text>
      </View>

      <View style={screenStyles.card}>
        <Text style={screenStyles.sectionTitle}>Ask about availability</Text>
        <View style={screenStyles.field}>
          <Text style={screenStyles.label}>Name</Text>
          <TextInput
            onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
            style={screenStyles.input}
            value={form.name}
          />
        </View>
        <View style={screenStyles.field}>
          <Text style={screenStyles.label}>Phone</Text>
          <TextInput
            keyboardType="phone-pad"
            onChangeText={(value) =>
              setForm((current) => ({ ...current, phone: value }))
            }
            style={screenStyles.input}
            value={form.phone}
          />
        </View>
        <View style={screenStyles.field}>
          <Text style={screenStyles.label}>Preferred visit date</Text>
          <TextInput
            onChangeText={(value) =>
              setForm((current) => ({ ...current, preferredVisitDate: value }))
            }
            placeholder="YYYY-MM-DD"
            style={screenStyles.input}
            value={form.preferredVisitDate}
          />
        </View>
        <View style={screenStyles.field}>
          <Text style={screenStyles.label}>Message</Text>
          <TextInput
            multiline
            onChangeText={(value) =>
              setForm((current) => ({ ...current, message: value }))
            }
            placeholder="Ask about vacancy, food, move-in date..."
            style={[screenStyles.input, { minHeight: 96, paddingTop: 12 }]}
            value={form.message}
          />
        </View>
        <TouchableOpacity
          disabled={isSubmitting}
          onPress={submitInquiry}
          style={screenStyles.button}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={screenStyles.buttonText}>Submit inquiry</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
