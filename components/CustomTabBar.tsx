import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useRef, useEffect } from "react";
import { verticalScale } from "@/utils/style";
import { colors } from "@/constants/Colors";
import * as Icons from "phosphor-react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { UserType } from "@/types";

interface CustomTabBarProps extends BottomTabBarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserType;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  isOpen,
  setIsOpen,
  user,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const tabBarIcons: any = {
    index: (isFocused: boolean) => (
      <Icons.House
        size={verticalScale(28)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    transactions: (isFocused: boolean) => (
      <Icons.ArrowsLeftRight
        size={verticalScale(28)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    add_transactions: () =>
      isOpen ? (
        <Icons.XCircle
          size={verticalScale(70)}
          weight="fill"
          color={colors.primary}
          style={styles.floatingIcon}
        />
      ) : (
        <Icons.PlusCircle
          size={verticalScale(70)}
          weight="fill"
          color={colors.primary}
          style={styles.floatingIcon}
        />
      ),
    budget: (isFocused: boolean) => (
      <Icons.Wallet
        size={verticalScale(28)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFocused: boolean) => (
      <Image
        source={user?.image}
        style={{
          width: verticalScale(28),
          height: verticalScale(28),
          borderRadius: verticalScale(14),
          borderWidth: 2,
          borderColor: isFocused ? colors.primary : colors.neutral400,
        }}
      />
    ),
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.menuContainer, { transform: [{ scale: scaleAnim }] }]}
      >
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.green }]}
          onPress={() => alert("Income")}
        >
          <Icons.ArrowDown size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.rose }]}
          onPress={() => alert("Expense")}
        >
          <Icons.ArrowUp size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === "add_transactions") {
              setIsOpen(!isOpen);
            } else {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            }
          };

          return (
            <TouchableOpacity
              key={route.name}
              onPress={onPress}
              style={styles.tabBarItem}
            >
              {tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: verticalScale(10),
    width: "92%",
    alignSelf: "center",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    height: Platform.OS === "ios" ? verticalScale(70) : verticalScale(60),
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent effect
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: verticalScale(30),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    backdropFilter: "blur(10px)", // Glassmorphism effect
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: verticalScale(8),
    position: "relative",
    borderRadius: verticalScale(15), // Rounded tab item
  },
  floatingIcon: {
    position: "absolute",
    bottom: 1,
  },
  menuContainer: {
    position: "absolute",
    bottom: verticalScale(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: verticalScale(10),
    borderRadius: verticalScale(25),
  },
  menuItem: {
    width: verticalScale(55),
    height: verticalScale(55),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    transform: [{ scale: 1 }],
  },
});
