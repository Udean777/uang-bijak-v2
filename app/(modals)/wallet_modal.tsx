import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { WalletType } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createOrUpdateWallet, deleteWallet } from "@/services/wallet_service";
import { colors, spacingX, spacingY } from "@/constants/Colors";
import { scale, verticalScale } from "@/utils/style";
import ModalWrapper from "@/components/ModalWrapper";
import CustomHeader from "@/components/CustomHeader";
import BackButton from "@/components/BackButton";
import * as Icons from "phosphor-react-native";
import Typography from "@/components/Typography";
import CustomInput from "@/components/CustomInput";
import ImageUpload from "@/components/ImageUpload";
import CustomButton from "@/components/CustomButton";
import { fonts } from "@/constants/Fonts";

const Modal = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const oldWallet: { name: string; image: string; id: string } =
    useLocalSearchParams();

  useEffect(() => {
    if (oldWallet.id) {
      setWallet({
        name: oldWallet.name,
        image: oldWallet.image,
      });
    }
  }, []);

  const onSubmit = async () => {
    let { name, image } = wallet;

    if (!name.trim()) {
      Alert.alert("Wallet", "Please fill all the field!");
      return;
    }

    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };

    if (oldWallet.id) data.id = oldWallet.id;

    setIsLoading(true);
    const res = await createOrUpdateWallet(data);
    setIsLoading(false);

    // console.log("Result:", res);

    if (res.success) {
      //   updatewallet(user?.uid as string);
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const onDeleteWallet = async () => {
    if (!oldWallet.id) return;

    setIsLoading(true);
    const res = await deleteWallet(oldWallet.id);
    setIsLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this wallet? All the data of this wallet will be deleted permanently.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDeleteWallet(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <CustomHeader
          title="Buat Dompet"
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
          <View style={styles.inputContainer}>
            <Typography color={colors.neutral800}>Nama Dompet</Typography>
            <CustomInput
              placeholder="Contoh: Freelance"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typography color={colors.neutral800}>Gambar</Typography>
            <ImageUpload
              placeholder="Unggah Gambar"
              file={wallet.image}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              onClear={() => setWallet({ ...wallet, image: null })}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldWallet.id && !isLoading && (
          <CustomButton
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </CustomButton>
        )}
        <CustomButton
          onPress={onSubmit}
          style={{ flex: 1 }}
          loading={isLoading}
        >
          <Typography
            fontFamily={fonts.NotoSansSemiBold}
            color={colors.neutral100}
            size={17}
          >
            {oldWallet.id ? "Update Dompet" : "Buat Dompet"}
          </Typography>
        </CustomButton>
      </View>
    </ModalWrapper>
  );
};

export default Modal;

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
