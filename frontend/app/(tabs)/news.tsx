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
