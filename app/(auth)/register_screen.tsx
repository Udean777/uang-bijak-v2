import { Alert, Pressable, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/constants/Colors";
import { verticalScale } from "@/utils/style";
import BackButton from "@/components/BackButton";
import Typography from "@/components/Typography";
import CustomInput from "@/components/CustomInput";
import * as Icons from "phosphor-react-native";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";

const RegisterScreen = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current) {
      Alert.alert("Login", "Please fill all the field");
      return;
    }

    setIsLoading(true);
    const res = await register(
      usernameRef.current,
      emailRef.current,
      passwordRef.current
    );
    setIsLoading(false);
    if (!res.success) {
      Alert.alert("Register", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typography size={30} fontWeight={"800"} color={colors.neutral900}>
            Let's,{" "}
          </Typography>
          <Typography size={30} fontWeight={"800"} color={colors.neutral900}>
            Get Started!
          </Typography>
        </View>

        <View style={styles.form}>
          <Typography size={16} color={colors.neutral700}>
            Register now, and start manage your finances!
          </Typography>
          <CustomInput
            autoCapitalize="none"
            placeholder="Enter your username"
            onChangeText={(value) => (usernameRef.current = value)}
            icon={
              <Icons.User
                size={verticalScale(26)}
                color={colors.neutral500}
                weight="fill"
              />
            }
          />
          <CustomInput
            autoCapitalize="none"
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral500}
                weight="fill"
              />
            }
          />
          <CustomInput
            autoCapitalize="none"
            placeholder="Enter your password"
            onChangeText={(value) => (passwordRef.current = value)}
            secureTextEntry
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral500}
                weight="fill"
              />
            }
          />

          <CustomButton loading={isLoading} onPress={handleSubmit}>
            <Typography fontWeight={"700"} color={colors.white} size={17}>
              Register
            </Typography>
          </CustomButton>
        </View>

        <View style={styles.footer}>
          <Typography size={15} color={colors.neutral900}>
            Doesn't have an account?
          </Typography>
          <Pressable onPress={() => router.push("/login_screen")}>
            <Typography size={15} fontWeight={"700"} color={colors.primary}>
              Login
            </Typography>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
