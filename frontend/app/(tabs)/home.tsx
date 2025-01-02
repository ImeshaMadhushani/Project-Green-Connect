import { ScrollView, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}></View>
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
});



const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            height: 350,
            marginBottom: 10,
          }}
        >
          <MapView style={styles.map} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});


export default Home;
