import { View, Text, StyleSheet, ImageBackground } from "react-native";
const bgImage = require("../assets/images/bg.jpg");
import Button from "@/components/button-login";

const Index = () => {
  return (
    <ImageBackground style={styles.background} source={bgImage}>
      <View style={styles.container}>
        <Text>Landing Page</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Index;
