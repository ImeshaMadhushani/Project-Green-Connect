import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

/* const projectsData = [
  { id: "1", title: "Tree Plantation Drive", org: "GreenTech Org", enrolled: 25, type: "Plantation", date: "April 10, 2025", time: "10:00 AM", location: "City Park", description: "A tree plantation event to promote greenery." ,  status: "Approved"},
  { id: "2", title: "Beach Cleanup", org: "Eco Warriors", enrolled: 40, type: "Waste Reduction", date: "May 5, 2025", time: "8:00 AM", location: "Sunny Beach", description: "Join us to clean up our beautiful beaches.", status: "Pending"},
]; */

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const router = useRouter();

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken"); 

      let filterParams = {};

          if (statusFilter) {
        filterParams.status = statusFilter;
      }
      if (organizationFilter) {
        filterParams.organization = organizationFilter;
      }
      
      const response = await axios.get(`${apiUrl}/api/project/all`, {
        headers: { Authorization: `Bearer ${token}` }, 
        params: filterParams, 
      });
      const projectsWithCount = await Promise.all(
        response.data.map(async (project) => {
          const count = await fetchEnrolledUsersCount(project._id);
          return { ...project, enrolled: count };
        })
      );
      setProjects(projectsWithCount);
    } catch (error) {
      console.error("Error fetching projects:", error);
      Alert.alert("Error", "Failed to fetch projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled users count
  const fetchEnrolledUsersCount = async (projectId) => {
    try {
      const token = await AsyncStorage.getItem("authToken"); 
      const response = await axios.get(
        `${apiUrl}/api/project/${projectId}/enrolledcount`,
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      return response.data.count;
    } catch (error) {
      console.error("Error fetching enrolled users count:", error);
      return 0;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, organizationFilter]);

  // Handle project deletion
  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              await axios.delete(`${apiUrl}/api/project/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setProjects((prevProjects) =>
                prevProjects.filter((project) => project._id !== id)
              );
            } catch (error) {
              console.error("Error deleting project:", error);
              Alert.alert(
                "Error",
                "Failed to delete project. Please try again later."
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Handle project approval
  const handleApprove = async (id) => {
    Alert.alert(
      "Approve Project",
      "Are you sure you want to approve this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              await axios.put(
                `${apiUrl}/api/project/${id}/status`,
                { status: "approved" },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              fetchProjects();
            } catch (error) {
              console.error("Error approving project:", error);
              Alert.alert(
                "Error",
                "Failed to approve project. Please try again later."
              );
            }
          },
        },
      ]
    );
  };

  // Handle project disapproval (reject)
  const handleDisapprove = async (id) => {
    Alert.alert(
      "Disapprove Project",
      "Are you sure you want to disapprove this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              await axios.put(
                `${apiUrl}/api/project/${id}/status`,
                { status: "rejected" },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              fetchProjects(); // Re-fetch projects after disapproval
            } catch (error) {
              console.error("Error disapproving project:", error);
              Alert.alert(
                "Error",
                "Failed to disapprove project. Please try again later."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Projects</Text>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Status"
          value={statusFilter}
          onChangeText={setStatusFilter}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Organization"
          value={organizationFilter}
          onChangeText={setOrganizationFilter}
        />
      </View>

      <Pressable style={styles.filterButton} onPress={fetchProjects}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </Pressable>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/view/projectSingleView",
                  params: item,
                })
              }
            >
              <View>
                <Text style={styles.projectTitle}>{item.projectName}</Text>
                <Text>Organization: {item.organizationId?.name}</Text>
                <Text>Enrolled: {item.enrolled} volunteers</Text>
                <Text>Status: {item.status}</Text>
              </View>
              <View style={styles.actions}>
                <Pressable onPress={() => handleApprove(item._id)}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={25}
                    color="green"
                  />
                </Pressable>

                <Pressable onPress={() => handleDisapprove(item._id)}>
                  <MaterialCommunityIcons
                    name="close-circle-outline"
                    size={25}
                    color="orange"
                  />
                </Pressable>

                <Pressable onPress={() => handleDelete(item._id)}>
                  <MaterialCommunityIcons name="delete" size={25} color="red" />
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 23, fontWeight: "bold", color: "#2E7D32", marginBottom: 20, textAlign: "center" },
  card: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#E8F6D8", marginBottom: 10, borderRadius: 8, elevation: 4 },
  projectTitle: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", gap: 15 },
   filterContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  filterInput: { borderWidth: 1, borderColor: "#ccc", padding: 8, flex: 1, marginRight: 10 },
  filterButton: { padding: 10, backgroundColor: "#2E7D32", borderRadius: 5, alignItems: "center" },
  filterButtonText: { color: "#fff", fontWeight: "bold" },
});

export default ManageProjects;
