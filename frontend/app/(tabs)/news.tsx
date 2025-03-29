import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Card from "@/components/Card";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const plus = require("../../assets/images/plus.png");
const scope = require("../../assets/images/scope.png");

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface Comment {
  _id: string;
  content: string;
  username: string;
  createdAt?: Date;
}

interface Post {
  _id: string;
  title: string;
  image: string;
  username: string;
  content: string;
  category: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

const News = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await axios.get(`${apiUrl}/api/user/getUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.user) {
        setCurrentUser(response.data.user.username);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(`${apiUrl}/api/post/get-posts`);
      if (response.data.success) {
        // Validate and sanitize posts data to prevent undefined values
        const sanitizedPosts = response.data.posts.map((post: any) => ({
          _id: post._id || "",
          title: post.title || "",
          image: post.image || "",
          username: post.username || "",
          content: post.content || "",
          category: post.category || "",
          likes: post.likes || 0,
          likedBy: Array.isArray(post.likedBy) ? post.likedBy : [],
          comments: Array.isArray(post.comments) ? post.comments.map((comment: any) => ({
            _id: comment._id || "",
            content: comment.content || "",
            username: comment.username || "",
            createdAt: comment.createdAt || new Date(),
          })) : [],
        }));
        setPosts(sanitizedPosts);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("An error occurred while fetching posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, [fetchPosts]);

  // Handle like
  const handleLike = async (postId: string, event: any) => {
    event?.stopPropagation();

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Please log in to like posts");
        return;
      }

      await axios.post(
        `${apiUrl}/api/post/${postId}/like`,
        { username: currentUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likedBy.includes(currentUser) ? post.likes - 1 : post.likes + 1,
                likedBy: post.likedBy.includes(currentUser)
                  ? post.likedBy.filter((user) => user !== currentUser)
                  : [...post.likedBy, currentUser],
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
      Alert.alert("Error", "Failed to like post. Please try again.");
    }
  };

  // Handle add comment
  const handleAddComment = async (postId: string) => {
    const commentContent = newComments[postId]?.trim();
    if (!commentContent) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Please log in to comment");
        return;
      }
  
      const response = await axios.post(
        `${apiUrl}/api/post/${postId}/comment`,
        { content: commentContent, username: currentUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success && response.data.comment) {
        const newComment = {
          ...response.data.comment,
          _id: response.data.comment._id || `temp-${Date.now()}` // Fallback ID if needed
        };
        
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        );
  
        // Clear the comment input for this post
        setNewComments((prevComments) => ({ ...prevComments, [postId]: "" }));
      } else {
        Alert.alert("Error", "Failed to add comment. Please try again.");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      Alert.alert("Error", "Failed to add comment. Please try again.");
    }
  };

  // Handle delete comment - Fixed implementation
  const handleDeleteComment = async (postId: string, commentId: string) => {
  if (!commentId) {
    console.error("Invalid comment ID:", commentId);
    Alert.alert("Error", "Cannot delete this comment at the moment.");
    return;
  }

  try {
    setDeleteInProgress(commentId);
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      Alert.alert("Error", "Please log in to delete comments");
      setDeleteInProgress(null);
      return;
    }

    const response = await axios.delete(
      `${apiUrl}/api/post/${postId}/comment/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter((comment) => comment._id !== commentId),
              }
            : post
        )
      );
    } else {
      Alert.alert("Error", response.data.message || "Failed to delete comment");
    }
  } catch (err: any) {
    console.error("Error deleting comment:", err);
    Alert.alert(
      "Error",
      err.response?.data?.message || "Failed to delete comment. Please try again."
    );
  } finally {
    setDeleteInProgress(null);
  }
};

  // Toggle post expansion
  const togglePostExpansion = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  // Handle search
  const handleSearch = () => {
    setIsSearching(true);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  // Filter posts based on search query with safe checks to prevent errors
  const filteredPosts = posts.filter((post) => {
    try {
      const query = searchQuery.toLowerCase();
      return (
        (post.title?.toLowerCase() || "").includes(query) ||
        (post.content?.toLowerCase() || "").includes(query) ||
        (post.category?.toLowerCase() || "").includes(query) ||
        (post.username?.toLowerCase() || "").includes(query)
      );
    } catch (error) {
      console.error("Error filtering post:", error, post);
      return false; // Skip posts that cause errors
    }
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4682B4" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Articles/News</Text>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search articles..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onSubmitEditing={handleSearch}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={clearSearch} style={styles.searchIconContainer}>
                  <Text style={styles.clearSearchText}>✕</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleSearch} style={styles.searchIconContainer}>
                  <Image source={scope} style={styles.searchIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {isSearching && searchQuery && (
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsText}>
                Search results for "{searchQuery}" ({filteredPosts.length})
              </Text>
            </View>
          )}

          {filteredPosts.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                {searchQuery ? "No articles match your search" : "No articles available"}
              </Text>
            </View>
          ) : (
            filteredPosts.map((post) => (
              <View key={post._id} style={styles.postContainer}>
                <Card
                  onPress={() =>
                    expandedPostId === post._id
                      ? router.push({
                          pathname: "/view/articleView",
                          params: {
                            title: post.title || "",
                            image: post.image || "",
                            author: post.username || "",
                            time: "1hr",
                            content: post.content || "",
                            category: post.category || "",
                          },
                        })
                      : togglePostExpansion(post._id)
                  }
                  heading={post.title}
                  bgColor="#d6e4e8"
                  image={{ uri: `${apiUrl}/${post.image}` }}
                  content={
                    <View style={styles.cardTextContent}>
                      <Text style={styles.authorText}>By {post.username}</Text>
                      <Text style={styles.cardText} numberOfLines={3} ellipsizeMode="tail">
                        {post.content}
                      </Text>
                      <Text style={styles.categoryText}>Category: {post.category}</Text>
                      <View style={styles.socialContainer}>
                        <TouchableOpacity
                          style={styles.socialButton}
                          onPress={(event) => handleLike(post._id, event)}
                        >
                          <Text style={[styles.emojiIcon, post.likedBy?.includes(currentUser) && styles.likedText]}>
                            ❤️
                          </Text>
                          <Text style={styles.socialText}>{post.likes || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.socialButton}
                          onPress={(event) => {
                            event.stopPropagation();
                            togglePostExpansion(post._id);
                          }}
                        >
                          <Text style={styles.emojiIcon}>💬</Text>
                          <Text style={styles.socialText}>{post.comments?.length || 0}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  }
                />

                {expandedPostId === post._id && (
                  <View style={styles.commentsContainer}>
                    <Text style={styles.commentsHeader}>Comments</Text>
                    {post.comments?.length > 0 ? (
                      post.comments.map((comment) => {
                        // Skip rendering comments with invalid IDs
                        if (!comment._id) return null;
                          
                        return (
                          <View key={comment._id} style={styles.commentItem}>
                            <View style={styles.commentHeader}>
                              <Text style={styles.commentUsername}>{comment.username}</Text>
                              {comment.username === currentUser && (
                                <TouchableOpacity 
                                  onPress={() => handleDeleteComment(post._id, comment._id)}
                                  disabled={deleteInProgress === comment._id || !comment._id}
                                >
                                  {deleteInProgress === comment._id ? (
                                    <ActivityIndicator size="small" color="red" />
                                  ) : (
                                    <Text style={styles.deleteText}>Delete</Text>
                                  )}
                                </TouchableOpacity>
                              )}
                            </View>
                            <Text style={styles.commentContent}>{comment.content}</Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text style={styles.noCommentsText}>No comments yet</Text>
                    )}
                    <View style={styles.addCommentContainer}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment..."
                        value={newComments[post._id] || ""}
                        onChangeText={(text) => setNewComments({ ...newComments, [post._id]: text })}
                        multiline
                      />
                      <TouchableOpacity
                        style={[
                          styles.commentButton, 
                          (!newComments[post._id] || !newComments[post._id]?.trim()) && styles.disabledButton
                        ]}
                        onPress={() => handleAddComment(post._id)}
                        disabled={!newComments[post._id] || !newComments[post._id]?.trim()}
                      >
                        <Text style={styles.commentButtonText}>Post</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <Pressable onPress={() => router.navigate("/createArticles", { relativeToDirectory: true })}>
          <Image source={plus} style={styles.floatingButtonImage} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  container: { width: "100%", alignItems: "center", paddingVertical: 10 },
  contentContainer: { paddingBottom: 80 },
  headerContainer: { width: "100%", padding: 10 },
  headerText: { fontSize: 25, textAlign: "center", fontWeight: "bold" },
  searchContainer: { 
    padding: 5, 
    margin: 10, 
    borderWidth: 1, 
    borderColor: "#4682B4", 
    borderRadius: 20, 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "white",
    elevation: 2,
  },
  searchInput: { 
    flex: 1, 
    borderWidth: 0, 
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchIconContainer: {
    padding: 5,
    marginRight: 5,
  },
  searchIcon: { width: 25, height: 25 },
  clearSearchText: { fontSize: 16, color: "#888", fontWeight: "bold" },
  searchResultsHeader: {
    width: "100%",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  searchResultsText: {
    fontStyle: "italic",
    color: "#555",
  },
  noResultsContainer: {
    padding: 30,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
  postContainer: { width: "100%", marginBottom: 15 },
  cardTextContent: { marginTop: 10 },
  authorText: { fontSize: 14, color: "#4682B4", fontWeight: "500", marginBottom: 5 },
  cardText: { fontSize: 16 },
  categoryText: { fontSize: 14, color: "#555", marginTop: 5 },
  socialContainer: { flexDirection: "row", marginTop: 10 },
  socialButton: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  emojiIcon: { fontSize: 18, marginRight: 5 },
  likedText: { opacity: 1 },
  socialText: { fontSize: 14, color: "#555" },
  commentsContainer: { 
    backgroundColor: "#f5f5f5", 
    borderRadius: 10, 
    padding: 15, 
    marginHorizontal: 10, 
    marginTop: -10, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: "#ddd",
    elevation: 2,
  },
  commentsHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  commentItem: { 
    backgroundColor: "white", 
    borderRadius: 8, 
    padding: 10, 
    marginBottom: 10,
    elevation: 1,
  },
  commentHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  commentUsername: { fontWeight: "bold", fontSize: 14 },
  deleteText: { color: "red", fontSize: 12 },
  commentContent: { fontSize: 14 },
  noCommentsText: { fontStyle: "italic", color: "#888", textAlign: "center", padding: 10 },
  addCommentContainer: { flexDirection: "row", marginTop: 10 },
  commentInput: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 20, 
    padding: 10, 
    backgroundColor: "white",
    maxHeight: 100,
  },
  commentButton: { 
    backgroundColor: "#4682B4", 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    marginLeft: 10, 
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  disabledButton: {
    backgroundColor: "#a0c0d6",
  },
  commentButtonText: { color: "white", fontWeight: "bold" },
  floatingButtonContainer: { 
    width: 65, 
    height: 65, 
    position: "absolute", 
    bottom: 20, 
    right: 20, 
    zIndex: 1,
    backgroundColor: "#4682B4",
    borderRadius: 33,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonImage: { width: "100%", height: "100%" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#555" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "red", fontSize: 16, marginBottom: 20, textAlign: "center" },
  retryButton: { 
    backgroundColor: "#4682B4", 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 5 
  },
  retryButtonText: { color: "white", fontWeight: "bold" },
});

export default News;