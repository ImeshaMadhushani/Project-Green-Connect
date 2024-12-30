import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "@/components/button-login";
import { router } from "expo-router";

const bgImage = require("../assets/images/bg.jpg");
const logo = require("../assets/images/logo1.png");

const Index = () => {
  return (
    <ImageBackground style={styles.background} source={bgImage}>
      <View style={styles.container}>
        <Image style={styles.logo} resizeMode="contain" source={logo} />
        <Text style={styles.tagline}>Together We Can Make a Difference</Text>
            <Button label="Volunteer" />

            <Text style={styles.orText}>OR</Text>

            <Button label="Organization" onPress={()=>{
              router.navigate("/firstPage", { relativeToDirectory: true })
            }}/>

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
    width: "60%",
    height: 250,
    marginBottom: 20,
  },
  tagline: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  orText: {
    color: "white",
    fontSize: 16,
    marginVertical: 10,
  },
});

export default Index;
