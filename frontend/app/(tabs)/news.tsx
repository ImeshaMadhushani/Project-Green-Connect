import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Card from "@/components/Card";
import { router } from "expo-router";
import axios from "axios";

const plus = require("../../assets/images/plus.png");
const scope = require("../../assets/images/scope.png");

const News = () => {
  interface Post {
    _id: string;
    title: string;
    image: string;
    username: string;
    content: string;
  }
  
  const [posts, setPosts] = useState<Post[]>([]); // State to store posts
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState<string | null>(""); // State to handle errors

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://192.168.43.190:5000/api/post/get-posts");
      if (response.data.success) {
        setPosts(response.data.posts); // Set the fetched posts
      } else {
        setError("Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("An error occurred while fetching posts");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render the UI
  const ui = (
    <>
      <View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.container}>
            <View style={{ width: "100%", padding: 10 }}>
              <Text style={{ fontSize: 25, textAlign: "center", fontWeight: "bold" }}>
                Articles/News
              </Text>
              <View
                style={{
                  padding: 3,
                  margin: 10,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TextInput placeholder="Search" style={{ flex: 1, borderWidth: 0 }} />
                <Pressable onPress={() => {}}>
                  <Image source={scope} style={{ width: 30, height: 30 }} />
                </Pressable>
              </View>
            </View>

            {/* Render posts dynamically */}
            {posts.map((post) => (
              <Card
                key={post._id}
                onPress={() => {
                  router.push({
                    pathname: "/view/articleView",
                    params: {
                      title: post.title,
                      image: post.image,
                      author: post.username,
                      time: "1hr", // You can add a timestamp field to your Post model
                      content: post.content,
                    },
                  });
                }}
                heading={post.title}
                bgColor="#d6e4e8"
                content={
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardText}>{post.content}</Text>
                  </View>
                }
              />
            ))}
          </View>
        </ScrollView>

        <View
          style={{
            width: 75,
            height: 75,
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: 8,
          }}
        >
          <Pressable
            onPress={() => {
              router.navigate("/createArticles", { relativeToDirectory: true });
            }}
          >
            <Image source={plus} style={{ width: "100%", height: "100%" }} />
          </Pressable>
        </View>
      </View>
    </>
  );

  return ui;
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  cardContent: {
    margin: 15,
  },
  cardTextContent: {
    marginTop: 10,
  },
  cardText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default News;