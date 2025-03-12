import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const ArticleView = () => {
  const { title, description, image, author, time, comments, likes } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color="#000" />
        </Pressable>
        <Text style={styles.logo}>GreenConnect</Text>
      </View>

      {/* Article Image 
      {image ? (
        <Image source={{ uri: image }} style={styles.articleImage} />
      ) : (
        <Text style={styles.noImageText}>No Image Available</Text>
      )}
*/}
      {/* Article Details */}
      <View style={styles.articleContent}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.authorRow}>
          <FontAwesome name="user" size={16} color="#555" />
          <Text style={styles.author}>{author} • {time}</Text>
        </View>

        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Engagement Section */}
      <View style={styles.engagementRow}>
        <Text style={styles.engagement}><FontAwesome name="comment" size={16} /> {comments} Comments</Text>
        <Text style={styles.engagement}><FontAwesome name="heart" size={16} /> {likes} Likes</Text>
        <Pressable>
          <FontAwesome name="share" size={16} color="#007bff" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#f8f8f8",
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
  },
  articleImage: {
    width: "100%",
    height: 200,
  },
  articleContent: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    color: "#333",
  },
  engagementRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  engagement: {
    fontSize: 14,
    color: "#555",
  },
});

export default ArticleView;
