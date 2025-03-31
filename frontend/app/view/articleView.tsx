import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Pressable, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome, Feather } from "@expo/vector-icons"; // Added Feather for trash icon
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ArticleView = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  interface Comment {
    _id: string;
    content: string;
    username: string;
    createdAt: Date;
  }

  interface Post {
    _id: string;
    image?: string;
    title: string;
    username: string;
    category: string;
    createdAt: Date;
    content: string;
    likes: number;
    comments: Comment[];
  }

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null); // Track deletion state

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          alert("Please login to view the article");
          router.back();
          return;
        }

        console.log("Fetching post with ID:", id);
        const response = await axios.get(`${apiUrl}/api/post/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const fetchedPost = {
            ...response.data.post,
            createdAt: new Date(response.data.post.createdAt),
            comments: response.data.post.comments.map((comment: any) => ({
              ...comment,
              createdAt: new Date(comment.createdAt),
            })),
          };
          setPost(fetchedPost);
        } else {
          alert("Article not found");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to load article");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      setDeleteInProgress(commentId); // Show loading state for this comment
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to delete comments");
        setDeleteInProgress(null);
        return;
      }

      // Optimistically update UI
      setPost((prevPost) =>
        prevPost
          ? {
              ...prevPost,
              comments: prevPost.comments.filter((comment) => comment._id !== commentId),
            }
          : prevPost
      );

      const response = await axios.delete(`${apiUrl}/api/post/${postId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
      // Revert UI on error (re-add the comment)
      setPost((prevPost) =>
        prevPost
          ? {
              ...prevPost,
              comments: prevPost.comments, // Ideally, you'd store the deleted comment to re-add it here
            }
          : prevPost
      );
    } finally {
      setDeleteInProgress(null);
    }
  };

  if (loading || !post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.logo}>GreenConnect</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Article Image (only shown if image exists) */}
      {post.image && (
        <Image source={{ uri: `${apiUrl}/${post.image}` }} style={styles.articleImage} />
      )}

      {/* Article Content */}
      <View style={styles.articleContent}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.metaRow}>
          <FontAwesome name="user" size={18} color="#666" />
          <Text style={styles.author}>{post.username}</Text>
          <Text style={styles.category}>{post.category}</Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.content}>{post.content}</Text>
      </View>

      {/* Engagement Section */}
      <View style={styles.engagementRow}>
        <Text style={styles.engagement}>
          <FontAwesome name="heart" size={18} color="#e91e63" /> {post.likes || 0} Likes
        </Text>
        <Text style={styles.engagement}>
          <FontAwesome name="comment" size={18} color="#009688" /> {post.comments.length} Comments
        </Text>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsContainer}>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <View key={comment._id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteComment(post._id, comment._id)}
                  disabled={deleteInProgress === comment._id}
                >
                  {deleteInProgress === comment._id ? (
                    <ActivityIndicator size="small" color="red" />
                  ) : (
                    <Feather name="trash-2" size={16} color="#ff4444" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentTimestamp}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noCommentsText}>No comments yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    backgroundColor: "#009688",
    elevation: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  articleImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  articleContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  category: {
    fontSize: 14,
    color: "#009688",
    marginLeft: 10,
    fontStyle: "italic",
  },
  timestamp: {
    fontSize: 14,
    color: "#999",
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  engagementRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  engagement: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
  commentsContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  commentItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentUsername: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#4682B4",
  },
  commentContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  noCommentsText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    padding: 10,
    fontSize: 14,
  },
});

export default ArticleView;