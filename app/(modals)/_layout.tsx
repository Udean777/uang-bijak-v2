import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const ModalLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="profile_modal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default ModalLayout;
