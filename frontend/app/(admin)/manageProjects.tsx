import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const projectsData = [
  { id: "1", title: "Tree Plantation Drive", org: "GreenTech Org", enrolled: 25, type: "Plantation", date: "April 10, 2025", time: "10:00 AM", location: "City Park", description: "A tree plantation event to promote greenery." ,  status: "Approved"},
  { id: "2", title: "Beach Cleanup", org: "Eco Warriors", enrolled: 40, type: "Waste Reduction", date: "May 5, 2025", time: "8:00 AM", location: "Sunny Beach", description: "Join us to clean up our beautiful beaches.", status: "Pending"},
];

const ManageProjects = () => {
  const [projects, setProjects] = useState(projectsData);
  const router = useRouter();

  const handleDelete = (id) => {
    Alert.alert("Delete Project", "Are you sure you want to delete this project?");
  };

  const handleAction = (id, action) => {
    Alert.alert(`${action} Project`, `Are you sure you want to ${action} this project?`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable 
            style={styles.card} 
            onPress={() => router.push({ pathname: "/view/projectSingleView", params: item })}
          >
            <View>
              <Text style={styles.projectTitle}>{item.title}</Text>
              <Text>Organization: {item.org}</Text>
              <Text>Enrolled: {item.enrolled} volunteers</Text>
              <Text>Status: {item.status}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => handleAction(item.id, "Approve")}>
                <MaterialCommunityIcons name="check-circle-outline" size={25} color="green" />
              </Pressable>
              <Pressable onPress={() => handleAction(item.id, "Delete")}>
                <MaterialCommunityIcons name="delete" size={25} color="red" />
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 23, fontWeight: "bold", color: "#2E7D32", marginBottom: 20, textAlign: "center" },
  card: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#E8F6D8", marginBottom: 10, borderRadius: 8, elevation: 4 },
  projectTitle: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", gap: 15 },
});

export default ManageProjects;
