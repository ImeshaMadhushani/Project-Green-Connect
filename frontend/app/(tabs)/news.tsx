import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  LayoutAnimation,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const { width: screenWidth } = Dimensions.get('window');
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface Comment {
  _id: string;
  content: string;
  username: string;
  createdAt?: Date;
  isTemp?: boolean;
}

interface Post {
  _id: string;
  title: string;
  image: string;
  username: string;
  content: string;
  category: string;
  likes: number;
  shares: number; // Added from your schema
  points: number; // Added from your schema
  likedBy: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date; // Now required due to timestamps: true
}

const News = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

  const configureAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut
      }
    });
  };

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(`${apiUrl}/api/user/getUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.user) {
        setCurrentUser(response.data.user.username);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/post/get-posts`);
      
      if (response.data.success) {
        const sanitizedPosts = response.data.posts.map((post: any) => ({
          _id: post._id || "",
          title: post.title || "",
          image: post.image || "",
          username: post.username || "",
          content: post.content || "",
          category: post.category || "",
          likes: post.likes || 0,
          shares: post.shares || 0, // Added from schema
          points: post.points || 0, // Added from schema
          likedBy: Array.isArray(post.likedBy) ? post.likedBy : [],
          comments: Array.isArray(post.comments) ? post.comments.map((comment: any) => ({
            _id: comment._id || "",
            content: comment.content || "",
            username: comment.username || "",
            createdAt: comment.createdAt || new Date(),
          })) : [],
          createdAt: new Date(post.createdAt || Date.now()),
          updatedAt: new Date(post.updatedAt || post.createdAt || Date.now()), // Ensure updatedAt exists
        }));
        setPosts(sanitizedPosts);
      } else {
        throw new Error("Failed to fetch posts");
      }
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError(err.message || "An error occurred while fetching posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
      fetchCurrentUser();
      return () => {
        setExpandedPostId(null);
        setExpandedCommentsPostId(null);
      };
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setExpandedPostId(null);
    setExpandedCommentsPostId(null);
    fetchPosts();
  }, [fetchPosts]);

  const togglePostExpansion = useCallback((postId: string) => {
    configureAnimation();
    setExpandedPostId(expandedPostId === postId ? null : postId);
  }, [expandedPostId]);

  const toggleCommentsExpansion = useCallback((postId: string, event: any) => {
    if (event) {
      event.stopPropagation();
    }
    configureAnimation();
    setExpandedCommentsPostId(expandedCommentsPostId === postId ? null : postId);
  }, [expandedCommentsPostId]);

  const handleLike = useCallback(async (postId: string, event: any) => {
    event.stopPropagation();
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Login Required", "Please log in to like posts");
        return;
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: post.likedBy.includes(currentUser) ? post.likes - 1 : post.likes + 1,
                likedBy: post.likedBy.includes(currentUser)
                  ? post.likedBy.filter(user => user !== currentUser)
                  : [...post.likedBy, currentUser],
              }
            : post
        )
      );

      await axios.post(
        `${apiUrl}/api/post/${postId}/like`,
        { username: currentUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error liking post:", err);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: post.likedBy.includes(currentUser) ? post.likes + 1 : post.likes - 1,
                likedBy: post.likedBy.includes(currentUser)
                  ? [...post.likedBy, currentUser]
                  : post.likedBy.filter(user => user !== currentUser),
              }
            : post
        )
      );
      Alert.alert("Error", "Failed to like post. Please try again.");
    }
  }, [currentUser]);

  const handleAddComment = useCallback(async (postId: string) => {
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

      const tempComment = {
        _id: `temp-${Date.now()}`,
        content: commentContent,
        username: currentUser,
        createdAt: new Date(),
        isTemp: true
      };

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? { ...post, comments: [...post.comments, tempComment] }
            : post
        )
      );

      setNewComments(prev => ({ ...prev, [postId]: "" }));

      const response = await axios.post(
        `${apiUrl}/api/post/${postId}/comment`,
        { content: commentContent, username: currentUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.comment) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.map(comment => 
                    comment._id === tempComment._id 
                      ? { ...response.data.comment, createdAt: new Date(response.data.comment.createdAt) }
                      : comment
                  )
                }
              : post
          )
        );
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter(comment => !comment.isTemp)
              }
            : post
        )
      );
      Alert.alert("Error", "Failed to add comment. Please try again.");
    }
  }, [currentUser, newComments]);

  const handleDeleteComment = useCallback(async (postId: string, commentId: string) => {
    try {
      setDeleteInProgress(commentId);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Please log in to delete comments");
        setDeleteInProgress(null);
        return;
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter(comment => comment._id !== commentId)
              }
            : post
        )
      );

      const response = await axios.delete(
        `${apiUrl}/api/post/${postId}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete comment");
      }
    } catch (err: any) {
      if (!err.response || err.response.status !== 404) {
        console.error("Error deleting comment:", err);
      }
      
      setPosts(prevPosts => {
        const postToUpdate = prevPosts.find(post => post._id === postId);
        if (!postToUpdate) return prevPosts;
        
        const deletedComment = postToUpdate.comments.find(c => c._id === commentId);
        if (!deletedComment) return prevPosts;

        return prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, deletedComment].sort((a, b) => 
                  new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
                )
              }
            : post
        );
      });
    } finally {
      setDeleteInProgress(null);
    }
  }, []);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    if (expandedPostId) {
      setExpandedPostId(null);
    }
    if (expandedCommentsPostId) {
      setExpandedCommentsPostId(null);
    }
  }, [expandedPostId, expandedCommentsPostId]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
  }, []);

  const filteredPosts = useMemo(() => {
    let sortedPosts = [...posts];
    
    // Sort by updatedAt (most recent first)
    sortedPosts.sort((a, b) => {
      const aTime = new Date(a.updatedAt).getTime();
      const bTime = new Date(b.updatedAt).getTime();
      return bTime - aTime; // Most recent first
    });

    if (!searchQuery) return sortedPosts;
    const query = searchQuery.toLowerCase();
    return sortedPosts.filter(post => {
      return (
        (post.title?.toLowerCase() || "").includes(query) ||
        (post.content?.toLowerCase() || "").includes(query) ||
        (post.category?.toLowerCase() || "").includes(query) ||
        (post.username?.toLowerCase() || "").includes(query)
      );
    });
  }, [posts, searchQuery]);

  const renderCommentItem = useCallback(({ item: comment }: { item: Comment }, postId: string) => (
    <View key={comment._id} style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUsername}>{comment.username}</Text>
        {comment.username === currentUser && !comment.isTemp && (
          <TouchableOpacity 
            onPress={() => handleDeleteComment(postId, comment._id)}
            disabled={deleteInProgress === comment._id}
          >
            {deleteInProgress === comment._id ? (
              <ActivityIndicator size="small" color="red" />
            ) : (
              <Feather name="trash-2" size={16} color="#ff4444" />
            )}
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.commentContent}>{comment.content}</Text>
      {comment.isTemp && (
        <View style={styles.savingIndicator}>
          <ActivityIndicator size="small" color="#4682B4" />
          <Text style={styles.savingText}>Posting...</Text>
        </View>
      )}
    </View>
  ), [currentUser, deleteInProgress, handleDeleteComment]);

  const renderPostItem = useCallback(({ item: post }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Pressable
        onPress={() => togglePostExpansion(post._id)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1
        })}
      >
        <View style={styles.postContent}>
          <View style={styles.postHeader}>
            <Text style={styles.authorText}>By {post.username}</Text>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>
          
          <Text style={styles.postTitle}>{post.title}</Text>
          
          {post.image ? (
            <Image
              source={{ uri: `${apiUrl}/${post.image}` }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : null}
          
          <Text 
            style={styles.postContentText}
            numberOfLines={expandedPostId === post._id ? undefined : 3}
            ellipsizeMode="tail"
          >
            {post.content}
          </Text>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                post.likedBy.includes(currentUser) && styles.likedButton
              ]}
              onPress={(e) => handleLike(post._id, e)}
            >
              <Ionicons
                name={post.likedBy.includes(currentUser) ? "heart" : "heart-outline"}
                size={20}
                color={post.likedBy.includes(currentUser) ? "#ff4444" : "#555"}
              />
              <Text style={[
                styles.socialText,
                post.likedBy.includes(currentUser) && styles.likedText
              ]}>
                {post.likes || 0}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.socialButton,
                expandedCommentsPostId === post._id && styles.commentActiveButton
              ]}
              onPress={(e) => toggleCommentsExpansion(post._id, e)}
            >
              <MaterialIcons
                name="comment"
                size={20}
                color={expandedCommentsPostId === post._id ? "#4682B4" : "#555"}
              />
              <Text style={[
                styles.socialText,
                expandedCommentsPostId === post._id && styles.commentActiveText
              ]}>
                {post.comments?.length || 0}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>

      {expandedCommentsPostId === post._id && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsHeader}>Comments ({post.comments?.length || 0})</Text>
          
          {post.comments?.length > 0 ? (
            <FlatList
              data={post.comments}
              renderItem={({ item }) => renderCommentItem({ item }, post._id)}
              keyExtractor={comment => comment._id}
              scrollEnabled={false}
              removeClippedSubviews={true}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
            />
          ) : (
            <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
          )}
          
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              placeholderTextColor="#888"
              value={newComments[post._id] || ""}
              onChangeText={text => setNewComments({ ...newComments, [post._id]: text })}
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[
                styles.commentButton, 
                (!newComments[post._id]?.trim()) && styles.disabledButton
              ]}
              onPress={() => handleAddComment(post._id)}
              disabled={!newComments[post._id]?.trim()}
            >
              <Text style={styles.commentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  ), [expandedPostId, expandedCommentsPostId, currentUser, newComments, deleteInProgress, togglePostExpansion, toggleCommentsExpansion, handleLike, renderCommentItem]);

  if (loading && !refreshing) {
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
        <Feather name="alert-circle" size={40} color="#d9534f" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#4682B4"
            colors={["#4682B4"]}
          />
        }
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Community News</Text>
              <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#888" style={styles.searchIconLeft} />
                <TextInput
                  placeholder="Search articles..."
                  placeholderTextColor="#888"
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={clearSearch} style={styles.searchIconContainer}>
                    <Feather name="x" size={20} color="#888" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {isSearching && searchQuery && (
              <View style={styles.searchResultsHeader}>
                <Text style={styles.searchResultsText}>
                  Results for "{searchQuery}" ({filteredPosts.length})
                </Text>
              </View>
            )}

            {filteredPosts.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Feather name="file-text" size={40} color="#888" />
                <Text style={styles.noResultsText}>
                  {searchQuery ? "No articles match your search" : "No articles available yet"}
                </Text>
                {!searchQuery && (
                  <TouchableOpacity 
                    style={styles.createPostButton}
                    onPress={() => router.navigate("/createArticles")}
                  >
                    <Text style={styles.createPostButtonText}>Create First Post</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        }
        ListFooterComponent={<View style={{ height: 80 }} />}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        updateCellsBatchingPeriod={50}
      />

      {filteredPosts.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingButtonContainer}
          onPress={() => router.navigate("/createArticles")}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={28} color="white" />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1,
    backgroundColor: '#f5f7fa'
  },
  contentContainer: { 
    paddingBottom: 30,
    paddingHorizontal: 15
  },
  headerContainer: { 
    marginBottom: 15,
    paddingTop: 15
  },
  headerText: { 
    fontSize: 26, 
    fontWeight: "bold",
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center'
  },
  searchContainer: { 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIconLeft: {
    marginRight: 8
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16,
    color: '#333',
    paddingVertical: 0
  },
  searchIconContainer: {
    padding: 5,
  },
  searchResultsHeader: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#e9f5ff",
    borderRadius: 8,
  },
  searchResultsText: {
    color: "#4682B4",
    fontSize: 14,
  },
  noResultsContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20
  },
  createPostButton: {
    backgroundColor: "#4682B4",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25
  },
  createPostButtonText: {
    color: "white",
    fontWeight: "600"
  },
  postContainer: { 
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff8e1', // Change this line (Line 614) to adjust post background color
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postContent: {
    padding: 15,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 12
  },
  postContentText: { 
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
    marginBottom: 12
  },
  authorText: { 
    fontSize: 14, 
    color: "#4682B4", 
    fontWeight: "500"
  },
  categoryText: { 
    fontSize: 13, 
    color: "#666", 
    backgroundColor: '#e9f5ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12
  },
  socialContainer: { 
    flexDirection: "row", 
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  likedButton: {
    backgroundColor: '#ffebee'
  },
  commentActiveButton: {
    backgroundColor: '#e9f5ff'
  },
  socialText: { 
    fontSize: 14, 
    color: "#555",
    marginLeft: 5
  },
  likedText: {
    color: '#ff4444'
  },
  commentActiveText: {
    color: '#4682B4'
  },
  commentsContainer: { 
    backgroundColor: "#f9f9f9", 
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  commentsHeader: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 12,
    color: '#2c3e50'
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
    marginBottom: 5 
  },
  commentUsername: { 
    fontWeight: "bold", 
    fontSize: 14,
    color: '#4682B4'
  },
  commentContent: { 
    fontSize: 14,
    color: '#444',
    lineHeight: 20
  },
  noCommentsText: { 
    fontStyle: "italic", 
    color: "#888", 
    textAlign: "center", 
    padding: 10,
    fontSize: 14
  },
  addCommentContainer: { 
    flexDirection: "row", 
    marginTop: 15,
    alignItems: 'flex-end'
  },
  commentInput: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 20, 
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
    maxHeight: 100,
    fontSize: 14,
    color: '#333'
  },
  commentButton: { 
    backgroundColor: "#4682B4", 
    borderRadius: 20, 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    marginLeft: 10,
    minWidth: 70,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: "#a0c0d6",
  },
  commentButtonText: { 
    color: "white", 
    fontWeight: "bold",
    fontSize: 14
  },
  floatingButtonContainer: { 
    position: "absolute", 
    bottom: 25, 
    right: 25, 
    width: 56, 
    height: 56, 
    borderRadius: 28,
    backgroundColor: "#4682B4",
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: '#f5f7fa'
  },
  loadingText: { 
    marginTop: 15, 
    color: "#4682B4",
    fontSize: 16
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f5f7fa'
  },
  errorText: { 
    color: "#d9534f", 
    fontSize: 16, 
    marginTop: 15,
    marginBottom: 25, 
    textAlign: "center",
    maxWidth: '80%'
  },
  retryButton: { 
    backgroundColor: "#4682B4", 
    paddingHorizontal: 25, 
    paddingVertical: 12, 
    borderRadius: 25 
  },
  retryButtonText: { 
    color: "white", 
    fontWeight: "bold",
    fontSize: 16
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  savingText: {
    fontSize: 12,
    color: '#4682B4',
    marginLeft: 5,
  },
});

export default News;