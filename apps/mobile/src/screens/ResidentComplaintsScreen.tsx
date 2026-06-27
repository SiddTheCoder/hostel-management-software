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
  confirmComplaintResolution,
  createResidentComplaint,
  listResidentComplaints,
  type ResidentComplaint,
} from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentComplaints">;

export function ResidentComplaintsScreen({ route }: Props) {
  const { session } = route.params;
  const [category, setCategory] = useState("OTHER");
  const [complaints, setComplaints] = useState<ResidentComplaint[]>([]);
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");

  const loadComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listResidentComplaints(session.accessToken);

      setComplaints(data.complaints);
    } catch (error) {
      Alert.alert(
        "Could not load complaints",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [session.accessToken]);

  useEffect(() => {
    void loadComplaints();
  }, [loadComplaints]);

  async function submitComplaint() {
    try {
      await createResidentComplaint(session.accessToken, {
        category,
        description,
        isAnonymous,
        title,
      });
      setTitle("");
      setDescription("");
      await loadComplaints();
      Alert.alert("Submitted", "Complaint submitted.");
    } catch (error) {
      Alert.alert(
        "Could not submit complaint",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  async function confirmResolution(id: string) {
    try {
      await confirmComplaintResolution(session.accessToken, id);
      await loadComplaints();
      Alert.alert("Confirmed", "Resolution confirmed.");
    } catch (error) {
      Alert.alert(
        "Could not confirm",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={screenStyles.stack}>
          <View>
            <Text style={screenStyles.title}>Complaints</Text>
            <Text style={screenStyles.body}>
              Submit and track hostel issues.
            </Text>
          </View>
          {isLoading ? <ActivityIndicator color="#10b981" /> : null}
          <View style={screenStyles.card}>
            <Text style={screenStyles.sectionTitle}>New complaint</Text>
            <TextInput
              onChangeText={setTitle}
              placeholder="Title"
              style={screenStyles.input}
              value={title}
            />
            <TextInput
              onChangeText={setCategory}
              placeholder="Category"
              style={screenStyles.input}
              value={category}
            />
            <TextInput
              multiline
              onChangeText={setDescription}
              placeholder="Description"
              style={[
                screenStyles.input,
                { minHeight: 88, textAlignVertical: "top" },
              ]}
              value={description}
            />
            <TouchableOpacity
              onPress={() => setIsAnonymous((value) => !value)}
              style={[screenStyles.button, screenStyles.buttonSecondary]}
            >
              <Text style={screenStyles.buttonTextSecondary}>
                {isAnonymous ? "Anonymous: On" : "Anonymous: Off"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submitComplaint}
              style={screenStyles.button}
            >
              <Text style={screenStyles.buttonText}>Submit complaint</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      contentContainerStyle={screenStyles.scrollContent}
      data={complaints}
      keyExtractor={(item) => item.id}
      onRefresh={loadComplaints}
      refreshing={isLoading}
      renderItem={({ item }) => (
        <View style={screenStyles.card}>
          <View style={screenStyles.row}>
            <Text style={screenStyles.sectionTitle}>{item.title}</Text>
            <Text style={screenStyles.chip}>{item.status}</Text>
          </View>
          <Text style={screenStyles.body}>{item.description}</Text>
          {item.adminResponse ? (
            <Text style={screenStyles.meta}>Reply: {item.adminResponse}</Text>
          ) : null}
          {item.status === "RESOLVED" && !item.confirmedAt ? (
            <TouchableOpacity
              onPress={() => void confirmResolution(item.id)}
              style={screenStyles.button}
            >
              <Text style={screenStyles.buttonText}>Confirm resolution</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    />
  );
}
