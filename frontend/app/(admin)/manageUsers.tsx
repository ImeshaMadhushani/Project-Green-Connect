import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

/* const usersData = [
  { id: "1", name: "John Doe", role: "Volunteer", status: "Active", email: "john@example.com" },
  { id: "2", name: "GreenTech Org", role: "Organization", status: "Pending", email: "greentech@example.com" },
  { id: "3", name: "Emma Watson", role: "Volunteer", status: "Suspended", email: "emma@example.com" },
]; */

const ManageUsers = () => {
  const [users, setUsers] = useState<{ _id: string; name: string; role: string; status?: string; isApproved?: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");


  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/user/getAllUsers`);
      setUsers(response.data.users);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch users!");
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchUsers();
    }, []);
  
    // Filter users based on selected role and status
  const filteredUsers = users.filter((user) => {
    const matchesRole =
      roleFilter === "All" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    
     let matchesStatus = true;
     if (statusFilter !== "All") {
      if (user.role === "organization") {
        if (statusFilter === "Active") {
          matchesStatus = user.isApproved === true;
        } else if (statusFilter === "Pending") {
          matchesStatus = user.isApproved === undefined;
        } else if (statusFilter === "Rejected") {
          matchesStatus = user.isApproved === false;
        }
      } else {
        matchesStatus = statusFilter === "Active"; // Non-organization users are always active
      }
    }

    return matchesRole && matchesStatus;
  });


  const handleAction = (id: string, action: "Suspend" | "Delete" | "Approve") => {
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
                await axios.delete(
                  `${apiUrl}/api/user/delete/${id}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              } else if (action === "Approve") {
                await axios.put(
                  `${apiUrl}/api/user/approveOrganization/${id}`,
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              }
              fetchUsers();
              Alert.alert("Success", `User ${action.toLowerCase()}ed successfully.`);
            } catch (error) {
              Alert.alert("Error", `Failed to ${action.toLowerCase()} user.`);
            }
          },
        },
      ]
    );
  };

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
          <Picker.Item label="Pending" value="Pending" />
          {/*  <Picker.Item label="Approved" value="Approved" /> */}
          <Picker.Item label="Rejected" value="Rejected" />
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
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.role}>Role: {item.role}</Text>
              <Text
                style={[
                  styles.status,
                  item.role === "organization"
                    ? item.isApproved === true
                      ? { color: "green" }
                      : item.isApproved === false
                      ? { color: "red" }
                      : { color: "orange" }
                    : { color: "green" },
                ]}
              >
                Status:{" "}
                {item.role === "organization"
                  ? item.isApproved === true
                    ? "Approved"
                    : item.isApproved === false
                    ? "Rejected"
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

              {item.role === "organization" && (
                <Pressable onPress={() => handleAction(item._id, "Approve")}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color="green"
                  />
                </Pressable>
              )}

              {/* Suspend Button */}
              {item.role === "organization" && (
                <Pressable onPress={() => handleAction(item._id, "Suspend")}>
                  <MaterialCommunityIcons
                    name="block-helper"
                    size={22}
                    color="red"
                  />
                </Pressable>
              )}

              {/* 🗑 Delete Button */}
              <Pressable onPress={() => handleAction(item._id, "Delete")}>
                <MaterialCommunityIcons name="delete" size={22} color="black" />
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#E8F6D8",
    marginBottom: 10,
    borderRadius: 8,
    elevation: 4,
  },
  userName: { fontSize: 18, fontWeight: "bold" },
  role: { fontSize: 14, color: "#555" },
  status: { fontSize: 14 },
  actions: { flexDirection: "row", gap: 15 },
 /*  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filter: { width: 150, height: 40 }, */
});

export default ManageUsers;
