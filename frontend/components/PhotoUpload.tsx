import React, { useState } from "react";
import { View, Image, Pressable, Text, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface PhotoUploadProps {
  onImageSelect: (image: { uri: string; name: string; type: string }) => void;
  label: string;
}

const PhotoUploadStyled: React.FC<PhotoUploadProps> = ({
  onImageSelect,
  label,
}) => {
  const [image, setImage] = useState<{ uri: string } | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        "Permission denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Fixed deprecated API
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = {
        uri: result.assets[0].uri,
        name: "profile.jpg", // Default name
        type: "image/jpeg", // Default type
      };

      setImage({ uri: selectedImage.uri });

      if (onImageSelect) {
        onImageSelect(selectedImage); // ✅ Pass correct object format
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={pickImage} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
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
