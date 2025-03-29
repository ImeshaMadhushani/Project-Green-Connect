import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import ButtonSuccess from "@/components/button-success";

const projectTypes = [
  "Waste Reduction",
  "Plantation",
  "Disaster Preparedness",
  "Environmental Awareness Campaigns",
  "Sustainable Gardening & Agriculture",
];

const EditProject = () => {
  const params = useLocalSearchParams(); // Get project data from params
  const router = useRouter();
  
  const [project, setProject] = useState({
    title: "",
    type: "",
    location: "",
    date: "",
    time: "",
    description: "",
  });

  useEffect(() => {
    // Pre-fill project details
    setProject({
      title: params.title || "",
      type: params.type || "",
      location: params.location || "",
      date: params.date || "",
      time: params.time || "",
      description: params.description || "",
    });
  }, [params]);

  const handleUpdate = () => {
    if (!project.title || !project.type || !project.location || !project.date || !project.time || !project.description) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // Simulate API call to update project
    Alert.alert("Success", "Project details updated successfully!");
    
    // Redirect to projects list
    router.push("/manageProjects");
  };

  return (
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Project</Text>

        {/* Project Title */}
        <Text style={styles.label}>Project Title</Text>
        <TextInput
          style={styles.input}
          value={project.title}
          onChangeText={(text) => setProject({ ...project, title: text })}
        />

        {/* Project Type Dropdown */}
        <Text style={styles.label}>Project Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={project.type}
            onValueChange={(itemValue) => setProject({ ...project, type: itemValue })}
          >
            <Picker.Item label="Select a project type" value="" />
            {projectTypes.map((type, index) => (
              <Picker.Item key={index} label={type} value={type} />
            ))}
          </Picker>
        </View>

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={project.location}
          onChangeText={(text) => setProject({ ...project, location: text })}
        />

        {/* Date & Time */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={project.date}
              onChangeText={(text) => setProject({ ...project, date: text })}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              value={project.time}
              onChangeText={(text) => setProject({ ...project, time: text })}
            />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={project.description}
          onChangeText={(text) => setProject({ ...project, description: text })}
        />

        {/* Save Button */}
        <ButtonSuccess label="Save Changes" onPress={handleUpdate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#2E7D32",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#2E7D32",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B0D9B1",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#F0FAF1",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#B0D9B1",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F0FAF1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default EditProject;