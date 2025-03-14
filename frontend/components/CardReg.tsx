import { Pressable, Text } from "react-native";
import { View } from "react-native";

type props = {
  heading: string;
  bgColor: string;
  onPress?:()=>void;
  children: React.ReactNode; 
};
  const CardReg = ({  heading, bgColor ,onPress,children }: props) => (
  
  <Pressable
    style={{
      width: "100%",
      height: 'auto',
      padding: 10,
    }}
    onPress={()=>{onPress?onPress():""}}
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
      
        <View
          style={{
            height: 'auto',
            flex: 1,
            marginLeft: 15,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 20 }}>{heading}</Text>
          {children}
        </View>
      </View>
    </View>
  </Pressable>
);

export default CardReg;
