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
  notificationOnPress?:()=>void;
};

const CustomHeader = ({ onBackPress, noBack, notificationOnPress }: props) => (
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
    <Image
      source={logo}
      style={{
        width: 200,
        height: 50,
      }}
    />
    <TouchableOpacity onPress={() => notificationOnPress?notificationOnPress():""}>
      <Image
        source={bell}
        style={{
          width: 25,
          height: 25,
          marginRight: 10,
        }}
      />
    </TouchableOpacity>
  </View>
);

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginRight: 10,
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
});
