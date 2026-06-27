import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import { submitResidentReview } from "../api/client";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { screenStyles } from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ResidentReviews">;

export function ResidentReviewsScreen({ route }: Props) {
  const { session } = route.params;
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("5");

  async function submitReview() {
    try {
      await submitResidentReview(session.accessToken, {
        comment: comment.trim() || undefined,
        overallRating: Number(rating),
      });
      setComment("");
      Alert.alert("Submitted", "Review submitted.");
    } catch (error) {
      Alert.alert(
        "Could not submit review",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  }

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.stack}>
        <Text style={screenStyles.title}>Reviews</Text>
        <Text style={screenStyles.body}>
          Only verified residents can review.
        </Text>
        <TextInput
          keyboardType="number-pad"
          onChangeText={setRating}
          placeholder="Overall rating 1-5"
          style={screenStyles.input}
          value={rating}
        />
        <TextInput
          multiline
          onChangeText={setComment}
          placeholder="Comment"
          style={[
            screenStyles.input,
            { minHeight: 96, textAlignVertical: "top" },
          ]}
          value={comment}
        />
        <TouchableOpacity onPress={submitReview} style={screenStyles.button}>
          <Text style={screenStyles.buttonText}>Submit review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
