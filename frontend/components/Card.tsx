import { ReactElement } from "react";
import { ImageSourcePropType, Text, View } from "react-native";
import { Image } from "react-native-elements";

type Props = {
  image?: ImageSourcePropType;
  heading: string;
  bgColor: string;
  content: React.JSX.Element;
  onPress?:()=>void;
};

const Card = ({ image, heading, bgColor, content,onPress }: Props) => (
    <View
      style={{
        width: "100%",
        height: "auto",
        padding: 10,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "auto",
          backgroundColor: bgColor,
          borderRadius: 20,
          padding: 15,
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
          <View
            style={{
              height: "auto",
              flex: 1,
              marginLeft: 15,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 20 }}>{heading}</Text>
            {content}
          </View>
        </View>
      </View>
    </View>
  );
  
  export default Card;

 


  
  