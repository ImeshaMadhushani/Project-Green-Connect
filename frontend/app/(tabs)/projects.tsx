import React, { useState } from "react";
import {Alert, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import Card from "@/components/Card";
import ModalComponent from "@/components/ProjectModal";
import { useNavigation } from '@react-navigation/native';

const Projects = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fields, setFields] = useState({
    volunteers: "",
    duration: "",
    description: "",
  });

  const handleFieldChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddProject = () => {
    if (Object.values(fields).some((value) => !value)) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    Alert.alert("Success", "Project added successfully!");
    setModalVisible(false);
    setFields({
      volunteers: "",
      duration:"",
      description: "",
    });
  };

  return (
    <>
    <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
            <Text style={styles.heading}>Projects</Text>
            <Card
                bgColor="#dce8d6"
                heading="Plastic-Free Market Campaign"
                content={
                    <View style={styles.cardContent}>
                    <View style={styles.infoRow}>
                        <Text>November 10, 2024</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text>9:00 a.m.</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text>Vavuniya, Market</Text>
                    </View>
                    </View>
                }
            />

        </View>
        </ScrollView>

        <View style={styles.addButtonContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.addButton}>+</Text>
        </Pressable>
        </View>
        
        <ModalComponent
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSave={handleAddProject}
            fields={fields}
            setFields={handleFieldChange}
        />

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 25,
    padding: 10,
  },
  cardContent: {
    margin: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonContainer: {
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addButton: {
    width: "100%",
    height: "100%",
  },
});

export default Projects;
