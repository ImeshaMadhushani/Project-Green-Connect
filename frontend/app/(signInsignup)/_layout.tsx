import { Slot } from "expo-router";
import { Image, StyleSheet, ScrollView, View } from "react-native";

const topImage = require("../../assets/images/login-template-top.jpg");

const SignLayout = () => {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.imageContainer}>
        <Image source={topImage} resizeMode="cover" style={styles.image} />
      </View>
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
  },
});

export default SignLayout;
