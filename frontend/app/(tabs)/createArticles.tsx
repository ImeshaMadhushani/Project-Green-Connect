import React, { useState, useRef } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import TextInputStyled from "@/components/text-input";
import PhotoUploadStyled from "@/components/PhotoUpload";
import ButtonSuccess from "@/components/button-success"; // Custom Button Component
import { Text, useTheme } from "react-native-paper";

const CreateArticle = () => {
  const [form, setForm] = useState({
    title: "",
    tag: "",
    category : "",
    article: "",
  });

  const [postPhoto, setPostPhoto] = useState(null);

  // Refs for navigation between inputs
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);

  const theme = useTheme();

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDiscard = () => {
    setForm({
      title: "",
      tag: "",
      category: "",
      article: "",
    });
    if (postPhoto !== null) {
      setPostPhoto(null);
    }
  };

  const handleSubmit = () => {
    if (!form.title || !form.article) {
      Alert.alert("Error", "Please fill all required fields.");
    } else {
      console.log("Form Submitted:", form);
      console.log("Uploaded Photo:", postPhoto);
    }
  };

  const renderTextInput = (ref, text, value, placeholder, onChangeText, onSubmitEditing) => {
    return (
      <TextInputStyled
        ref={ref}
        text={text}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        onSubmitEditing={() => {
          if (onSubmitEditing && ref.current) {
            onSubmitEditing();
          }
        }}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Create an Article</Text>

        {/* Image Upload */}
        <PhotoUploadStyled style={{ height: 100 }} label="Add post image" onImageSelect={setPostPhoto} />

        {/* Form Inputs */}
        {renderTextInput(input1Ref, "Add Heading", form.title, "Enter article heading", 
          (text) => handleChange("title", text), 
          () => {
            if (!form.title.trim()) {
              Alert.alert("Error", "Please enter a title.");
              input1Ref.current?.focus();
            } else {
              input2Ref.current?.focus();
            }
          }
        )}

        {renderTextInput(input2Ref, "Add Tag", form.tag, "Enter a tag", 
          (text) => handleChange("tag", text), 
          () => input3Ref.current?.focus()
        )}

        {renderTextInput(input3Ref, "Category", form.category, "Enter a category", 
          (text) => handleChange("category", text), 
          () => input4Ref.current?.focus()
        )}

        {renderTextInput(input4Ref, "Write Article", form.article, "Write your article here", 
          (text) => handleChange("article", text), 
          null
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <ButtonSuccess style={{ width: 120, height: 60}} label="DISCARD" onPress={handleDiscard} />
          <ButtonSuccess style={{ width: 120, height: 60}} label="POST" onPress={handleSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

export default CreateArticle;