import Card from "@/components/Card";
import Title from "@/components/Title";
import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "react-native-elements";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

const calender = require("../../assets/images/calender.png");
const clock = require("../../assets/images/clock.png");
const pin = require("../../assets/images/pin.png");

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>

        <View
          style={{
            width: "100%",
            height: 350,
            marginBottom: 10
          }}
        >
          <MapView style={styles.map} />
        </View>


        <Pressable
          onPress={() => router.push("/projects")}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#333" />
        </Pressable>

        <Card
          bgColor="#dce8d6"
          heading="Plastic - free market campaign"
          content={
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Image source={calender} style={styles.icon} />
                <Text>November 10, 2024</Text>
              </View>

              <View style={styles.infoRow}>
                <Image source={clock} style={styles.icon} />
                <Text>9.00 a.m.</Text>
              </View>

              <View style={styles.infoRow}>
                <Image source={pin} style={styles.icon} />
                <Text>Vavunia, Market</Text>
              </View>
            </View>
          }
        />
        
        <Pressable 
          onPress={() => router.push("/news")} 
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>What's New</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#333" />
        </Pressable>

        <Card
          heading="Energy - Saving Tips for an eco-Friendly Home"
          bgColor="#d6e4e8"
          content={
            <View style={styles.cardTextContent}>
              <Text style={styles.cardText}>
                Reducing energy consumption at home not only lowers utility
                bills but also helps protect the environment. Simple changes...
              </Text>
            </View>
          }
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
  cardContent: {
    margin: 15,
  },
  map: {
    width: '100%',
    height: '100%',
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
    fontWeight: 600,
    color: "#333",
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