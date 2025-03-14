import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import Card from "@/components/Card";
import { useRouter } from "expo-router";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Project type icons
const projectIcons: { [key: string]: string } = {
  "Waste Reduction": "recycle",
  "Plantation": "tree",
  "Disaster Preparedness": "alert-circle-outline",
  "Environmental Awareness Campaigns": "bullhorn-outline",
  "Sustainable Gardening & Agriculture": "sprout",
};


interface Project {
  _id: string;
  projectName: string;
  date: string;
  time: string;
  location: string;
  projectType: string;
}

const MyProjects = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  interface EnrolledUser {
    _id: string;
    name: string;
    email: string;
  }
  
  const [enrolledUsers, setEnrolledUsers] = useState<EnrolledUser[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch User Role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${apiUrl}/api/user/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User Data:", response.data.user);

        setUserRole(response.data.user.role);
        console.log("User Role:", response.data.user.role);

        setUserId(response.data.user.id);
        console.log("User ID:", response.data.user.id);

        fetchProjects(response.data.user.role, response.data.user.id);
      } catch (error) {
        console.error("Failed to fetch user role", error);
        Alert.alert("Error", "Failed to fetch user role.");
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Fetch projects based on role
  const fetchProjects = async (role: string, id: string) => {
    try {
      console.log("Fetching projects for role:", role, "with ID:", id);
      setLoading(true);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("No token found");

      let response;
      const headers = { Authorization: `Bearer ${token}` };

      if (role === "volunteer") {
        //console.log(`${apiUrl}/api/project/${id}/enrolled-users`);
        response = await axios.get(
          `${apiUrl}/api/project/${id}/enrolled-users`,
          { headers }
        );
      } else if (role === "organization") {
        //console.log(`${apiUrl}/api/project/organization/${id}`);
        response = await axios.get(`${apiUrl}/api/project/organization/${id}`, {
          headers,
        });
      } else {
        throw new Error("Invalid user role");
      }

      //console.log("API Response:", response.data);

      setProjects(response.data || []);
      //console.log("Projects fetched:", response.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      Alert.alert("Error", "Failed to fetch projects.");
    }
  };

  // Unenroll Function
  const handleUnenroll = async (id: string) => {
    Alert.alert(
      "Unenroll",
      "Are you sure you want to unenroll from this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unenroll",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              if (!token) throw new Error("No token found");

              const response = await axios.put(
                `${apiUrl}/api/project/${id}/unenroll`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (response.status === 200) {
                setProjects((prev) => prev.filter((proj) => proj._id !== id));
                Alert.alert("Success", "You have unenrolled from the project.");
              }
            } catch (error) {
              console.error("Unenroll failed", error);
              Alert.alert("Error", "Failed to unenroll from the project.");
            }
          },
        },
      ]
    );
  };

  //Edit Project for organization
  const handleEditProject = (id: string) => {
    Alert.alert("Edit Project", "Are you sure you want to edit this project?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Edit",
        style: "default",
        onPress: () => {
          // Navigate to the edit screen and pass project details
          router.push({
            pathname: "/view/projectEdit", // Ensure this route exists
            params: { id }, // You can pass project ID and other details if needed
          });
        },
      },
    ]);
  };

  const viewEnrolledUsers = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Auth Token:", token);

      if (!token) throw new Error("No token found");

      console.log("Fetching enrolled users for project ID:", id);

      const response = await axios.get(
        `${apiUrl}/api/project/volunteer/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API Response:", response.data);

    if (response.status === 200 && response.data?.success) {
      // Check if the enrolledProjects array exists
      if (response.data.enrolledUsers) {
        setEnrolledUsers(response.data.enrolledUsers);
        setModalVisible(true);
      } else {
        throw new Error("Enrolled projects not found in response");
      }
    } else {
      throw new Error("Failed to fetch enrolled users");
    }
    } catch (error) {
      console.error("Error fetching enrolled users", error);
      Alert.alert("Error", "Failed to load enrolled users.");
    }
  };

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
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Card
              heading={item.projectName}
              bgColor="#f4f4e4"
              iconName={
                projectIcons[item.projectType as keyof typeof projectIcons]
              }
              content={
                <View>
                  <Text style={styles.text2}>📅 {item.date}</Text>
                  <Text style={styles.text2}>⏰ {item.time}</Text>
                  <Text style={styles.text2}>📍 {item.location}</Text>

                  {/* Action Buttons based on Role */}
                  {/* Buttons based on Role */}
                  {userRole === "volunteer" ? (
                    <Pressable
                      style={styles.unenrollButton}
                      onPress={() => handleUnenroll(item._id)}
                    >
                      <Text style={styles.unenrollText}>Unenroll</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.orgActions}>
                      <Pressable
                        style={styles.editButton}
                        onPress={() => handleEditProject(item._id)}
                      >
                        <MaterialCommunityIcons
                          name="pencil-outline"
                          size={22}
                          color="white"
                        />
                      </Pressable>
                      <Pressable
                        style={styles.viewUsersButton}
                        onPress={() => viewEnrolledUsers(item._id)}
                      >
                        <MaterialCommunityIcons
                          name="account-group-outline"
                          size={22}
                          color="white"
                        />
                      </Pressable>
                    </View>
                  )}
                </View>
              }
              /*     onPress={() =>
                router.push({
                  pathname: "/view/projectSingleView",
                  params: { ...item },
                })
              } */
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noProjectsText}>
            {userRole === "volunteer"
              ? "You haven't enrolled in any projects yet."
              : "You haven't created any projects yet."}
          </Text>
        }
      />

      {/* Modal to Display Enrolled Users */}
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enrolled Users</Text>
          {enrolledUsers.length > 0 ? (
            <FlatList
              data={enrolledUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  {/* <Image
                    source={{ uri: item.profile_picture }}
                    style={styles.profileImage}
                  /> */}
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noUsersText}>
              No users enrolled in this project.
            </Text>
          )}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  editButton: {
    backgroundColor: "#28a745",
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
  modalContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#777",
  },
  noUsersText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  text2: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 10,
  }
});

export default MyProjects;
