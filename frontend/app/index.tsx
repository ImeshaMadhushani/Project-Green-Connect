<<<<<<< Updated upstream
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { StatusBar } from 'expo-status-bar';
=======
import { View, Text, StyleSheet, ImageBackground , Image, StatusBar} from "react-native";
>>>>>>> Stashed changes
const bgImage = require("../assets/images/bg.jpg");
const logo = require("../assets/images/logo1.png");

const Index = () => {
  return (
    
    <ImageBackground style={styles.background} source={bgImage}>
<<<<<<< Updated upstream
      <StatusBar backgroundColor='#0B3D2E' style='light' />

      <View style={styles.container}>
        <Image style={styles.logo} resizeMode="contain" source={logo} />
        <Text>Landing Page</Text>
      </View>
=======
      
      <View style={styles.container}>
        <StatusBar backgroundColor="#1F4529" barStyle="light-content" />

          <Image style={styles.logo} resizeMode="contain" source={logo} />
       
          <Text style={styles.tagline}>
            Together We Can Make a Difference
          </Text>
            <Button onPress={()=>{
             
            }} label="Volunteer" />
            <Text style={
              {
                color:"white",
                fontSize: 16
              }
            }>OR</Text>
            <Button label="Organization" />
        </View>
      
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    width: "50%",
    height: 250,
    marginBottom: 25,
=======
    width: "60%",
    height: 250,
    marginBottom: 20,
  },
  tagline: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
>>>>>>> Stashed changes
  },
});

export default Index;
