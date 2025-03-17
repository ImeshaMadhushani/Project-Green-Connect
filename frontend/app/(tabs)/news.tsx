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
  TouchableOpacity,
} from "react-native";
import Card from "@/components/Card";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const plus = require("../../assets/images/plus.png");
const scope = require("../../assets/images/scope.png");

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const News = () => {
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

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [newComments, setNewComments] = useState<{[key: string]: string}>({});
  const [currentUser, setCurrentUser] = useState<string>("");

useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.error("No token found!");
        return;
      }

      const response = await axios.get(`${apiUrl}/api/user/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.user) {
        setCurrentUser(response.data.user.username); // Set the current user's username
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  fetchCurrentUser();
}, []);


  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/post/get-posts`);
      if (response.data.success) {
        setPosts(response.data.posts);
      } else {
        setError("Failed to fetch posts");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("An error occurred while fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle liking a post
  const handleLike = async (postId: string, event: any) => {
    event?.stopPropagation(); // Prevent card click
  
    try {
      const response = await axios.post(`${apiUrl}/api/post/${postId}/like`, {
        username: currentUser, // Send the current user's username
      });
  
      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: post.likedBy.includes(currentUser)
                  ? post.likes - 1
                  : post.likes + 1,
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

  const handleAddComment = async (postId: string) => {
    const commentContent = newComments[postId];
    if (!commentContent || commentContent.trim() === "") {
      Alert.alert("Error", "Please enter a comment");
      return;
    }
  
    try {
      const response = await axios.post(`${apiUrl}/api/post/${postId}/comment`, {
        content: commentContent,
        username: currentUser, // Ensure this is correctly set
      });
  
      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, response.data.comment], // Assuming the backend returns the new comment
              }
            : post
        )
      );
  
      // Clear the comment input
      setNewComments((prevComments) => ({ ...prevComments, [postId]: "" }));
    } catch (err) {
      console.error("Error adding comment:", err);
      Alert.alert("Error", "Failed to add comment. Please try again.");
    }
  };
  // Handle deleting a comment
  const handleDeleteComment = async (postId: string, commentId: string) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/post/${postId}/comment/${commentId}`
      );
  
      // Update local state to reflect the deletion
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
    } catch (err) {
      console.error("Error deleting comment:", err);
      Alert.alert("Error", "Failed to delete comment. Please try again.");
    }
  };

  const togglePostExpansion = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Articles/News</Text>
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Search"
                style={styles.searchInput}
              />
              <Pressable onPress={() => {}}>
                <Image source={scope} style={styles.searchIcon} />
              </Pressable>
            </View>
          </View>

          {/* Render posts dynamically */}
          {posts.map((post) => (
            <View key={post._id} style={styles.postContainer}>
              <Card
                onPress={() => {
                  if (expandedPostId === post._id) {
                    // If already expanded, navigate to the full article
                    router.push({
                      pathname: "/view/articleView",
                      params: {
                        title: post.title,
                        image: post.image,
                        author: post.username,
                        time: "1hr",
                        content: post.content,
                        category: post.category,
                      },
                    });
                  } else {
                    // Otherwise, expand to show comments
                    togglePostExpansion(post._id);
                  }
                }}
                heading={post.title}
                bgColor="#d6e4e8"
                image={{ uri: `${apiUrl}/${post.image}` }}
                content={
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardText}>{post.content}</Text>
                    <Text style={styles.categoryText}>Category: {post.category}</Text>
                    
                    {/* Like and Comment indicators */}
                    <View style={styles.socialContainer}>
                      <TouchableOpacity 
                        style={styles.socialButton}
                        onPress={(event) => handleLike(post._id, event)}
                      >
                        <Text style={[
                          styles.emojiIcon, 
                          post.likedBy?.includes(currentUser) && styles.likedText
                        ]}>
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
              
              {/* Expanded comments section */}
              {expandedPostId === post._id && (
                <View style={styles.commentsContainer}>
                  <Text style={styles.commentsHeader}>Comments</Text>
                  
                  {/* Comments list */}
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <View key={comment._id} style={styles.commentItem}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentUsername}>{comment.username}</Text>
                          {comment.username === currentUser && (
                            <TouchableOpacity 
                              onPress={() => handleDeleteComment(post._id, comment._id)}
                            >
                              <Text style={styles.deleteText}>Delete</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <Text style={styles.commentContent}>{comment.content}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noCommentsText}>No comments yet</Text>
                  )}
                  
                  {/* Add comment form */}
                  <View style={styles.addCommentContainer}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Add a comment..."
                      value={newComments[post._id] || ""}
                      onChangeText={(text) => setNewComments({...newComments, [post._id]: text})}
                      multiline
                    />
                    <TouchableOpacity 
                      style={styles.commentButton}
                      onPress={() => handleAddComment(post._id)}
                    >
                      <Text style={styles.commentButtonText}>Post</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <Pressable
          onPress={() => {
            router.navigate("/createArticles", { relativeToDirectory: true });
          }}
        >
          <Image source={plus} style={styles.floatingButtonImage} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  contentContainer: {
    paddingBottom: 80, // Extra space for the floating button
  },
  headerContainer: {
    width: "100%",
    padding: 10,
  },
  headerText: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 3,
    margin: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  postContainer: {
    width: "100%",
    marginBottom: 15,
  },
  cardTextContent: {
    marginTop: 10,
  },
  cardText: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  socialContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  emojiIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  likedText: {
    opacity: 1,
  },
  socialText: {
    fontSize: 14,
    color: "#555",
  },
  commentsContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginTop: -10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentUsername: {
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteText: {
    color: "red",
    fontSize: 12,
  },
  commentContent: {
    fontSize: 14,
  },
  noCommentsText: {
    fontStyle: "italic",
    color: "#888",
  },
  addCommentContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    backgroundColor: "white",
  },
  commentButton: {
    backgroundColor: "#4682B4",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
    justifyContent: "center",
  },
  commentButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  floatingButtonContainer: {
    width: 75,
    height: 75,
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  floatingButtonImage: {
    width: "100%",
    height: "100%",
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