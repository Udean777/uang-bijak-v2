import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { WalletType } from "@/types";
import { Router } from "expo-router";
import { verticalScale } from "@/utils/style";
import { colors } from "@/constants/Colors";
import { Image } from "expo-image";
import Typography from "./Typography";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { toRupiah } from "@/utils/common";
import { fonts } from "@/constants/Fonts";

const WalletListItem = ({
  item,
  index,
  router,
}: {
  item: WalletType;
  index: number;
  router: Router;
}) => {
  const openWallet = () => {
    router.push({
      pathname: "/wallet_modal",
      params: {
        id: item.id,
        name: item.name,
        image: item.image,
      },
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={openWallet}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              style={styles.image}
              source={item.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.placeholderIcon}>
              <Icons.Wallet size={40} color={colors.primary} weight="fill" />
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Typography
            size={16}
            color={colors.neutral900}
            fontFamily={fonts.PoppinsSemiBold}
          >
            {item.name}
          </Typography>
          <Typography
            size={14}
            color={colors.neutral600}
            fontFamily={fonts.Poppins}
          >
            {toRupiah(item.amount!)}
          </Typography>
        </View>

        <View style={styles.iconContainer}>
          <Icons.CaretRight
            size={verticalScale(20)}
            weight="bold"
            color={colors.neutral600}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: colors.neutral50,
    borderRadius: 15,
    padding: 12,
    marginBottom: verticalScale(12),
    // shadowColor: colors.neutral900,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
  },
  imageContainer: {
    width: verticalScale(50),
    height: verticalScale(50),
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  image: {
    flex: 1,
  },
  placeholderIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral100,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  iconContainer: {
    padding: 5,
  },
});
