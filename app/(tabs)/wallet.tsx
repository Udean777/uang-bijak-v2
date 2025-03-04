import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/style";
import { colors, radius, spacingX, spacingY } from "@/constants/Colors";
import Typography from "@/components/Typography";
import * as Icons from "phosphor-react-native";
import { fonts } from "@/constants/Fonts";
import Loading from "@/components/Loading";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import WalletListItem from "@/components/WalletListItem";

const Page = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: wallets,
    error,
    isLoading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotalBalance = () => {
    return wallets.reduce((total, item) => total + (item.amount || 0), 0);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typography
              size={45}
              fontFamily={fonts.NotoSans}
              color={colors.neutral900}
            >
              {getTotalBalance().toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </Typography>
            <Typography size={16} color={colors.neutral700}>
              Total Saldo
            </Typography>
          </View>
        </View>

        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typography
              size={20}
              fontFamily={fonts.NotoSans}
              color={colors.neutral900}
            >
              My Wallets
            </Typography>
            <TouchableOpacity onPress={() => router.push("/wallet_modal")}>
              <Icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>

          {isLoading && <Loading />}
          <FlashList
            data={wallets}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <WalletListItem item={item} index={index} router={router} />
            )}
            contentContainerStyle={styles.listStyle}
            estimatedItemSize={100}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icons.Wallet size={50} color={colors.neutral500} />
                <Typography
                  size={16}
                  color={colors.neutral700}
                  style={{ marginTop: 10 }}
                >
                  Belum ada dompet, buat sekarang!
                </Typography>
              </View>
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral100,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  addButton: {
    marginTop: 15,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius._20,
  },
});
