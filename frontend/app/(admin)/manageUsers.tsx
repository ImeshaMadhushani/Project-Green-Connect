import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet ,Pressable, Alert} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const usersData = [
  { id: "1", name: "John Doe", role: "Volunteer", status: "Active", email: "john@example.com" },
  { id: "2", name: "GreenTech Org", role: "Organization", status: "Pending", email: "greentech@example.com" },
  { id: "3", name: "Emma Watson", role: "Volunteer", status: "Suspended", email: "emma@example.com" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(usersData);

  const handleAction = (id, action) => {
    Alert.alert(`${action} User`, `Are you sure you want to ${action} this user?`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.role}>Role: {item.role}</Text>
              <Text style={[styles.status, item.status === "Active" ? { color: "green" } : { color: "red" }]}>
                Status: {item.status}
              </Text>
            </View>
            <View style={styles.actions}>
              {/* 📝 Edit Button - Navigates to Edit Profile */}
              <Pressable onPress={() => router.push({ pathname: "/view/editProfile", params: item })}>
                <MaterialCommunityIcons name="pencil" size={22} color="#0496FF" />
              </Pressable>

              {/* 🚫 Suspend Button */}
              <Pressable onPress={() => handleAction(item.id, "Suspend")}>
                <MaterialCommunityIcons name="block-helper" size={22} color="red" />
              </Pressable>

              {/* 🗑 Delete Button */}
              <Pressable onPress={() => handleAction(item.id, "Delete")}>
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
  title: { fontSize: 23, fontWeight: "bold", color: "#2E7D32", marginBottom: 20, textAlign: "center" },
  card: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#E8F6D8", marginBottom: 10, borderRadius: 8, elevation: 4 },
  userName: { fontSize: 18, fontWeight: "bold" },
  role: { fontSize: 14, color: "#555" },
  status: { fontSize: 14 },
  actions: { flexDirection: "row", gap: 15 },
});

export default ManageUsers;
