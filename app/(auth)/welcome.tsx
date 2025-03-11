import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { colors, spacingX, spacingY } from "@/constants/Colors";
import { verticalScale } from "@/utils/style";
import CustomButton from "@/components/CustomButton";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { fonts } from "@/constants/Fonts";

const Welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login_screen")}
            style={styles.loginButton}
          >
            <Typography
              fontFamily={fonts.PoppinsSemiBold}
              color={colors.neutral100}
            >
              Login
            </Typography>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("@/assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typography
              size={30}
              fontFamily={fonts.PoppinsBold}
              color={colors.neutral900}
            >
              Take Control of
            </Typography>
            <Typography
              size={30}
              fontFamily={fonts.PoppinsBold}
              color={colors.primary}
            >
              Your Finances.
            </Typography>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(12)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typography
              size={17}
              color={colors.neutral600}
              fontFamily={fonts.PoppinsMedium}
            >
              Managing your money is the key
            </Typography>
            <Typography
              size={17}
              color={colors.neutral600}
              fontFamily={fonts.PoppinsMedium}
            >
              to financial freedom.
            </Typography>
          </Animated.View>

          <Animated.View
            style={styles.buttonContainer}
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
          >
            <CustomButton
              onPress={() => router.push("/(auth)/register_screen")}
            >
              <Typography
                size={17}
                color={colors.white}
                fontFamily={fonts.PoppinsSemiBold}
              >
                Get Started
              </Typography>
            </CustomButton>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
    backgroundColor: colors.white,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(280),
    alignSelf: "center",
    marginTop: verticalScale(80),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  footer: {
    backgroundColor: colors.neutral100,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -5 },
    elevation: 5,
    shadowRadius: 20,
    shadowOpacity: 0.1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
