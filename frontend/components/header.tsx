import { router, Stack } from "expo-router";
import { StyleSheet, View, Alert } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";

const leftArrow = require("../assets/images/leftarrow.png");

const logo = require("../assets/images/logo2.png");
const bell = require("../assets/images/bell.png");

type props = {
  onBackPress?: () => void;
  noBack?: boolean;
  // notificationOnPress?:()=>void;
};

const CustomHeader = ({ onBackPress, noBack }: props) => (
  <View style={styles.headerContainer}>
    {!noBack ? (<TouchableOpacity
      onPress={() => {
        onBackPress;
        router.back();
      }}
      style={styles.backButton}
    >
      <Image
        source={leftArrow}
        style={{
          width: 25,
          height: 25,
        }}
      />
    </TouchableOpacity>):null}
    <View style={styles.logoContainer}>
      <Image source={logo} style={styles.logo} />
    </View>
    
  </View>
);

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  backText: {
    fontSize: 24,
    color: "#000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 45,
  },
});
