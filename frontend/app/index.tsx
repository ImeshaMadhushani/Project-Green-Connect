import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { StatusBar } from 'expo-status-bar';
const bgImage = require("../assets/images/bg.jpg");
const logo = require("../assets/images/logo1.png");

const Index = () => {
  return (
    
    <ImageBackground style={styles.background} source={bgImage}>
      <StatusBar backgroundColor='#0B3D2E' style='light' />

      <View style={styles.container}>
        <Image style={styles.logo} resizeMode="contain" source={logo} />
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
  logo: {
    width: "50%",
    height: 250,
    marginBottom: 25,
  },
});

export default Index;
