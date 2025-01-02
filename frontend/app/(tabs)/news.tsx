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

// News component function
const News = () => {
    // UI of the News component
    const ui = (
      <>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.container}>
            <View style={{ width: "100%", padding: 10 }}>
              <Text style={{ fontSize: 25 }}>Articles/News</Text>

              <View style={searchBarStyle}>
              <TextInput
                placeholder="Search"
                style={{ flex: 1, borderWidth: 0 }}
              />
              <Pressable onPress={() => router.navigate('/user')}>
                <Image source={scope} style={{ width: 30, height: 30 }} />
              </Pressable>
            </View>
          </View>

                    {/* Card components for different news articles */}
                    <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#d6e4e8"
            content={newsContent("Reducing energy consumption at home not only lowers utility bills but also helps protect the environment. Simple changes...")}
          />
          
          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#FFFDEC"
            content={newsContent("Reducing energy consumption at home not only lowers utility bills but also helps protect the environment. Simple changes...")}
          />
          
          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#F9E6CF"
            content={newsContent("Reducing energy consumption at home not only lowers utility bills but also helps protect the environment. Simple changes...")}
          />
          
          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#E4F1AC"
            content={newsContent("Reducing energy consumption at home not only lowers utility bills but also helps protect the environment. Simple changes...")}
          />
          
          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#E1AFD1"
            content={newsContent("Reducing energy consumption at home not only lowers utility bills but also helps protect the environment. Simple changes...")}
          />
          
          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#F4D9D0"
            content={newsContent("Reducing energy consumption at home not only lowers utility bills but also helps protect the environment. Simple changes...")}
          />
          
          <Card
            heading="Energy - Saving Tips for an eco-Friendly Home"
            bgColor="#F7F9F2"
            content={newsContent("Reducing energy consumption at home not only lowers utility bills but also helps protect the environment. Simple changes...")}
          />
        </View>
      </ScrollView>

        {/* Floating add button */}
        <View style={floatingButtonStyle}>
          <Pressable onPress={() => Alert.alert("Alert", "add")}>
            <Image source={plus} style={{ width: "100%", height: "100%" }} />
          </Pressable>
        </View>
    </>
  );
  return ui;
};

