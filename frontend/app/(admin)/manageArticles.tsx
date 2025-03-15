import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const articlesData = [
  { id: "1", title: "Eco-Friendly Living", author: "John Doe", status: "Pending", content: "This article discusses sustainable living practices..." },
  { id: "2", title: "Climate Change Awareness", author: "Jane Smith", status: "Approved", content: "Climate change is a pressing issue..." },
];

const ManageArticles = () => {
  const router = useRouter();
  const [articles, setArticles] = useState(articlesData);

  const handleAction = (id, action) => {
    Alert.alert(`${action} Article`, `Are you sure you want to ${action} this article?`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Articles</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => router.push({ pathname: "/view/articleView", params: item })} 
            style={styles.card}
          >
            <View>
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text>Author: {item.author}</Text>
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
  articleTitle: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", gap: 15 },
});

export default ManageArticles;
