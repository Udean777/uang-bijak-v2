import { colors } from "@/constants/Colors";
import { fonts } from "@/constants/Fonts";
import { AuthProvider } from "@/context/authContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    [fonts.Poppins]: require("@/assets/fonts/Poppins-Regular.ttf"),
    [fonts.PoppinsMedium]: require("@/assets/fonts/Poppins-Medium.ttf"),
    [fonts.PoppinsSemiBold]: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    [fonts.PoppinsBold]: require("@/assets/fonts/Poppins-Bold.ttf"),
    [fonts.PoppinsExtraBold]: require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    [fonts.PoppinsBlack]: require("@/assets/fonts/Poppins-Black.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modals)" />
        <Stack.Screen name="index" />
      </Stack>

      <StatusBar backgroundColor={colors.neutral50} barStyle={"dark-content"} />
    </AuthProvider>
  );
}
