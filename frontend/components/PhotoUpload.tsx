import React, { useState } from "react";
import { View, Image, Pressable, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

const PhotoUploadStyled = ({ onImageSelect, label }) => {
  const [image, setImage] = useState(null);

   const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      if (onImageSelect) {
        onImageSelect(uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Upload Photo</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: "100%",
      marginBottom: 20,
    },
    label: {
      textAlign: "left",
      fontSize: 15,
      marginBottom: 5,
    },
    imageContainer: {
      borderRadius: 5,
      borderColor: "#ccc",
      borderWidth: 2,
      height: 100,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      backgroundColor: "#f9f9f9",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    placeholder: {
      color: "#aaa",
      fontSize: 16,
    },
  });

export default PhotoUploadStyled;