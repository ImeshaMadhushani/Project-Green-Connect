import Card from "@/components/Card";
import { router, Stack } from "expo-router";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const plus = require("../../assets/images/plus.png");
const scope = require("../../assets/images/scope.png");

const News = () => {
    const ui = (
      <>
      <View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.container}>
            <View style={{ 
                width: "100%", 
                padding: 10 
                }}
                >
              <Text style={{ 
                fontSize: 25,
                textAlign: "center",
                fontWeight: "bold",
                }}
                >
                    Articles/News
              </Text>
              <View style={{
                padding: 3,
                margin: 10,
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",

              }}
              >
              <TextInput
                placeholder="Search"
                style={{ 
                    flex: 1, 
                    borderWidth: 0 
                }}
              />
              <Pressable onPress={() => {
                router.navigate('/user')
              }}>
                <Image source={scope} style={{ 
                    width: 30, 
                    height: 30 
                    }} 
                    />
              </Pressable>
            </View>
          </View>
    
          <Card
          onPress={()=>{
            router.navigate("/view/articleView");
          }}
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#d6e4e8"
            content={
              <View style={styles.cardTextContent}>
                <Text style={styles.cardText}>
                  Reducing energy consumption at home not only lowers utility
                  bills but also helps protect the environment. Simple
                  changes...
                </Text>
              </View>
            }
          />

          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#FFFDEC"
            content={
              <View style={styles.cardTextContent}>
                <Text style={styles.cardText}>
                  Reducing energy consumption at home not only lowers utility
                  bills but also helps protect the environment. Simple
                  changes...
                </Text>
              </View>
            }
          />

          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#E4F1AC"
            content={
              <View style={styles.cardTextContent}>
                <Text style={styles.cardText}>
                  Reducing energy consumption at home not only lowers utility
                  bills but also helps protect the environment. Simple
                  changes...
                </Text>
              </View>
            }
          />

          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#E1AFD1"
            content={
              <View style={styles.cardTextContent}>
                <Text style={styles.cardText}>
                  Reducing energy consumption at home not only lowers utility
                  bills but also helps protect the environment. Simple
                  changes...
                </Text>
              </View>
            }
          />

          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#F4D9D0"
            content={
              <View style={styles.cardTextContent}>
                <Text style={styles.cardText}>
                  Reducing energy consumption at home not only lowers utility
                  bills but also helps protect the environment. Simple
                  changes...
                </Text>
              </View>
            }
          />

          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#F7F9F2"
            content={
              <View style={styles.cardTextContent}>
                <Text style={styles.cardText}>
                  Reducing energy consumption at home not only lowers utility
                  bills but also helps protect the environment. Simple
                  changes...
                </Text>
              </View>
            }
          />

        </View>
      </ScrollView>

        <View style={{
            width: 75,
            height: 75,
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: 8,
        }}
        >
          <Pressable onPress={() => {
            router.navigate("/createArticles", { relativeToDirectory: true })
          }}>
            <Image source={plus} style={{
                 width: "100%", 
                 height: "100%" 
                 }} 
                 />
          </Pressable>
        </View>
    </View>
    </>
  );
  return ui;
};

const styles = StyleSheet.create({
    container: {
      width: "100%",
      alignItems: "center",
      paddingVertical: 10,
    },
    contentContainer: {
      paddingBottom: 20,
    },
    cardContent: {
      margin: 15,
    },
    map: {
      width: "100%",
      height: "100%",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    icon: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    cardTextContent: {
      marginTop: 10,
    },
    cardText: {
      fontSize: 16,
    },
  });
  
  export default News;
  