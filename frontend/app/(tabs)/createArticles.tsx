import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

interface Category {
  label: string;
  value: string;
}

const categories: Category[] = [
  { label: "Climate Action", value: "Climate Action" },
  { label: "Sustainable Living", value: "Sustainable Living" },
  { label: "Conservation", value: "Conservation" },
  { label: "Clean Energy", value: "Clean Energy" },
  { label: "Environmental Justice", value: "Environmental Justice" },
  { label: "Green Innovation", value: "Green Innovation" },
  { label: "Policy & Advocacy", value: "Policy & Advocacy" },
];

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { postToEdit } = useLocalSearchParams();

  const isEditing = !!postToEdit;
  const parsedPost = isEditing ? JSON.parse(postToEdit as string) : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(`${apiUrl}/api/user/getUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.user) {
          setUsername(response.data.user.username);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    if (isEditing && parsedPost) {
      console.log("Initializing form with parsedPost:", parsedPost);
      setTitle(parsedPost.title || "");
      setContent(parsedPost.content || "");
      setCategory(parsedPost.category || "");
      setImage(parsedPost.image ? `${apiUrl}/${parsedPost.image}` : null);
    }
  }, [postToEdit]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Updated this line
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const clearFields = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setImage(null);
  };

  const handleDiscard = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          onPress: () => {
            clearFields();
            router.back();
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Validate form
    if (!title || !content || !category || !username) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required");
        setIsSubmitting(false);
        return;
      }
  
      // Prepare FormData with proper timing
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("username", username);
  
      // Handle image upload with retry logic
      if (image) {
        if (image.startsWith('file://') || image.startsWith('content://')) {
          const filename = image.split('/').pop() || `image-${Date.now()}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';
  
          formData.append("image", {
            uri: image,
            name: filename,
            type,
          } as any);
        } else if (apiUrl && image.startsWith(apiUrl)) {
          formData.append("existingImage", image.replace(`${apiUrl}/`, ''));
        }
      }
  
      // Add retry mechanism
      const maxRetries = 3;
      let lastError;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const endpoint = isEditing && parsedPost 
            ? `${apiUrl}/api/post/${parsedPost._id}/update`
            : `${apiUrl}/api/post/create-post`;
  
          console.log(`Attempt ${attempt}: Submitting form data`);
          
          const response = await axios.post(endpoint, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            transformRequest: (data) => data,
            timeout: 10000, // 10 second timeout
          });
  
          console.log("Server response:", response.data);
  
          if (response.data.success) {
            clearFields();
            router.push({
              pathname: isEditing ? "/view/myArticles" : "/(tabs)/news",
              params: { refresh: "true" },
            });
            return; // Success - exit the function
          } else {
            throw new Error(response.data.message || "Failed to process post");
          }
        } catch (error) {
          lastError = error;
          console.error(`Attempt ${attempt} failed:`, error);
          
          if (attempt < maxRetries) {
            // Wait progressively longer between retries
            await new Promise(resolve => setTimeout(resolve, 500 * attempt));
          }
        }
      }
  
      // If we get here, all attempts failed
      throw lastError;
  
    } catch (error) {
      console.error("Final error after retries:", error);
      
      let errorMessage = "An error occurred while processing your request";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || 
                     (error.response?.status === 500 
                      ? "Server is busy, please try again" 
                      : error.message);
      }
      
      //Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.heading}>
            {isEditing ? "Edit Article" : "Create Article"}
          </Text>
        </View>

        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={40} color="#4682B4" />
              <Text style={styles.imageText}>Add post image</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Article Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            dropdownIconColor="#4682B4"
          >
            <Picker.Item label="Select Category" value="" enabled={false} />
            {categories.map((cat) => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your article content here..."
          placeholderTextColor="#888"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={handleDiscard}
            disabled={isSubmitting}
          >
            <Text style={styles.discardButtonText}>Discard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.postButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.postButtonText}>
                {isEditing ? "Update" : "Post"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  imageBox: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageText: {
    marginTop: 10,
    color: "#4682B4",
    fontSize: 16,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  postButton: {
    backgroundColor: "#4682B4",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    width: "45%",
    alignItems: "center",
  },
  postButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  discardButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4682B4",
    width: "45%",
    alignItems: "center",
  },
  discardButtonText: {
    color: "#4682B4",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateArticle;