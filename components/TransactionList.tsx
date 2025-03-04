import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import { colors, radius, spacingX, spacingY } from "@/constants/Colors";
import { verticalScale } from "@/utils/style";
import Typography from "./Typography";
import { FlashList } from "@shopify/flash-list";
import Loading from "./Loading";
import { expenseCategories, incomeCategory } from "@/constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "expo-router";
import { toRupiah } from "@/utils/common";
import { fonts } from "@/constants/Fonts";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const router = useRouter();

  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/transaction_modal",
      params: {
        id: item.id,
        type: item.type,
        amount: item.amount.toString(),
        category: item.category,
        date: (item.date as Timestamp).toDate().toISOString(),
        description: item.description,
        image: item.image,
        uid: item.uid,
        walletId: item.walletId,
      },
    });
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typography
          size={20}
          fontFamily={fonts.Poppins}
          color={colors.neutral800}
        >
          {title}
        </Typography>
      )}

      <View style={styles.list}>
        <FlashList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />
      </View>

      {!loading && data.length == 0 && (
        <Typography
          size={15}
          color={colors.neutral600}
          style={{
            textAlign: "center",
            marginTop: spacingY._50,
          }}
        >
          {emptyListMessage}
        </Typography>
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category =
    item.type == "income" ? incomeCategory : expenseCategories[item.category!];
  const IconComponent = category.icon;

  const date = (item.date as Timestamp).toDate().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.primary}
            />
          )}
        </View>

        <View style={styles.categoryDes}>
          <Typography
            size={17}
            color={colors.neutral900}
            fontFamily={fonts.PoppinsMedium}
            textProps={{ numberOfLines: 1 }}
          >
            {category.label === "Income" ? "Pemasukan" : category.label}
          </Typography>
          <Typography
            size={14}
            color={colors.neutral500}
            textProps={{ numberOfLines: 1 }}
          >
            {item.description || "No description."}
          </Typography>
        </View>

        <View style={styles.amountDate}>
          <Typography
            fontFamily={fonts.Poppins}
            color={item.type == "income" ? colors.green : colors.rose}
          >
            {`${item.type == "income" ? "+ " : "- "}${toRupiah(item.amount)}`}
          </Typography>
          <Typography size={12} color={colors.neutral500}>
            {date}
          </Typography>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  list: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    // backgroundColor: colors.neutral200,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3,
  },
});
