import { Image, Pressable, Text, View } from "react-native";

type props = {
  title: string;
  onClick?: () => void;
};

const arrow = require("../assets/images/rightArrow.png");
const Title = ({ title, onClick }: props) => (
  <View
    style={{
      width: "100%",
      height: "auto",
      padding:10
    }}
  >
    <View
      style={{
        borderRadius: 20,
        width: "100%",
        height: "auto",
        padding: 15,
        backgroundColor: "#cdcfd1",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          fontSize: 30,
        }}
      >
        {title}
      </Text>
      <Pressable onPress={onClick}>
        <Image
          source={arrow}
          style={{
            width: 30,
            height: 30,
          }}
        />
      </Pressable>
    </View>
  </View>
);

export default Title;
