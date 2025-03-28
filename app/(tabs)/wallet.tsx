import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/style";
import { colors } from "@/constants/Colors";
import Typography from "@/components/Typography";
import * as Icons from "phosphor-react-native";
import { fonts } from "@/constants/Fonts";
import Loading from "@/components/Loading";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import WalletListItem from "@/components/WalletListItem";
import { toRupiah } from "@/utils/common";
import Animated, { FadeInDown } from "react-native-reanimated";

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

  const getTotals = () => {
    return wallets.reduce(
      (totals: any, item: WalletType) => {
        totals.balance = totals.balance + Number(item.amount);
        totals.income = totals.income + Number(item.totalIncome);
        totals.expenses = totals.expenses + Number(item.totalExpenses);

        return totals;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  };

  const getTotalBalance = () => {
    return wallets.reduce((total, item) => total + (item.amount || 0), 0);
  };

  return (
    <ScreenWrapper>
      <Animated.View
        style={styles.container}
        entering={FadeInDown.duration(500)}
      >
        <Animated.View
          style={styles.balanceCard}
          entering={FadeInDown.delay(200)}
        >
          {/* Just some text */}
          <View style={{ alignSelf: "flex-start" }}>
            <Typography
              size={18}
              color={colors.neutral200}
              style={styles.balanceLabel}
            >
              Total Saldo
            </Typography>
            <Typography
              size={36}
              fontFamily={fonts.PoppinsBold}
              color={colors.neutral50}
              style={styles.balanceAmount}
            >
              {toRupiah(getTotalBalance())}
            </Typography>
          </View>

          {/* For displaying expense and income */}
          <View style={styles.statsContainer}>
            {/* Income */}
            <View style={styles.statCard}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: colors.neutral100 + "30" },
                  ]}
                >
                  <Icons.ArrowDownRight
                    size={verticalScale(16)}
                    color={colors.neutral100}
                    weight="bold"
                  />
                </View>
                <Typography
                  size={15}
                  color={colors.white}
                  fontFamily={fonts.Poppins}
                >
                  Pemasukan
                </Typography>
              </View>
              <Typography
                size={18}
                color={colors.white}
                fontFamily={fonts.PoppinsBold}
                textProps={{ numberOfLines: 1 }}
              >
                {isLoading ? "______" : `${toRupiah(getTotals().income)}`}
              </Typography>
            </View>

            {/* Expense */}
            <View style={styles.statCard}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: colors.neutral100 + "30" },
                  ]}
                >
                  <Icons.ArrowUpRight
                    size={verticalScale(16)}
                    color={colors.neutral100}
                    weight="bold"
                  />
                </View>
                <Typography
                  size={15}
                  color={colors.white}
                  fontFamily={fonts.Poppins}
                >
                  Pengeluaran
                </Typography>
              </View>
              <Typography
                size={18}
                color={colors.white}
                fontFamily={fonts.PoppinsBold}
                textProps={{ numberOfLines: 1 }}
              >
                {isLoading ? "______" : `${toRupiah(getTotals().expenses)}`}
              </Typography>
            </View>
          </View>
        </Animated.View>

        {/* List Item */}
        <View style={styles.walletSection}>
          <View style={styles.sectionHeader}>
            <Typography
              size={20}
              fontFamily={fonts.PoppinsSemiBold}
              color={colors.neutral900}
            >
              Dompet Saya
            </Typography>
            <TouchableOpacity
              onPress={() => router.push("/wallet_modal")}
              style={styles.addButton}
            >
              <Icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(28)}
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
            contentContainerStyle={styles.listContainer}
            estimatedItemSize={100}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icons.Wallet
                  size={60}
                  color={colors.neutral400}
                  weight="light"
                />
                <Typography
                  size={16}
                  color={colors.neutral600}
                  style={styles.emptyStateText}
                >
                  No wallets yet. Create one now!
                </Typography>
              </View>
            }
          />
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  balanceCard: {
    // backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    // marginHorizontal: 16,
    // marginTop: 10,
    // marginBottom: 20,
    // shadowColor: colors.neutral900,
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 5,
    alignItems: "center",
  },
  balanceLabel: {
    marginBottom: 5,
    fontFamily: fonts.PoppinsSemiBold,
  },
  balanceAmount: {
    marginTop: 5,
    fontFamily: fonts.PoppinsExtraBold,
  },
  walletSection: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addButton: {
    padding: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 15,
    textAlign: "center",
  },
  statIcon: {
    padding: verticalScale(8),
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  statCard: {
    width: "48%",
    backgroundColor: colors.neutral100 + "20",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});
