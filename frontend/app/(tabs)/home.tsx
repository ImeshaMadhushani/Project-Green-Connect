import { ScrollView, StyleSheet, View } from "react-native";

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

export default Home;