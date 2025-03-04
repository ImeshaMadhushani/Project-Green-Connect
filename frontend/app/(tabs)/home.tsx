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

import { useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Image } from "react-native-elements";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";

const calender = require("../../assets/images/calender.png");
const clock = require("../../assets/images/clock.png");
const pin = require("../../assets/images/pin.png");

const Home = () => {
  // Dummy data for events and news
  const [events] = useState([
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
  ]);

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

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView style={styles.map} />
        </View>

        {/* Upcoming Events Section */}
        <Pressable
          onPress={() => router.push("/projects")}
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
              heading={item.title}
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
        <Pressable onPress={() => router.push("/news")} style={styles.sectionHeader}>
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
    paddingLeft: 15,
  },
  // cardStyle: {
  //   marginRight: 15,
  // },
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
  },
  cardText: {
    fontSize: 16,
  },
});

export default Home;

