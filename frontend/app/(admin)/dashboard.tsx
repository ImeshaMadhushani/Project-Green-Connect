import React from "react";
import { View, StyleSheet, Alert, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Import screens
import ManageUsers from "./manageUsers";
import ManageProjects from "./manageProjects";
import ManageArticles from "./manageArticles";
import FeedbackReports from "./feedbackReports";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Tab Navigator
const Tab = createBottomTabNavigator();

// Overview Cards
const OverviewCard = ({ title, value, icon }: { title: string; value: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }) => (
  <Card style={styles.card}>
    <Card.Content style={styles.cardContent}>
      <MaterialCommunityIcons name={icon} size={50} color="#388E3C" />
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
    </Card.Content>
  </Card>
);

const AdminHome = () => {
  const [counts, setCounts] = useState({
    volunteerCount: 0,
    organizationCount: 0,
    approvedProjects: 0,
    approvedFeedback: 0,
    articlesCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.error("No token found");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Initialize counts with defaults
        const newCounts = {
          volunteerCount: 0,
          organizationCount: 0,
          approvedProjects: 0,
          approvedFeedback: 0,
          articlesCount: 0,
        };

        // Fetch user counts
        try {
          const userResponse = await axios.get(`${apiUrl}/api/user/counts`, config);
          console.log("User counts response:", userResponse.data);
          newCounts.volunteerCount = userResponse.data.volunteerCount || 0;
          newCounts.organizationCount = userResponse.data.organizationCount || 0;
        } catch (userError) {
          console.error("Error fetching user counts:", userError);
        }

        // Fetch approved projects count
        try {
          const projectsResponse = await axios.get(`${apiUrl}/api/project/approved/count`, config);
          console.log("Projects response:", projectsResponse.data);
          newCounts.approvedProjects = projectsResponse.data.totalApprovedProjects || 0;
        } catch (projectError) {
          console.error("Error fetching project count:", projectError);
        }

        // Fetch approved feedback count
        try {
          const feedbackResponse = await axios.get(`${apiUrl}/api/feedback/feedback/approved/count`, config);
          console.log("Feedback response:", feedbackResponse.data);
          newCounts.approvedFeedback = feedbackResponse.data.approvedCount || 0;
        } catch (feedbackError) {
          console.error("Error fetching feedback count:", feedbackError);
        }

        // Fetch post count
        try {
          const postsResponse = await axios.get(`${apiUrl}/api/post/count`, config);
          console.log("Posts count response:", postsResponse.data);
          newCounts.articlesCount = postsResponse.data.count || 0;
        } catch (postError) {
          console.error("Error fetching post count:", postError);
        }

        setCounts(newCounts);
      } catch (error) {
        console.error("Error in fetchCounts:", error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("No token found!");
        return;
      }

      await axios.post(
        `${apiUrl}/api/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await AsyncStorage.removeItem("authToken");
      router.replace("/logIn");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <OverviewCard
        title="Total Volunteers"
        value={counts.volunteerCount.toString()}
        icon="account-group"
      />
      <OverviewCard
        title="Total Organizations"
        value={counts.organizationCount.toString()}
        icon="domain"
      />
      <OverviewCard
        title="Total Projects"
        value={counts.approvedProjects.toString()}
        icon="folder-multiple"
      />
      <OverviewCard
        title="Articles"
        value={counts.articlesCount.toString()}
        icon="file-document-multiple"
      />
      <OverviewCard
        title="Approved Feedback"
        value={counts.approvedFeedback.toString()}
        icon="check-circle-outline"
      />
      {/* Logout Button */}
      <Button title="Logout" color="#D32F2F" onPress={handleLogout} />
    </View>
  );
};

const AdminDashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;
          if (route.name === "Dashboard") iconName = "view-dashboard";
          else if (route.name === "Users") iconName = "account-group";
          else if (route.name === "Projects") iconName = "folder-multiple";
          else if (route.name === "Articles") iconName = "file-document-multiple";
          else if (route.name === "Feedback") iconName = "alert-circle-outline";
          else if (route.name === "Settings") iconName = "cog-outline";
          else iconName = "help-circle";

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#66BB6A", // Light Green for selected
        tabBarInactiveTintColor: "#2E7D32", // Dark Green for unselected
        tabBarStyle: { backgroundColor: "#F1F8E9", height: 70, paddingTop: 9 }, // Soft Green Background
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminHome} />
      <Tab.Screen name="Users" component={ManageUsers} />
      <Tab.Screen name="Projects" component={ManageProjects} />
      <Tab.Screen name="Articles" component={ManageArticles} />
      <Tab.Screen name="Feedback" component={FeedbackReports} />
    </Tab.Navigator>
  );
};

export default AdminDashboard;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E8F5E9", // Light Green Background
  },
  title: {
    fontSize: 25,
    fontWeight: "900",
    color: "#2E7D32",
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    marginVertical: 8,
    backgroundColor: "#A5D6A7", // Soft Green Card
    borderRadius: 10,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  cardTitle: {
    fontSize: 16,
    color: "#1B5E20",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B5E20",
  },
});