import { ScrollView, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import Card from "@/components/Card";
import { Image, Text, View } from "react-native-elements";

const calender = require("../../assets/images/calender.png");
const clock = require("../../assets/images/clock.png");
const pin = require("../../assets/images/pin.png");

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}></View>
     
      <View
          style={{
            width: "100%",
            height: 350,
            marginBottom:10
          }}
        >
            <MapView style={styles.map} />
        </View>


        <Title
          title="Upcoming Events"
          onClick={() => {
            Alert.alert("Alert", "working...");
          }}
        />

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
        <Title title="What's New" />
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
  map: {
    width: "100%",
    height: "100%",
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  }
});


export default Home;
