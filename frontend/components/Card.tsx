import { ReactElement } from "react";
import { ImageSourcePropType, Text, View, Pressable } from "react-native";
import { Image } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  image?: ImageSourcePropType;
  iconName?: string;
  heading: string;
  bgColor: string;
  content: React.JSX.Element;
  onPress?:()=>void;
};

const Card = ({ image, iconName, heading, bgColor, content, onPress }: Props) => (
  <Pressable
    style={{
      width: "100%",
      height: 'auto',
      padding: 10,
    }}
    onPress={() => { onPress ? onPress() : ""; }}
  >
    <View
      style={{
        width: "100%",
        height: "auto",
        backgroundColor: bgColor,
        borderRadius: 20,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {iconName ? (
          // Render icon if iconName is passed

          <MaterialCommunityIcons
            name={iconName}
            size={70}
            color="#006400"
            style={{
              marginTop: 40,
              marginBottom: 15,
              marginLeft: 15,
            }}
          />
        ) : (
          // Render image if image is passed
          <Image
            style={{
              height: 100,
              aspectRatio: 1,
              borderRadius: 10,
              marginTop: 15,
              marginBottom: 15,
            }}
            source={image}
          />
        )}
        <View
          style={{
            height: 'auto',
            flex: 1,
            marginLeft: 15,
            borderRadius: 15,
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{heading}</Text>
          {content}
        </View>
      </View>
    </View>
  </Pressable>
);
  
  export default Card;

 


  
  