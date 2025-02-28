import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker"; // Importing Picker component
import { useNavigation } from "@react-navigation/native"; // Importing useNavigation hook
import { useRouter } from "expo-router";

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [article, setArticle] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const navigation = useNavigation(); // Using the navigation hook
  const router = useRouter();

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (!title || !category || !article) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    Alert.alert("Success", "Article Posted Successfully!", [
        { text: "OK", onPress: () => router.push("/view/articleView") }, // Navigate to 'ArticleView' after OK button press
      ]);
  };

  // Function to reset form fields
  const handleDiscard = () => {
    setTitle("");
    setCategory("");
    setArticle("");
    setImage(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        {/* <Pressable onPress={() => router.push("/news")}>
      </Pressable> */}
      <Text style={styles.heading}>Create an article</Text>

      {/* Image Upload Box */}
      <Pressable style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <Text style={styles.imageText}>+ Add post images</Text>
        )}
      </Pressable>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Add Heading"
        value={title}
        onChangeText={setTitle}
      />
      <View style = {styles.input}>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Category" value="" style={styles.imageText}/>
        <Picker.Item label="Climate Action" value="Climate Action" />
        <Picker.Item label="Sustainable Living" value="Sustainable Living" />
        <Picker.Item label="Conservation" value="Conservation" />
        <Picker.Item label="Clean Energy" value="Clean Energy" />
        <Picker.Item label="Environmental Justice" value="Environmental Justice" />
        <Picker.Item label="Green Innovation" value="Green Innovation" />
        <Picker.Item label="Policy & Advocacy" value="Policy & Advocacy" />
      </Picker>
      </View>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write Article"
        value={article}
        onChangeText={setArticle}
        multiline
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.discardButton} onPress={handleDiscard}>
          <Text style={styles.buttonText}>Discard</Text>
        </Pressable>
        <Pressable style={styles.postButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Post</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageBox: {
    width: 250,
    height: 150,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  imageText: {
    fontSize: 16,
    color: "#888",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  discardButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
  },
  postButton: {
    flex: 1,
    backgroundColor: "#008000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CreateArticle;
