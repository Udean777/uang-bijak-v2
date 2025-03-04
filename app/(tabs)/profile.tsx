import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { accountOptionType } from "@/types";
import * as Icons from "phosphor-react-native";
import { colors, radius, spacingX, spacingY } from "@/constants/Colors";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { router } from "expo-router";
import { verticalScale } from "@/utils/style";
import ScreenWrapper from "@/components/ScreenWrapper";
import CustomHeader from "@/components/CustomHeader";
import { getProfileImage } from "@/services/imageService";
import { useAuth } from "@/context/authContext";
import { Image } from "expo-image";
import Typography from "@/components/Typography";
import { fonts } from "@/constants/Fonts";
import Animated, { FadeInDown } from "react-native-reanimated";

const accountOptions: accountOptionType[] = [
  {
    title: "Edit Profile",
    icon: <Icons.User size={26} color={colors.white} weight="fill" />,
    routeName: "/(modals)/profile_modal",
    bgColor: "#6366f1",
  },
  {
    title: "Settings",
    icon: <Icons.GearSix size={26} color={colors.white} weight="fill" />,
    // routeName: "/(modals)/profileModal",
    bgColor: "#059669",
  },
  {
    title: "Privacy Policy",
    icon: <Icons.Lock size={26} color={colors.white} weight="fill" />,
    // routeName: "/(modals)/profileModal",
    bgColor: colors.neutral600,
  },
  {
    title: "Logout",
    icon: <Icons.Power size={26} color={colors.white} weight="fill" />,
    // routeName: "/(modals)/profileModal",
    bgColor: "#e11d48",
  },
];

const Page = () => {
  const { user } = useAuth();

  const handlePress = async (item: accountOptionType) => {
    if (item.title === "Logout") {
      Alert.alert("Confirm", "Are you sure want to logout?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel logout"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => await signOut(auth),
          style: "destructive",
        },
      ]);
    }

    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <CustomHeader
          title="Profile"
          style={{
            marginVertical: spacingY._10,
          }}
        />

        <View style={styles.userInfo}>
          <View>
            <Image
              style={styles.avatar}
              source={getProfileImage(user?.image)}
              contentFit="cover"
              transition={500}
            />
          </View>

          <View style={styles.nameContainer}>
            <Typography
              size={20}
              fontFamily={fonts.NotoSansBold}
              color={colors.neutral800}
            >
              {user?.username}
            </Typography>
            <Typography
              size={15}
              fontFamily={fonts.NotoSans}
              color={colors.neutral800}
            >
              {user?.email}
            </Typography>
          </View>
        </View>

        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <Animated.View
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(14)}
              key={item.title}
              style={styles.listItem}
            >
              <TouchableOpacity
                style={styles.flexRow}
                onPress={() => handlePress(item)}
              >
                <View
                  style={[styles.listIcon, { backgroundColor: item.bgColor }]}
                >
                  {item.icon && item.icon}
                </View>
                <Typography
                  size={16}
                  style={{ flex: 1 }}
                  fontFamily={fonts.NotoSansSemiBold}
                  color={colors.neutral900}
                >
                  {item.title}
                </Typography>
                <Icons.CaretRight
                  size={verticalScale(20)}
                  weight="bold"
                  color={colors.neutral900}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
