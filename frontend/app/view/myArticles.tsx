import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "@/components/Card";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const MyArticles = () => {
  const [articles, setArticles] = useState<
    { _id: string; title: string; content: string; image?: string; category?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Error", "Please login to view your articles");
          return;
        }

        const userResponse = await axios.get(`${apiUrl}/api/user/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUsername = userResponse.data.user.username;
        setUsername(currentUsername);

        const postsResponse = await axios.get(`${apiUrl}/api/post/user/${currentUsername}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (postsResponse.data.success) {
          setArticles(postsResponse.data.posts || []);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
        Alert.alert("Error", "Failed to load your articles");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []);

  const handleDelete = async (articleId: string) => {
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

  const handleEdit = (article: {
    _id: string;
    title: string;
    content: string;
    image?: string;
    category?: string;
  }) => {
    router.push({
      pathname: "/createArticles",
      params: { postToEdit: JSON.stringify(article) },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4682B4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>My Articles</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Card
            heading={item.title}
            bgColor="#f4f4e4"
            image={item.image ? { uri: `${apiUrl}/${item.image}` } : undefined}
            content={
              <View>
                <Text numberOfLines={2}>{item.content}</Text>
                <View style={styles.buttonContainer}>
                  <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
                    <MaterialCommunityIcons name="pencil" size={20} color="white" />
                  </Pressable>
                  <Pressable style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="white" />
                  </Pressable>
                </View>
              </View>
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.noArticlesText}>You haven't posted any articles yet.</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#4682B4",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#ff5047",
    padding: 10,
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  noArticlesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
});

export default MyArticles;