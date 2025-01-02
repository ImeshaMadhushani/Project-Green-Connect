import Card from "../../components/Card";  
import Title from "../../components/Title";  // Ensure the path is correct
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from 'react-native';  // Use built-in Image from 'react-native' instead of 'react-native-elements'
import MapView from "react-native-maps";

const calender = require("../../assets/images/calender.png");  // Ensure the path to image is correct
const clock = require("../../assets/images/clock.png");  // Ensure the path to image is correct
const pin = require("../../assets/images/pin.png");  // Ensure the path to image is correct

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        
        {/* Map Section */}
        <View
          style={{
            width: "100%",
            height: 350,
            marginBottom: 10
          }}
        >
            <MapView style={styles.map} />
        </View>

        {/* Upcoming Events Section */}
        <Title
          title="Upcoming Events"
          onClick={() => {
            Alert.alert("Alert", "working...");
          }}
        />

        {/* Card for Plastic-Free Market Campaign */}
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
        
        {/* What's New Section */}
        <Title title="What's New" />

        {/* Card for Energy Saving Tips */}
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
