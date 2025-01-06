import { LoadingProvider } from "@/components/loadingContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const RootLayout = () => {
  const ui = (
    <LoadingProvider>
      {/* <StatusBar hidden={true} /> */}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, statusBarHidden: true  }} />
        <Stack.Screen name="(signInsignup)" options={{ headerShown: false, statusBarHidden: true  }} />
        <Stack.Screen name="(ngo)" options={{ headerShown: false, statusBarHidden: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, statusBarHidden: false  }} />
      </Stack>
    </LoadingProvider>
  );
  return ui;
};

export default RootLayout;
