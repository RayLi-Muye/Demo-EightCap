import * as Haptics from "expo-haptics";
import { ArrowRightLeft, Minus, Plus, Wallet } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

import type { WalletAccount } from "@/data/portfolio";
import { colors, radius, shadows, spacing } from "@/design/theme";
import { depositWalletFunds, transferWalletFunds, withdrawWalletFunds } from "@/hooks/use-demo-portfolio";
import { formatCurrency } from "@/utils/format";

import { GlassSurface } from "./glass-surface";

type WalletFloatingActionsProps = {
  account: WalletAccount;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
};

function hapticTap() {
  Haptics.selectionAsync().catch(() => {});
}

const actions = [
  { id: "deposit", label: "Deposit", Icon: Plus },
  { id: "withdraw", label: "Withdrawal", Icon: Minus },
  { id: "transfer", label: "Transfer", Icon: ArrowRightLeft },
] as const;

type WalletActionId = (typeof actions)[number]["id"];

const currencySymbols: Record<string, string> = {
  AUD: "A$",
  GBP: "£",
  USD: "$",
};

const transferTargets: Record<string, string> = {
  AUD: "GBP",
  GBP: "USD",
  USD: "AUD",
};

function getCurrencySymbol(code: string) {
  return currencySymbols[code] ?? `${code} `;
}

function getOperationAmount(actionId: WalletActionId, account: WalletAccount) {
  switch (actionId) {
    case "deposit":
      return account.code === "USD" ? 500 : 250;
    case "transfer":
      return account.code === "USD" ? 250 : 100;
    case "withdraw":
      return account.code === "USD" ? 250 : 100;
  }
}

export function WalletFloatingActions({ account, expanded, onExpandedChange }: WalletFloatingActionsProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const tabWidth = Math.min(Math.max(width - 32, 0), 620);
  const isWide = width >= 768;
  const right = isWide ? (width - tabWidth) / 2 : spacing.lg;
  const bottom = 102 + insets.bottom;

  function toggleExpanded() {
    hapticTap();
    onExpandedChange(!expanded);
  }

  function handleAction(actionId: WalletActionId) {
    const amount = getOperationAmount(actionId, account);
    const symbol = getCurrencySymbol(account.code);

    if (actionId === "deposit") {
      const nextAccount = depositWalletFunds(account.code, amount);

      if (!nextAccount) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        setStatusMessage(`${account.code} deposit could not be processed`);
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setStatusMessage(`Deposited ${formatCurrency(amount, symbol)} to ${account.code}`);
      onExpandedChange(false);
      return;
    }

    if (actionId === "withdraw") {
      const nextAccount = withdrawWalletFunds(account.code, amount);

      if (!nextAccount) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
        setStatusMessage(`${account.code} needs ${formatCurrency(amount, symbol)} available to withdraw`);
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setStatusMessage(`Withdrew ${formatCurrency(amount, symbol)} from ${account.code}`);
      onExpandedChange(false);
      return;
    }

    const toCode = transferTargets[account.code] ?? "USD";
    const transfer = transferWalletFunds(account.code, toCode, amount);

    if (!transfer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      setStatusMessage(`${account.code} needs ${formatCurrency(amount, symbol)} available to transfer`);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setStatusMessage(`Transferred ${formatCurrency(amount, symbol)} from ${account.code} to ${toCode}`);
    onExpandedChange(false);
  }

  return (
    <View pointerEvents="box-none" style={{ alignItems: "flex-end", bottom, position: "absolute", right, zIndex: 30 }}>
      {!expanded && statusMessage ? (
        <Animated.View entering={FadeInUp.duration(180)} exiting={FadeOutDown.duration(140)} style={{ marginBottom: spacing.sm, maxWidth: 288 }}>
          <GlassSurface
            interactive
            style={{
              ...shadows.card,
              backgroundColor: "rgba(255,255,255,0.94)",
              borderColor: "rgba(255,255,255,0.96)",
              borderRadius: radius.full,
              borderWidth: 1,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
          >
            <Text selectable numberOfLines={2} style={{ color: colors.ink, fontSize: 12, fontWeight: "500", lineHeight: 17, textAlign: "center" }}>
              {statusMessage}
            </Text>
          </GlassSurface>
        </Animated.View>
      ) : null}

      {expanded ? (
        <Animated.View entering={FadeInUp.duration(180)} exiting={FadeOutDown.duration(140)} style={{ marginBottom: spacing.sm }}>
          <GlassSurface
            interactive
            style={{
              ...shadows.card,
              backgroundColor: "rgba(255,255,255,0.9)",
              borderColor: "rgba(255,255,255,0.96)",
              borderRadius: radius.lg,
              borderWidth: 1,
              gap: spacing.xs,
              padding: spacing.sm,
              width: 220,
            }}
          >
            {actions.map(({ Icon, id, label }) => (
              <Pressable
                accessibilityLabel={`${label} ${account.code}`}
                accessibilityRole="button"
                key={id}
                onPress={() => handleAction(id)}
                style={({ pressed }) => ({
                  alignItems: "center",
                  backgroundColor: colors.surface,
                  borderColor: colors.line,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  flexDirection: "row",
                  gap: spacing.md,
                  opacity: pressed ? 0.72 : 1,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                })}
              >
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: id === "deposit" ? colors.brandAction : colors.brandSoft,
                    borderRadius: radius.full,
                    height: 34,
                    justifyContent: "center",
                    width: 34,
                  }}
                >
                  <Icon color={id === "deposit" ? colors.inverse : colors.brandAction} size={18} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ color: colors.ink, fontSize: 15, fontWeight: "600" }}>{label}</Text>
                </View>
              </Pressable>
            ))}
          </GlassSurface>
        </Animated.View>
      ) : null}

      <Pressable
        accessibilityLabel={`Open ${account.code} wallet actions`}
        accessibilityRole="button"
        onPress={toggleExpanded}
        style={({ pressed }) => ({
          ...shadows.card,
          alignItems: "center",
          backgroundColor: colors.brandAction,
          borderRadius: radius.full,
          height: 58,
          justifyContent: "center",
          opacity: pressed ? 0.72 : 1,
          width: 58,
        })}
      >
        <Wallet color={colors.inverse} size={25} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}
