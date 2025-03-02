import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/constants/Colors";
import { scale, verticalScale } from "@/utils/style";
import { useAuth } from "@/context/authContext";
import { UserDataType } from "@/types";
import { updateUser } from "@/services/userService";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Icons from "phosphor-react-native";
import ModalWrapper from "@/components/ModalWrapper";
import CustomHeader from "@/components/CustomHeader";
import BackButton from "@/components/BackButton";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import Typography from "@/components/Typography";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { fonts } from "@/constants/Fonts";

const profile_modal = () => {
  const { user, updateUserData } = useAuth();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUserData({
      name: user?.username || "",
      image: user?.image || null,
    });
  }, [user]);

  const onSubmit = async () => {
    let { name } = userData;

    if (!name.trim()) {
      Alert.alert("User", "Please fill all the field!");
      return;
    }

    setIsLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    setIsLoading(false);

    if (res.success) {
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("User", res.msg);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, image: result.assets[0] });
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <CustomHeader
          title="Update Profile"
          leftIcon={
            <BackButton
              icon={
                <Icons.X size={verticalScale(26)} color="#fff" weight="bold" />
              }
            />
          }
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={500}
            />

            <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
              <Icons.Pencil
                size={verticalScale(20)}
                color={colors.neutral100}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Typography color={colors.neutral800}>Username</Typography>
            <CustomInput
              placeholder="Username"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <CustomButton
          onPress={onSubmit}
          style={{ flex: 1 }}
          loading={isLoading}
        >
          <Typography
            fontFamily={fonts.NotoSansSemiBold}
            size={17}
            color={colors.neutral100}
          >
            Update
          </Typography>
        </CustomButton>
      </View>
    </ModalWrapper>
  );
};

export default profile_modal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral300,
    marginBottom: spacingY._15,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
