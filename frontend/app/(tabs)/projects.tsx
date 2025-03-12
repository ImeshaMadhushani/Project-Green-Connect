import React, { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Card from "@/components/Card";
import ModalComponent from "@/components/ProjectModal";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const calender = require("../../assets/images/calender.png");
const clock = require("../../assets/images/clock.png");
const pin = require("../../assets/images/pin.png");
const plus = require("../../assets/images/plus.png");


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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
    const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
   const [userRole, setUserRole] = useState(""); 
  
    useEffect(() => {
      fetchProjects();
       fetchUserRole();
    }, []);
  
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/project/`);
      setProjects(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch projects.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async () => {
      try {
          const token = await AsyncStorage.getItem("authToken"); // Retrieve JWT token from AsyncStorage
          if (!token) {
            throw new Error("No token found");
          }
          const response = await axios.get(`${apiUrl}/api/user/getUser`, {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          });
       
        console.log("User Role:", response.data.user.role);
          setUserRole(response.data.user.role);
      } catch (error) {
        console.error("Failed to fetch user role", error);
        Alert.alert("Error", "Failed to fetch user role.");
      }
  };
  
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
      duration: "",
      description: "",
    });
  };

  const getRandomColor = () => {

    const colors = ["#E9F0C7", "#F0F8E6", "#FBFBEF", "#E0EDF4", "#E9E5F3"]; // some pastel shades
    return colors[Math.floor(Math.random() * colors.length)];
  };

 /*  const [events] = useState([

    {
      id: "1",
      type: "Waste Reduction",
      title: "Plastic-Free Market Campaign",
      date: "November 10, 2024",
      time: "9.00 a.m.",
      location: "Vavunia, Market",
      description: "A campaign to reduce plastic waste in the local market.",
    },
    {
      id: "2",
      type: "Plantation",
      title: "Tree Planting Drive",
      date: "November 15, 2024",
      time: "10.00 a.m.",
      location: "Colombo Park",
      description: "Join us in planting trees to make our city greener.",
    },
    {
      id: "3",
      type: "Sustainable Gardening & Agriculture",
      title: "Eco-Friendly Fair",
      date: "December 5, 2024",
      time: "11.30 a.m.",
      location: "Kandy Town Hall",
      description: "Promoting sustainable gardening and eco-friendly farming.",
    },

  ]); */


  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Projects</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            projects.map((project) => (
              <Pressable key={project._id}>
                <Card
                  onPress={() =>
                    router.push({
                      pathname: "/view/projectSingleView",
                      params: project,
                    })
                  }
                  bgColor={getRandomColor()}
                  heading={project.projectName}
                  iconName={projectIcons[project.projectType] || "help-circle"}
                  content={
                    <View style={styles.cardContent}>
                      <View>
                        <View style={styles.infoRow}>
                          <Image source={calender} style={styles.smallIcon} />
                          <Text>{new Date(project.date).toDateString()}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Image source={clock} style={styles.smallIcon} />
                          <Text>{project.time}</Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Image source={pin} style={styles.smallIcon} />
                          <Text>{project.location}</Text>
                        </View>
                      </View>
                    </View>
                  }
                />
              </Pressable>
            ))
          )}

          {/*   {events.map((event) => (
            <Pressable key={event.id}>
              <Card
                onPress={() =>
                  router.push({
                    pathname: "/view/projectSingleView",
                    params: event,
                  })
                }

          {events.map((event) => (
            <Pressable key={event.id}>
              <Card
                onPress={() => router.push({ pathname: "/view/projectSingleView", params: event })}

                bgColor={getRandomColor()}
                heading={event.title}
                iconName={projectIcons[event.type]} // Pass icon name correctly here
                content={
                  <View style={styles.cardContent}>
                    <View>
                      <View style={styles.infoRow}>
                        <Image source={calender} style={styles.smallIcon} />
                        <Text>{event.date}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Image source={clock} style={styles.smallIcon} />
                        <Text>{event.time}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Image source={pin} style={styles.smallIcon} />
                        <Text>{event.location}</Text>
                      </View>
                    </View>
                  </View>
                }
              />

            </Pressable>
          ))} */}
        </View>
      </ScrollView>

      {userRole === "organization" && (
        <View style={styles.addButtonContainer}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image source={plus} style={styles.addButton} />
          </Pressable>
        </View>
      )}

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
