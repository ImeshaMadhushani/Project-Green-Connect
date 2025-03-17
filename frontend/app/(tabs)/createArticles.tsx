import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  "view/articleView": undefined;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  console.error("API URL is not defined. Check your .env file.");
}

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null); // Automatically set username
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
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
          setUsername(response.data.user.name); // Set the username automatically
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleDiscard = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setImage(null);
  };

  const handleSubmit = async () => {
    console.log("Form data:", { title, content, category, username, image });

    if (!title || !content || !category || !username) {
      console.log("Validation failed:", { title, content, category, username });
      Alert.alert("Error", "Please fill all required fields: title, content, category");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("username", username);

    if (image) {
      const localUri = image;
      const filename = localUri.split("/").pop() || "image";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: localUri,
        name: filename,
        type: type,
      } as any);
    }

    try {
      console.log("Sending to:", `${apiUrl}/api/post/create-post`);
      const response = await axios.post(`${apiUrl}/api/post/create-post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 10000,
      });

      console.log("Response:", response.data);
      if (response.status === 200) {
        Alert.alert("Success", "Article Posted Successfully!", [
          { text: "OK", onPress: () => router.push("/view/articleView") },
        ]);
        setTitle("");
        setContent("");
        setCategory("");
        setImage(null);
      }
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Unknown error:", error);
      }
      Alert.alert("Error", axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Unknown error");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Create an article</Text>
        <Pressable style={styles.imageBox} onPress={pickImage}>
          {image ? <Image source={{ uri: image }} style={styles.uploadedImage} /> : <Text style={styles.imageText}>+ Add post images</Text>}
        </Pressable>
        <TextInput style={styles.input} placeholder="Add Title" value={title} onChangeText={setTitle} />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Climate Action" value="Climate Action" />
            <Picker.Item label="Sustainable Living" value="Sustainable Living" />
            <Picker.Item label="Conservation" value="Conservation" />
            <Picker.Item label="Clean Energy" value="Clean Energy" />
            <Picker.Item label="Environmental Justice" value="Environmental Justice" />
            <Picker.Item label="Green Innovation" value="Green Innovation" />
            <Picker.Item label="Policy & Advocacy" value="Policy & Advocacy" />
          </Picker>
        </View>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Write Content" value={content} onChangeText={setContent} multiline />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.discardButton} onPress={handleDiscard}><Text style={styles.buttonText}>Discard</Text></Pressable>
          <Pressable style={styles.postButton} onPress={handleSubmit}><Text style={styles.buttonText}>Post</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  imageBox: { width: 300, height: 200, backgroundColor: "#f0f0f0", justifyContent: "center", alignItems: "center", borderRadius: 10, marginBottom: 15 },
  imageText: { fontSize: 16, color: "#888" },
  uploadedImage: { width: "100%", height: "100%", borderRadius: 10 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10 },
  pickerContainer: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 10, overflow: "hidden" },
  picker: { width: "100%", height: Platform.OS === "ios" ? 200 : 50 },
  textArea: { height: 100, textAlignVertical: "top" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
  discardButton: { flex: 1, backgroundColor: "#ccc", padding: 10, borderRadius: 5, alignItems: "center", marginRight: 10 },
  postButton: { flex: 1, backgroundColor: "#0D986A", padding: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16 },
});

export default CreateArticle;