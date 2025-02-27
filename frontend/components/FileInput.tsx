import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";

const FileInput = ({ label, onFileSelect, selectedFile }) => {
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        onFileSelect(result);
      } else {
        Alert.alert("Info", "No file selected.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to upload file. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
        <Text style={styles.uploadText}>
          {selectedFile ? selectedFile : "Choose File"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: "#000",
  },
  uploadButton: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    fontSize: 16,
    color: "#555",
  },
});

export default FileInput;
