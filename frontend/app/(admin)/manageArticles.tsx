import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ManageArticles = () => {
  const router = useRouter();
  interface Article {
    _id: string;
    title: string;
    username?: string;
  }
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Error", "Please login to view articles");
          return;
        }

        const postsResponse = await axios.get(`${apiUrl}/api/post/get-posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming the response structure is { success: true, posts: [...] }
        if (postsResponse.data.success) {
          setArticles(postsResponse.data.posts || []);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        Alert.alert("Error", "Failed to load articles");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const handleDelete = (articleId: string) => {
    Alert.alert(
      "Delete Article",
      "Are you sure you want to delete this article?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              await axios.delete(`${apiUrl}/api/post/${articleId}/delete`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              setArticles((prevArticles) =>
                prevArticles.filter((article) => article._id !== articleId)
              );
            } catch (error) {
              Alert.alert("Error", "Failed to delete article");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Articles</Text>
      <FlatList
        data={articles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => router.push({ pathname: "/view/articleView", params: { id: item._id }})} 
            style={styles.card}
          >
            <View>
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text>Author: {item.username || "Unknown"}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => handleDelete(item._id)}>
                <MaterialCommunityIcons name="delete" size={25} color="red" />
              </Pressable>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#777", fontSize: 16 }}>
            No articles available.
          </Text>
        }
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