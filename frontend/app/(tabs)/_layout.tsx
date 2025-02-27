import CustomHeader from "@/components/header";
import { Ionicons } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import { Image } from "react-native-elements";
const homeIcon = require("../../assets/images/homeIcon.png");
const projectsIcon = require("../../assets/images/projectIcon.png");
const newsIcon = require("../../assets/images/newsIcon.png");
const authoritiesIcon = require("../../assets/images/authoritiesIcon.png");
const userIcon = require("../../assets/images/userIcon.png");

const RootLayout = () => {
  const ui = (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true,
          header: () => <CustomHeader noBack={true} />,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={homeIcon}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? color : "gray",
              }}
            />
          ),
          tabBarStyle: {
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          },
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={projectsIcon}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? color : "gray",
              }}
            />
          ),
          tabBarStyle: {
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          },
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={newsIcon}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? color : "gray",
              }}
            />
          ),
          tabBarStyle: {
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          },
        }}
      />
      <Tabs.Screen
        name="authorities"
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={authoritiesIcon}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? color : "gray",
              }}
            />
          ),
          tabBarStyle: {
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          },
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          headerShown: true,
          header: () => <CustomHeader />,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <Image
              source={userIcon}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? color : "gray",
              }}
            />
          ),
          tabBarStyle: {
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          },
        }}
      />
    </Tabs>
  );
  return ui;
};

export default RootLayout;
