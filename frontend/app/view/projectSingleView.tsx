import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Pressable, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Card } from 'react-native-paper';

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

    const handleEnroll = async () => {
        try {
            const response = await fetch("https://your-backend.com/api/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId: project.id, userId: "USER_ID" }),
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert("Success", "You have successfully enrolled in this project!");
            } else {
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Unable to enroll. Please check your connection.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                    <Pressable onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={20} color="#000" />
                    </Pressable>
                    <Text style={styles.title}>{project.title}</Text>
                </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <Card style={styles.contentCard}>
                <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                        name={projectIcons[project.type] || "information-outline"}
                        size={80}
                        color="#006400"
                    />
                </View>
                <Text style={styles.details}> 📅  {project.date} </Text>
                <Text style={styles.details}> ⏰  {project.time}</Text>
                <Text style={styles.details}> 📍  {project.location}</Text>
                <Text style={styles.description}>{project.description}</Text>
                </Card>

                {/* Enroll Button */}
                <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
                    <Text style={styles.enrollButtonText}>Enroll in Project</Text>
                </TouchableOpacity>
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
