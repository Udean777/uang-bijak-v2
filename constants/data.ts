import { CategoryType, ExpenseCategoriesType } from "@/types";
import * as Icons from "phosphor-react-native"; // Import all icons dynamically
import { colors } from "./Colors";

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Belanja",
    value: "groceries",
    icon: Icons.ShoppingCart,
    bgColor: colors.primary + "30",
  },
  rent: {
    label: "Sewa",
    value: "rent",
    icon: Icons.House,
    bgColor: colors.primary + "30",
  },
  utilities: {
    label: "Tagihan",
    value: "utilities",
    icon: Icons.Lightbulb,
    bgColor: colors.primary + "30",
  },
  transportation: {
    label: "Transportasi",
    value: "transportation",
    icon: Icons.Car,
    bgColor: colors.primary + "30",
  },
  entertainment: {
    label: "Hiburan",
    value: "entertainment",
    icon: Icons.FilmStrip,
    bgColor: colors.primary + "30",
  },
  dining: {
    label: "Makan & Minum",
    value: "dining",
    icon: Icons.ForkKnife,
    bgColor: colors.primary + "30",
  },
  health: {
    label: "Kesehatan",
    value: "health",
    icon: Icons.Heart,
    bgColor: colors.primary + "30",
  },
  insurance: {
    label: "Asuransi",
    value: "insurance",
    icon: Icons.ShieldCheck,
    bgColor: colors.primary + "30",
  },
  savings: {
    label: "Tabungan",
    value: "savings",
    icon: Icons.PiggyBank,
    bgColor: colors.primary + "30",
  },
  clothing: {
    label: "Pakaian",
    value: "clothing",
    icon: Icons.TShirt,
    bgColor: colors.primary + "30",
  },
  personal: {
    label: "Pribadi",
    value: "personal",
    icon: Icons.User,
    bgColor: colors.primary + "30",
  },
  others: {
    label: "Lainnya",
    value: "others",
    icon: Icons.DotsThreeOutline,
    bgColor: colors.primary + "30",
  },
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icons.CurrencyDollarSimple,
  bgColor: colors.primary + "30",
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];
