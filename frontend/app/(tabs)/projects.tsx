import React, { useState } from "react";
import {Alert, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import Card from "@/components/Card";
import ModalComponent from "@/components/ProjectModal";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const calender = require("../../assets/images/calender.png");
const clock = require("../../assets/images/clock.png");
const pin = require("../../assets/images/pin.png");
const plus = require("../../assets/images/plus.png");

const projectIcons = {
  "Waste Reduction": "recycle",
  "Plantation": "tree",
  "Disaster Preparedness": "alert-circle-outline",
  "Environmental Awareness Campaigns": "bullhorn-outline",
  "Sustainable Gardening & Agriculture": "sprout",
};

const Projects = () => {
  const router = useRouter();
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

  const getRandomColor = () => {
    const colors = ['#E9F0C7', '#F0F8E6', '#FBFBEF', '#E0EDF4', '#E9E5F3']; // some pastel shades
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <>
    <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
            <Text style={styles.heading}>Projects</Text>
            <Card
                bgColor={getRandomColor()}
                heading="Plastic-Free Market Campaign"
                content={
                    <View style={styles.cardContent}>
                    <View style={styles.infoRow}>
                        <Image source={calender} style={styles.icon} />
                        <Text>November 10, 2024</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Image source={clock} style={styles.icon} />
                        <Text>9:00 a.m.</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Image source={pin} style={styles.icon} />
                        <Text>Vavuniya, Market</Text>
                    </View>
                    </View>
                }
            />

        </View>
        </ScrollView>

        <View style={styles.addButtonContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
        <Image source={plus} style={styles.addButton} />
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
    fontSize: 28,
    padding: 10,
    fontWeight: 600,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  smallIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addButton: {
    width: 60,
    height: 60,
  },
});

export default Projects;
