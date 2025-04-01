import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  RefreshControl,
  Modal,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";




import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* import { WebView } from 'react-native-webview'; */


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

/* const usersData = [
  { id: "1", name: "John Doe", role: "Volunteer", status: "Active", email: "john@example.com" },
  { id: "2", name: "GreenTech Org", role: "Organization", status: "Pending", email: "greentech@example.com" },
  { id: "3", name: "Emma Watson", role: "Volunteer", status: "Suspended", email: "emma@example.com" },
]; */

const ManageUsers = () => {
  const [users, setUsers] = useState<
    Array<{
      _id: string;
      name: string;
      role: string;
      status?: string;
      isApproved?: boolean;
      NameOfOrganization?: string;
     /*  legalDocument?: string; */
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalVisible, setModalVisible] = useState(false);
  /* const [legalDocument, setLegalDocument] = useState(""); */

  // Fetch users from backend
const fetchUsersAndOrganizations = async () => {
  try {
    const usersResponse = await axios.get(`${apiUrl}/api/user/getAllUsers`);
    console.log('Users:', usersResponse.data.users); // Log users data
    const organizationsResponse = await axios.get(`${apiUrl}/api/organization/all`);
    console.log('Organizations:', organizationsResponse.data.org); // Log organizations data

    // Process the response as before
    const users = Array.isArray(usersResponse.data.users) ? usersResponse.data.users : [];
    const organizations = Array.isArray(organizationsResponse.data.org) ? organizationsResponse.data.org : [];

    const combinedData = [
      ...users.map((user) => ({ ...user, role: "Volunteer" })),
      ...organizations.map((org) => ({
        ...org,
        role: "Organization",
        
      })),
    ];

    console.log('Combined Data:', combinedData); // Check combined data

    setUsers(combinedData);
  } catch (error) {
    Alert.alert("Error", "Failed to fetch users and organizations!");
    console.error("Fetch error:", error);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchUsersAndOrganizations();
}, []);



  const onRefresh = useCallback(() => {
    setRefreshing(true);
     fetchUsersAndOrganizations();
  }, []);

  // Filter users based on selected role and status
   const filteredUsers = users.filter((user) => {
    const matchesRole =
      roleFilter === "All" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();

    let matchesStatus = true;
    if (statusFilter !== "All") {
      if (user.role === "Organization") {
        if (statusFilter === "Active") {
          matchesStatus = user.isApproved === true;
        } else if (statusFilter === "Suspended") {
          matchesStatus = user.isApproved === false;
        }
      } else {
        matchesStatus = statusFilter === "Active"; // Non-organization users are always active
      }
    }

    return matchesRole && matchesStatus;
  });
 
  const handleAction = (
    id: string,
    action: "Suspend" | "Delete" | "Approve"
  ) => {
    Alert.alert(
      `${action} User`,
      `Are you sure you want to ${action} this user?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              if (!token) {
                console.error("No token found!");
                return;
              }

              if (action === "Suspend") {
                await axios.put(
                  `${apiUrl}/api/user/suspendOrganization/${id}`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              } else if (action === "Delete") {
                await axios.delete(`${apiUrl}/api/user/delete/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
              } else if (action === "Approve") {
                await axios.put(
                  `${apiUrl}/api/user/approveOrganization/${id}`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              }
              fetchUsersAndOrganizations();
              Alert.alert(
                "Success",
                `User ${action.toLowerCase()}ed successfully.`
              );
            } catch (error) {
              Alert.alert("Error", `Failed to ${action.toLowerCase()} user.`);
            }
          },
        },
      ]
    );
  };

  /* const fetchLegalDocument = async (id: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/user/legalDocument/${id}`
      );
       console.log("Legal Document URL:", response.data.legalDocument);
      setLegalDocument(response.data.legalDocument);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch legal document.");
      console.error("Fetch legal document error:", error);
    }
  };

  const viewLegalDocument = (id: string) => {
    fetchLegalDocument(id);
  };

    const openDocument = () => {
      Linking.openURL(legalDocument).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    };
 */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>

      <View>
        <Picker
          selectedValue={roleFilter}
          onValueChange={(itemValue) => setRoleFilter(itemValue)}
          /* style={styles.filter} */
        >
          <Picker.Item label="All Roles" value="All" />
          <Picker.Item label="Volunteer" value="Volunteer" />
          <Picker.Item label="Organization" value="Organization" />
        </Picker>

        <Picker
          selectedValue={statusFilter}
          onValueChange={(itemValue) => setStatusFilter(itemValue)}
          /*  style={styles.filter} */
        >
          <Picker.Item label="All Statuses" value="All" />
          <Picker.Item label="Active" value="Active" />
          {/*  <Picker.Item label="Pending" value="Pending" /> */}
          {/*  <Picker.Item label="Approved" value="Approved" /> */}
          <Picker.Item label="Suspended" value="Suspended" />
        </Picker>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.userName}>
                {item.role === "Organization"
                  ? item.NameOfOrganization || "No Organization Name"
                  : item.name}
              </Text>
              <Text style={styles.role}>Role: {item.role}</Text>
              <Text
                style={[
                  styles.status,
                  item.role === "Organization"
                    ? item.isApproved === true
                      ? { color: "green" }
                      : item.isApproved === false
                      ? { color: "red" }
                      : { color: "orange" }
                    : { color: "green" },
                ]}
              >
                Status:{" "}
                {item.role === "Organization"
                  ? item.isApproved === true
                    ? "Approved"
                    : item.isApproved === false
                    ? "Suspended"
                    : "Pending"
                  : "Active"}
              </Text>
            </View>
            <View style={styles.actions}>
              {/* 📝 Edit Button - Navigates to Edit Profile */}
              {/*     <Pressable
                onPress={() =>
                  router.push({ pathname: "/view/editProfile", params: item })
                }
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={22}
                  color="#0496FF"
                />
              </Pressable> */}

              {/*        {item.role === "Organization" && (
                <Pressable onPress={() => handleAction(item._id, "Approve")}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color="green"
                  />
                </Pressable>
              )} */}

              {/* Suspend Button */}
              {item.role === "Organization" && (
                <Pressable onPress={() => handleAction(item._id, "Suspend")}>
                  <MaterialCommunityIcons
                    name="block-helper"
                    size={22}
                    color="red"
                  />
                </Pressable>
              )}

              {/* {item.role === "organization" && (
                <Pressable onPress={() => viewLegalDocument(item._id)}>
                  <MaterialCommunityIcons
                    name="file-document"
                    size={22}
                    color="blue"
                  />
                </Pressable>
              )} */}

              {/* 🗑 Delete Button */}
              <Pressable onPress={() => handleAction(item._id, "Delete")}>
                <MaterialCommunityIcons name="delete" size={22} color="black" />
              </Pressable>
            </View>
          </View>
        )}
      />

      {/*  <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Legal Document</Text>
          <Pressable onPress={openDocument}>
            <Text style={styles.link}>Open Legal Document</Text>
          </Pressable>
          <Pressable onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </Pressable>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
    textAlign: "center",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filter: {
    width: "45%",
    height: 40,
  },
  card: {
    flexDirection: "column", // Change direction to column to stack content vertically
    justifyContent: "space-between", // Distribute space between text and actions
    padding: 15,
    backgroundColor: "#E8F6D8",
    marginBottom: 10,
    borderRadius: 8,
    elevation: 4,
    height: 120, // Set a height to ensure enough space for the actions to be at the bottom
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#555",
  },
  status: {
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between", // Distributes the icons evenly
    alignItems: "center", // Align icons vertically in the center
    gap: 15, // Adjusts the space between icons
    marginTop: "auto", // This ensures the actions are pushed to the bottom
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    color: "#0496FF",
    fontSize: 16,
  },
  link: {
    color: "#0496FF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default ManageUsers;
