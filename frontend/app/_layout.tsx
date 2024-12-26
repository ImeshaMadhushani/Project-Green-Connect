import { Stack } from "expo-router";

const RootLayout = () => {
  const ui = (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
  return ui;
};

export default RootLayout;
