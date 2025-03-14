import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, Text } from "react-native-paper";

// Import screens
import ManageUsers from "./manageUsers";
import ManageProjects from "./manageProjects";
import ManageArticles from "./manageArticles";
import FeedbackReports from "./feedbackReports";

// Tab Navigator
const Tab = createBottomTabNavigator();

// Overview Cards
const OverviewCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
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
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <OverviewCard title="Total Volunteers" value="100" icon="account-group" />
        <OverviewCard title="Total Organizations" value="50" icon="domain"/>
        <OverviewCard title="Total Projects" value="75" icon="folder-multiple" />
        <OverviewCard title="Articles" value="120" icon="file-document-multiple" />
        <OverviewCard title="Feedback" value="30" icon="alert-circle-outline" />
      </View>
    );
  };
  
  const AdminDashboard = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={AdminHome} />
      </Tab.Navigator>
    );
  };
  
  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#E8F5E9", // Light Green Background
    },
    title: {
      fontSize: 25,
      fontWeight: 900 ,
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
  
  export default AdminDashboard;
  