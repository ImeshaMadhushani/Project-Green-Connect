// import Card from "@/components/Card";
// import Title from "@/components/Title";
// import { router } from "expo-router";
// import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
// import { Image } from "react-native-elements";
// import MapView from "react-native-maps";
// import { Ionicons } from "@expo/vector-icons";

// const calender = require("../../assets/images/calender.png");
// const clock = require("../../assets/images/clock.png");
// const pin = require("../../assets/images/pin.png");

// const Home = () => {
//   return (
//     <ScrollView contentContainerStyle={styles.contentContainer}>
//       <View style={styles.container}>
        
        
//         <View
//           style={{
//             width: "100%",
//             height: 350,
//             marginBottom:10
//           }}
//         >
//             <MapView style={styles.map} />
//         </View>


//         <Pressable
//           onPress={() => router.push("/projects")}
//           style={styles.sectionHeader}
//         >
//           <Text style={styles.sectionTitle}>Upcoming Events</Text>
//           <Ionicons name="chevron-forward-outline" size={24} color="#333" />
//         </Pressable>

//         <Card
//           bgColor="#dce8d6"
//           heading="Plastic - free market campaign"
//           content={
//             <View style={styles.cardContent}>
//               <View style={styles.infoRow}>
//                 <Image source={calender} style={styles.icon} />
//                 <Text>November 10, 2024</Text>
//               </View>

//               <View style={styles.infoRow}>
//                 <Image source={clock} style={styles.icon} />
//                 <Text>9.00 a.m.</Text>
//               </View>

//               <View style={styles.infoRow}>
//                 <Image source={pin} style={styles.icon} />
//                 <Text>Vavunia, Market</Text>
//               </View>
//             </View>
//           }
//         />
        
//         <Pressable 
//           onPress={() => router.push("/news")} 
//           style={styles.sectionHeader}
//         >
//           <Text style={styles.sectionTitle}>What's New</Text>
//           <Ionicons name="chevron-forward-outline" size={24} color="#333" />
//         </Pressable>

//         <Card
//           heading="Energy - Saving Tips for an eco-Friendly Home"
//           bgColor="#d6e4e8"
//           content={
//             <View style={styles.cardTextContent}>
//               <Text style={styles.cardText}>
//                 Reducing energy consumption at home not only lowers utility
//                 bills but also helps protect the environment. Simple changes...
//               </Text>
//             </View>
//           }
//         />
//       </View>
//     </ScrollView>
    
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   contentContainer: {
//     paddingBottom: 20,
//   },
//   cardContent: {
//     margin: 15,
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
//   sectionHeader: {
//     width: "95%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "lightgray",
//     paddingVertical: 13,
//     paddingHorizontal: 15,
//     borderRadius: 15,
//     marginVertical: 10,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 600,
//     color: "#333",
//   },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   icon: {
//     width: 30,
//     height: 30,
//     marginRight: 10,
//   },
//   cardTextContent: {
//     marginTop: 10,
//   },
//   cardText: {
//     fontSize: 16,
//   },
// });

// export default Home;

import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";
import * as Location from "expo-location";


import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const calender = require("../../assets/images/calender.png");
const clock = require("../../assets/images/clock.png");
const pin = require("../../assets/images/pin.png");

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const Home = () => {
  // Dummy data for events and news
  /*   const [events] = useState([
    {
      id: "1",
      title: "Plastic-Free Market Campaign",
      date: "November 10, 2024",
      time: "9.00 a.m.",
      location: "Vavunia, Market",
    },
    {
      id: "2",
      title: "Tree Planting Drive",
      date: "November 15, 2024",
      time: "10.00 a.m.",
      location: "Colombo Park",
    },
    {
      id: "3",
      title: "Eco-Friendly Fair",
      date: "December 5, 2024",
      time: "11.30 a.m.",
      location: "Kandy Town Hall",
    },
  ]); */

  const projectIcons: { [key: string]: string } = {
    "Waste Reduction": "recycle",
    Plantation: "tree",
    "Disaster Preparedness": "alert-circle-outline",
    "Environmental Awareness Campaigns": "bullhorn-outline",
    "Sustainable Gardening & Agriculture": "sprout",
  };

  interface Event {
    id: string;
    projectName: string;
    projectType: string;
    date: string;
    time: string;
    location: string;
    latitude: number;
    longitude: number;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [news] = useState([
    {
      id: "1",
      title: "Energy-Saving Tips for an Eco-Friendly Home",
      content:
        "Reducing energy consumption at home not only lowers utility bills but also helps protect the environment...",
    },
    {
      id: "2",
      title: "Sustainable Fashion Trends",
      content:
        "Explore how the fashion industry is adopting sustainable practices to reduce waste and pollution...",
    },
    {
      id: "3",
      title: "Benefits of Urban Gardening",
      content:
        "Urban gardening is a great way to grow your own food, reduce carbon footprint, and improve mental health...",
    },
  ]);

  interface Location {
    latitude: number;
    longitude: number;
  }

  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/project/`); // Replace with your API URL
        setEvents(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error fetching projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Fetch user's current location using Expo Location API
    const fetchUserLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } catch (error) {
        console.error("Error fetching user location:", error);
        Alert.alert("Error fetching user location.");
      }
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/feedback/feedback/approved`);
        setFeedback(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  // Haversine formula to calculate distance between two points (in kilometers)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Filter events based on proximity to the user's location (within 50 km)
  const filteredProjects = events.filter((project) => {
    if (!userLocation) return false; // Ensure userLocation is available
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      project.latitude,
      project.longitude
    );
    return distance <= 50; // Adjust the value as needed (50 km in this case)
  });

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: userLocation ? userLocation.latitude : 7.8731,
              longitude: userLocation ? userLocation.longitude : 80.7718,
              latitudeDelta: 2, // Adjusted to zoom out to fit the whole island
              longitudeDelta: 2, // Adjusted for a better zoom level for Sri Lanka
            }}
          >
            {filteredProjects.map((item) => (
              <Marker
                key={item.id}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.projectName}
                description={item.location}
              />
            ))}
          </MapView>
        </View>

        {/* Upcoming Events Section */}
        <Pressable
          onPress={() => router.push("/(tabs)/projects")}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#333" />
        </Pressable>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slider}
          style={{ height: 250 }}
          renderItem={({ item }) => (
            <View style={{ width: 350, marginRight: 10 }}>
              <Card
                bgColor="#dce8d6"
                heading={item.projectName}
                iconName={projectIcons[item.projectType as keyof typeof projectIcons] || "help-circle"}
                content={
                  <View style={styles.cardContent}>
                    <View style={styles.infoRow}>
                      <Image source={calender} style={styles.icon} />
                      <Text>{item.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Image source={clock} style={styles.icon} />
                      <Text>{item.time}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Image source={pin} style={styles.icon} />
                      <Text>{item.location}</Text>
                    </View>
                  </View>
                }
              />
            </View>
          )}
        />

        {/* What's New Section */}
        <Pressable
          onPress={() => router.push("/news")}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>What's New</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#333" />
        </Pressable>

        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slider}
          style={{ height: 250 }}
          renderItem={({ item }) => (
            <View style={{ width: 350, marginRight: 10 }}>
              <Card
                bgColor="#d6e4e8"
                heading={item.title}
                content={
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardText}>{item.content}</Text>
                  </View>
                }
              />
            </View>
          )}
        />

        {/* Approved Feedback Section */}
        <Pressable style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>User Feedback</Text>
        </Pressable>

        <FlatList
          data={feedback}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.slider}
          style={{ height: 200 }}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <Card
                bgColor="#f7e6c3"
                heading={`⭐ ${item.rating} - ${item.username}`}
                content={
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardText}>"{item.comment}"</Text>
                  </View>
                }
              />
            </View>
          )}
        />
      </View>
    </ScrollView>
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
    justifyContent: "center",
  },
  mapContainer: {
    width: "100%",
    height: 350,
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  sectionHeader: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "lightgray",
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  slider: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  // cardStyle: {
  //   marginRight: 15,
  // },

  cardWrapper: {
    width: 350,
    marginRight: 10,
    borderRadius: 10,
    overflow: "hidden", // Ensures the shadow stays within the rounded corners
  },
  cardContent: {
    margin: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cardTextContent: {
    marginTop: 10,
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#333",
  },
});

export default Home;

