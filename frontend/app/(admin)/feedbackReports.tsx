import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet,Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

/* const feedbackData = [
  { id: "1", user: "John Doe", feedback: "Great app! Easy to use.", rating: 5 },
  { id: "2", user: "Emma Watson", feedback: "Needs more features for organizations.", rating: 3 },
]; */

const FeedbackReports = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch feedback data from backend API
  const fetchFeedback = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken"); // Retrieve API URL from AsyncStorage
      if (apiUrl) {
        const response = await axios.get(`${apiUrl}/api/feedback/feedback/all`);
        setFeedback(response.data);
        setLoading(false);
      } else {
        Alert.alert("Error", "API URL is not set");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setLoading(false);
      Alert.alert("Error", "Unable to fetch feedback.");
    }
  };

  // Approve Feedback
  const approveFeedback = async (feedbackId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.put(
        `${apiUrl}/api/feedback/feedback/approve/${feedbackId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Feedback approved successfully!");
      fetchFeedback(); // Refresh list after approval
    } catch (error) {
      console.error("Error approving feedback:", error);
      Alert.alert("Error", "Unable to approve feedback.");
    }
  };

  // Delete Feedback
  const deleteFeedback = async (feedbackId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.delete(`${apiUrl}/api/feedback/feedback/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Deleted", "Feedback deleted successfully!");
      fetchFeedback(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting feedback:", error);
      Alert.alert("Error", "Unable to delete feedback.");
    }
  };

  const rejectFeedback = async (feedbackId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.put(
        `${apiUrl}/api/feedback/feedback/reject/${feedbackId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Rejected", "Feedback rejected successfully!");
      fetchFeedback(); // Refresh list after rejection
    } catch (error) {
      console.error("Error rejecting feedback:", error);
      Alert.alert("Error", "Unable to reject feedback.");
    }
  };


  // Fetch feedback on component mount
  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Feedback</Text>
      <FlatList
        data={feedback}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.userName}>{item.username}</Text>
            <Text>{item.comment}</Text>
            <Text>⭐ Rating: {item.rating}</Text>
            <Text style={styles.status}>📝 Status: {item.status}</Text>

            <View style={styles.actions}>
              <Pressable
                onPress={() => approveFeedback(item._id)}
                style={[styles.button, styles.approve]}
              >
                <MaterialCommunityIcons name="check" size={20} color="white" />
                <Text style={styles.buttonText}>Approve</Text>
              </Pressable>

              <Pressable
                onPress={() => rejectFeedback(item._id)}
                style={[styles.button, styles.reject]}
                disabled={item.status === "rejected"} // Disable if already rejected
              >
                <MaterialCommunityIcons name="close" size={20} color="white" />
                <Text style={styles.buttonText}>Reject</Text>
              </Pressable>

              
              <Pressable
                onPress={() => deleteFeedback(item._id)}
                style={[styles.button, styles.delete]}
              >
                <MaterialCommunityIcons name="delete" size={20} color="white" />
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    padding: 15,
    backgroundColor: "#D8E5F7",
    marginBottom: 10,
    borderRadius: 8,
    elevation: 4,
  },
  userName: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", marginTop: 10, gap: 10 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 5,
  },
  approve: { backgroundColor: "#4CAF50", paddingHorizontal: 12 },
  delete: { backgroundColor: "#E53935", paddingHorizontal: 12 },
  buttonText: { color: "white", fontWeight: "bold", marginLeft: 5 },
  status: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF9800",
  },
  reject: { backgroundColor: "#FF9800", paddingHorizontal: 12 },
});

export default FeedbackReports;
