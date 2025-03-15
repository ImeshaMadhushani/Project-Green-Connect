import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const usersData = [
  { id: "1", name: "John Doe", role: "Volunteer", status: "Active", email: "john@example.com" },
  { id: "2", name: "GreenTech Org", role: "Organization", status: "Pending", email: "greentech@example.com" },
  { id: "3", name: "Emma Watson", role: "Volunteer", status: "Suspended", email: "emma@example.com" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState(usersData);

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
});

export default ManageUsers;
