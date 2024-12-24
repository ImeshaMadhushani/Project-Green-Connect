import { View, Text, StyleSheet, ImageBackground } from "react-native";
const bgImage = require("../assets/images/bg.jpg");
import Button from "@/components/button-login";
const logo = require("../assets/images/logo1.png");
import { router } from "expo-router";

const Index = () => {
  const ui = (
    <ImageBackground style={styles.background} source={bgImage}>
      
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
       
          <Text style={{ color: "white" }}>
            Together We Can Make a Difference
          </Text>
            <Button onPress={()=>{
             
            }} label="Volunteer" />
            <Text style={
              {
                color:"white"
              }
            }>OR</Text>
            <Button label="Organization" />
        </View>
      
    </ImageBackground>
  );
  return ui;
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
