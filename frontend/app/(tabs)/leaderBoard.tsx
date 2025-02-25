import CardReg from "@/components/CardReg";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "react-native-elements";
const user = require("@/assets/images/user.png");

const LearderBoard = () => {
  const ui = (
   <>
    <View
        style={{
          width:"100%",
          aspectRatio:1.1,
          position:'absolute',
          backgroundColor:'#0d805a',
          borderBottomLeftRadius:50,
          borderBottomRightRadius:50
        }}
      />
   <ScrollView contentContainerStyle={styles.container}>
     
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginTop:50
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: 5,
            
          }}
        >
          <View style={{
            padding:5,
            backgroundColor: "#efd910",
            borderRadius: 100,
          }}>
            <Image
              style={{
                width: 120,
                aspectRatio: 1,
              }}
              source={user}
            />
          </View>
          <View
            style={{
              backgroundColor: "#efd910",
              width: 40,
              borderRadius: 50,
              marginTop: -30,
              aspectRatio: 1,
              display:'flex',
              alignItems:"center",
              justifyContent:'center'
            }}
          >
            <Text style={{
              fontSize:20,
              fontWeight:'bold'
            }}>1</Text>

          </View>
          <Text style={{
              fontSize:30,
              fontWeight:'bold',
              color:'white'
            }} >Rebecca Max</Text>
            <Text style={{
              fontSize:20,
              fontWeight:'bold',
              color:'white'
            }} >723</Text>


            <CardReg bgColor="white" heading="Farina Del Rio">
              <View style={
                {
                  display:'flex',
                  flexDirection:'row',
                  marginTop:10,
                  justifyContent:'space-between'
                }
              }>
                <Text>695</Text>
                <Text  style={{
              fontSize:20,
              fontWeight:'bold'
            }} >2</Text>
              </View>
            </CardReg>

            <CardReg bgColor="white" heading="Farina Del Rio">
              <View style={
                {
                  display:'flex',
                  flexDirection:'row',
                  marginTop:10,
                  justifyContent:'space-between'
                }
              }>
                <Text>695</Text>
                <Text  style={{
              fontSize:20,
              fontWeight:'bold'
            }} >2</Text>
              </View>
            </CardReg><CardReg bgColor="white" heading="Farina Del Rio">
              <View style={
                {
                  display:'flex',
                  flexDirection:'row',
                  marginTop:10,
                  justifyContent:'space-between'
                }
              }>
                <Text>695</Text>
                <Text  style={{
              fontSize:20,
              fontWeight:'bold'
            }} >2</Text>
              </View>
            </CardReg><CardReg bgColor="white" heading="Farina Del Rio">
              <View style={
                {
                  display:'flex',
                  flexDirection:'row',
                  marginTop:10,
                  justifyContent:'space-between'
                }
              }>
                <Text>695</Text>
                <Text  style={{
              fontSize:20,
              fontWeight:'bold'
            }} >2</Text>
              </View>
            </CardReg>
            
        </View>

      </View>
      <View style={{ padding: 10, marginTop: 10 }}></View>
    </ScrollView>
    </>
  );
  return ui;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  text: {},
});

export default LearderBoard;
