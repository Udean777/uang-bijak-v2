import { Tabs } from "expo-router";
import React from "react";
import * as Icons from "phosphor-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Icons.House size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
