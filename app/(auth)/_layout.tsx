import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login_screen" />
      <Stack.Screen name="register_screen" />
      <Stack.Screen name="welcome" />
    </Stack>
  );
};

export default AuthLayout;
