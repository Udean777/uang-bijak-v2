import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useAuth } from "@/context/authContext";
import Typography from "@/components/Typography";
import { colors, spacingX, spacingY } from "@/constants/Colors";
import { verticalScale } from "@/utils/style";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getGreeting } from "@/utils/common";
import { fonts } from "@/constants/Fonts";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
import TransactionList from "@/components/TransactionList";
import { useRouter } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

  const {
    data: recentTransactions,
    error,
    isLoading,
  } = useFetchData<TransactionType>("transactions", constraints);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typography size={16} color={colors.neutral800}>
              {getGreeting()},
            </Typography>

            <Typography
              fontFamily={fonts.PoppinsBold}
              size={20}
              fontWeight={"500"}
              color={colors.neutral800}
            >
              {user?.username}
            </Typography>
          </View>

          <TouchableOpacity style={styles.searchIcon}>
            <Icons.MagnifyingGlass
              size={verticalScale(22)}
              color={colors.white}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <HomeCard />

          <TransactionList
            title="Transaksi Terbaru"
            data={recentTransactions}
            loading={isLoading}
            emptyListMessage="Belum ada transaksi yang dibuat!"
          />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral400,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
