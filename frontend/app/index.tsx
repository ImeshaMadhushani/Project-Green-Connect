import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { StatusBar } from 'expo-status-bar';
const bgImage = require("../assets/images/bg.jpg");

const Index = () => {
  return (
    
    <ImageBackground style={styles.background} source={bgImage}>
      <StatusBar backgroundColor='#0B3D2E' style='light' />

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
