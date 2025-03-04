import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { scale, verticalScale } from "@/utils/style";
import { colors, spacingX, spacingY } from "@/constants/Colors";
import Typography from "./Typography";
import * as Icons from "phosphor-react-native";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { toRupiah } from "@/utils/common";
import { fonts } from "@/constants/Fonts";
import { router } from "expo-router";

const HomeCard = () => {
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primary]}
        style={styles.gradientBackground}
      >
        <View style={styles.balanceSection}>
          <Typography color={colors.white} size={16} fontFamily={fonts.Poppins}>
            Total Balance
          </Typography>
          <Typography
            color={colors.white}
            size={32}
            fontFamily={fonts.PoppinsBold}
          >
            {isLoading ? "______" : `${toRupiah(getTotals().balance)}`}
          </Typography>
        </View>

        <View style={styles.statsContainer}>
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
                <Icons.ArrowDown
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
            >
              {isLoading ? "______" : `${toRupiah(getTotals().income)}`}
            </Typography>
          </View>

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
                <Icons.ArrowUp
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
            >
              {isLoading ? "______" : `${toRupiah(getTotals().expenses)}`}
            </Typography>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.actionContainer}>
        {/* <TouchableOpacity style={styles.actionButton}>
          <Icons.Plus size={24} color={colors.primary} />
          <Typography
            size={12}
            color={colors.primary}
            fontFamily={fonts.Poppins}
            style={styles.actionButtonText}
          >
            Add Expense
          </Typography>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/statistics")}
        >
          <Icons.ChartBar size={24} color={colors.primary} />
          <Typography
            size={12}
            color={colors.primary}
            fontFamily={fonts.Poppins}
            style={styles.actionButtonText}
          >
            Statistik
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/wallet")}
        >
          <Icons.Wallet size={24} color={colors.primary} />
          <Typography
            size={12}
            color={colors.primary}
            fontFamily={fonts.Poppins}
            style={styles.actionButtonText}
          >
            Dompet
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientBackground: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  balanceSection: {
    marginBottom: verticalScale(15),
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: verticalScale(15),
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    marginTop: 5,
  },
  statIcon: {
    padding: verticalScale(8),
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
