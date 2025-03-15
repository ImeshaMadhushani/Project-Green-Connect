import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet,Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const feedbackData = [
  { id: "1", user: "John Doe", feedback: "Great app! Easy to use.", rating: 5 },
  { id: "2", user: "Emma Watson", feedback: "Needs more features for organizations.", rating: 3 },
];

const FeedbackReports = () => {
  const [feedback, setFeedback] = useState(feedbackData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Feedback</Text>
      <FlatList
        data={feedback}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.userName}>{item.user}</Text>
            <Text>{item.feedback}</Text>
            <Text>⭐ Rating: {item.rating}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 23, fontWeight: "bold", color: "#2E7D32", marginBottom: 20, textAlign: "center" },
  card: { padding: 15, backgroundColor: "#D8E5F7", marginBottom: 10, borderRadius: 8, elevation: 4 },
  userName: { fontSize: 18, fontWeight: "bold" },
});

export default FeedbackReports;
