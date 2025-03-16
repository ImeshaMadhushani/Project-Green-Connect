import React from "react";
import { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Card } from 'react-native-paper';

import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const projectIcons = {
    "Waste Reduction": "recycle",
    "Plantation": "tree",
    "Disaster Preparedness": "alert-circle-outline",
    "Environmental Awareness Campaigns": "bullhorn-outline",
    "Sustainable Gardening & Agriculture": "sprout",
};

const ProjectSingleView = () => {
    const params = useLocalSearchParams();
    const project = params; // Since expo-router sends params as object
    const [userRole, setUserRole] = useState(null); // State to store user role

        // Fetch user role function
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
           setUserRole(response.data.user.role); // Store user role
        } catch (error) {
          console.error("Failed to fetch user role", error);
            Alert.alert("Error", "Failed to fetch user role.");
          }
    };
  
    const handleEnroll = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            
                if (!token) {
                  Alert.alert("Error", "You must be logged in to enroll.");
                  return;
            }
            
             const response = await axios.put(
               `${apiUrl}/api/project/${project._id}/enroll`,
               {},
               {
                 headers: {
                   Authorization: `Bearer ${token}`, // Pass the token in the request header
                  "Content-Type": "application/json",
                 },
               }
             );
            
            if (response.data.success) {
                Alert.alert(
                  "Success",
                  response.data.message ||
                    "You have successfully enrolled in this project!"
                );
            } else {
                Alert.alert(
                  "Error",
                  response.data.message ||
                    "Something went wrong. Please try again."
                );
            }
        } catch (error:any) {
            console.error("Enrollment Error:", error.response?.data || error.message);
            Alert.alert(
              "Error",
              "Unable to enroll. Please check your connection.",
              error.response?.data || error.message
            );
        }
  };
  
      useEffect(() => {
        fetchUserRole(); 
      }, []);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={20} color="#000" />
          </Pressable>
          <Text style={styles.title}>{project.projectName}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.contentCard}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={
                  projectIcons[project.projectType] || "information-outline"
                }
                size={80}
                color="#006400"
              />
            </View>
            <Text style={styles.details}> 📅 {project.date} </Text>
            <Text style={styles.details}> ⏰ {project.time}</Text>
            <Text style={styles.details}> 📍 {project.location}</Text>
            <Text style={styles.description}>{project.description}</Text>
          </Card>

          {/* Enroll Button */}
        {/*   <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
            <Text style={styles.enrollButtonText}>Enroll in Project</Text>
          </TouchableOpacity>  */}
          
          {userRole == "volunteer" && (
            <TouchableOpacity
              style={styles.enrollButton}
              onPress={handleEnroll}
            >
              <Text style={styles.enrollButtonText}>Enroll in Project</Text>
            </TouchableOpacity>
          )} 
        </ScrollView>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 24,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap:30,
        padding:15,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    iconContainer: {
        alignItems: "center",
        marginTop: 25,
        marginBottom: 25,
    },
    contentCard: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#FBFFEF',
      },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
    },
    details: {
        fontSize: 16,
        color: "gray",
        marginBottom: 6,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
    },
    enrollButton: {
        marginTop: 20,
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    enrollButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: 600,
    },
});

export default ProjectSingleView;
