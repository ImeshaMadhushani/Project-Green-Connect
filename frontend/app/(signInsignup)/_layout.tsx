import { Slot } from "expo-router";
import { Image, StyleSheet, ScrollView, View, Dimensions } from "react-native";
const topImage = require("../../assets/images/login-template-top.jpg");
const logo = require("../../assets/images/logo1.png");
const { width } = Dimensions.get("window");
const SignLayout = () => {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.imageContainer}>
        <Image source={topImage} resizeMode="cover" style={styles.image} />
        <View style={styles.overlay} />
      </View>
      <Image
        style={{
            height: 200,
        }}
        resizeMode="contain"
        source={logo}
        />
      <View style={styles.container}>
        <Slot />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: "100%",
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
  },
});

export default SignLayout;
