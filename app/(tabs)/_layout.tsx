import { Tabs } from "expo-router";
import React, { useState } from "react";
import CustomTabBar from "@/components/CustomTabBar";
import { useAuth } from "@/context/authContext";

export default function TabLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Tabs
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          user={user}
        />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="add_transactions" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
