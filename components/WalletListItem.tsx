import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { WalletType } from "@/types";
import { Router } from "expo-router";
import { verticalScale } from "@/utils/style";
import { colors, radius, spacingX } from "@/constants/Colors";
import { Image } from "expo-image";
import Typography from "./Typography";
import * as Icons from "phosphor-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { toRupiah } from "@/utils/common";

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
      <TouchableOpacity style={styles.container} onPress={openWallet}>
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              style={{ flex: 1 }}
              source={item.image}
              contentFit="cover"
              transition={100}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icons.Wallet size={40} color={colors.primary} weight="fill" />
            </View>
          )}
        </View>
        <View style={styles.nameContainer}>
          <Typography size={16} color={colors.neutral900}>
            {item.name}
          </Typography>
          <Typography size={14} color={colors.neutral600}>
            {toRupiah(item.amount!)}
          </Typography>
        </View>

        <Icons.CaretRight
          size={verticalScale(20)}
          weight="bold"
          color={colors.black}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(17),
  },
  imageContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  nameContainer: {
    flex: 1,
    gap: 2,
    marginLeft: spacingX._10,
  },
});
