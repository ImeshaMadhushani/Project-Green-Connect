import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "@/components/Card"; // Ensure correct import path

const MyArticles = () => {
  const navigation = useNavigation();

  // Sample data (Replace with API call to fetch logged-in user's articles)
  const [articles, setArticles] = useState([
    {
      id: "1",
      title: "Saving Energy at Home",
      content: "Lower your bills and protect the environment...",
      image: require("@/assets/images/bg.jpg"), // Ensure correct path
    },
    {
      id: "2",
      title: "The Future of Solar Energy",
      content: "How solar power is changing the world...",
      image: require("@/assets/images/bg.jpg"),
    },
    {
      id: "3",
      title: "Eco-Friendly Lifestyle Tips",
      content: "Simple changes to make your lifestyle more eco-friendly...",
      image: require("@/assets/images/bg.jpg"),
    },
  ]);

  // Handle delete article
  const handleDelete = (articleId: string) => {
    Alert.alert(
      "Delete Article",
      "Are you sure you want to delete this article?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setArticles((prevArticles) =>
              prevArticles.filter((article) => article.id !== articleId)
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>My Articles</Text>
        <View style={{ width: 28 }} /> {/* Placeholder to balance layout */}
      </View>

      {/* Articles List */}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            heading={item.title}
            bgColor="#f4f4e4"
            image={item.image}
            content={
              <View>
                <Text numberOfLines={2}>{item.content}</Text>
                {/* Delete Button inside Card */}
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={20} color="white" />
                </Pressable>
              </View>
            }
            // onPress={() =>
            //   navigation.navigate("ArticleSingleView", { article: item })
            // }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.noArticlesText}>
            You haven't posted any articles yet.
          </Text>
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
    fontWeight: 600,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#ff5047",
    padding: 10,
    borderRadius: 10,
    marginLeft: 180,
    marginTop: 20,
    width: 40,
    height: 40,
  },
  noArticlesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
});

export default MyArticles;
