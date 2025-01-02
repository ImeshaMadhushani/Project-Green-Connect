import { LoadingProvider } from "@/components/loadingContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const RootLayout = () => {
  const ui = (
    <LoadingProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(signInsignup)" options={{ headerShown: false }} />
        <Stack.Screen name="(ngo)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </LoadingProvider>
  );
  return ui;
};

export default RootLayout;
