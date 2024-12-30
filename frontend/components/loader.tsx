import { Image } from "expo-image";
import { View } from "react-native";

const Loader = () => {
  const ui =  (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "#ffffffad",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{
          width: 150,
          height: 150,
          borderRadius: 20,
          backgroundColor: "white",
        }}>
            
        </View>
    </View>
  );

  return ui;
};

export default Loader;
