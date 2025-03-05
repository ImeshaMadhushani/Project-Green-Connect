import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import Card from "@/components/Card";
import { useRouter } from "expo-router";

// Mocked user role (Replace this with actual authentication state)
const loggedInUser = {
  role: "volunteer", // Change to "organization" to test both views
  userId: "user_123",
};

// Mock API response (Replace with actual API calls)
const mockProjects = [
  {
    id: "1",
    type: "Waste Reduction",
    title: "Plastic-Free Market Campaign",
    date: "November 10, 2024",
    time: "9.00 a.m.",
    location: "Vavunia, Market",
    description: "A campaign to reduce plastic waste in the local market.",
    createdBy: "org_001", // Organization ID
    enrolledUsers: ["user_123", "user_456"], // List of enrolled users
  },
  {
    id: "2",
    type: "Plantation",
    title: "Tree Planting Drive",
    date: "November 15, 2024",
    time: "10.00 a.m.",
    location: "Colombo Park",
    description: "Join us in planting trees to make our city greener.",
    createdBy: "org_001",
    enrolledUsers: ["user_789"],
  },
  {
    id: "3",
    type: "Sustainable Gardening & Agriculture",
    title: "Eco-Friendly Fair",
    date: "December 5, 2024",
    time: "11.30 a.m.",
    location: "Kandy Town Hall",
    description: "Promoting sustainable gardening and eco-friendly farming.",
    createdBy: "user_123", // This project was created by the logged-in user
    enrolledUsers: ["user_123"],
  },
];

// Project type icons
const projectIcons = {
  "Waste Reduction": "recycle",
  "Plantation": "tree",
  "Disaster Preparedness": "alert-circle-outline",
  "Environmental Awareness Campaigns": "bullhorn-outline",
  "Sustainable Gardening & Agriculture": "sprout",
};

const MyProjects = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);

  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>My Projects</Text>
        <View style={{ width: 28 }} /> {/* Placeholder for alignment */}
      </View>

      {/* Project List */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Card
              heading={item.title}
              bgColor="#f4f4e4"
              iconName={projectIcons[item.type]}
              content={
                <View>
                  <Text>📅 {item.date}</Text>
                  <Text>⏰ {item.time}</Text>
                  <Text>📍 {item.location}</Text>

                  {/* Action Buttons based on Role */}
                  {loggedInUser.role === "volunteer" ? (
                    <Pressable style={styles.unenrollButton} onPress={() => handleUnenroll(item.id)}>
                      <Text style={styles.unenrollText}>Unenroll</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.orgActions}>
                      <Pressable style={styles.deleteButton} onPress={() => handleDeleteProject(item.id)}>
                        <MaterialCommunityIcons name="trash-can-outline" size={22} color="white" />
                      </Pressable>
                      <Pressable style={styles.viewUsersButton} onPress={() => viewEnrolledUsers(item.id)}>
                        <MaterialCommunityIcons name="account-group-outline" size={22} color="white" />
                      </Pressable>
                    </View>
                  )}
                </View>
              }
              onPress={() => router.push({ pathname: "/view/projectSingleView", params: item })}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noProjectsText}>
            {loggedInUser.role === "volunteer" ? "You haven't enrolled in any projects yet." : "You haven't created any projects yet."}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  unenrollButton: {
    marginTop: 15,
    marginLeft: 50,
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    maxWidth: 100,
  },
  unenrollText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  orgActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  viewUsersButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  noProjectsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
});

export default MyProjects;
