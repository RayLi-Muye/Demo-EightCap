import { Text, View } from "react-native";

import type { WalletAccount } from "@/data/portfolio";
import { colors, radius, spacing } from "@/design/theme";
import type { DemoAccountSummary } from "@/hooks/use-demo-portfolio";
import { formatCurrency } from "@/utils/format";

type AccountSummaryCardProps = {
  accounts: WalletAccount[];
  summary: DemoAccountSummary;
  selectedAccountCode: string;
};

const currencySymbols: Record<string, string> = {
  AUD: "A$",
  GBP: "£",
  USD: "$",
};

function getCurrencySymbol(code: string) {
  return currencySymbols[code] ?? `${code} `;
}

export function AccountSummaryCard({ accounts, summary, selectedAccountCode }: AccountSummaryCardProps) {
  const selectedAccount = accounts.find((account) => account.code === selectedAccountCode) ?? accounts[0];
  const totalCash = accounts.reduce((sum, account) => sum + account.balance, 0);
  const selectedShare = totalCash > 0 ? Math.round((selectedAccount.balance / totalCash) * 100) : 0;

  return (
    <View style={{ gap: spacing.lg, paddingBottom: spacing.sm, paddingTop: spacing.xs }}>
      <View style={{ gap: spacing.sm }}>
        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: spacing.md }}>
          <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
            <Text selectable numberOfLines={1} style={{ color: colors.ink, fontSize: 22, fontWeight: "500" }}>
              {selectedAccount.name}
            </Text>
          </View>
        </View>

        <Text
          selectable
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ color: colors.ink, fontSize: 42, fontVariant: ["tabular-nums"], fontWeight: "600", letterSpacing: 0 }}
        >
          {formatCurrency(selectedAccount.balance, getCurrencySymbol(selectedAccount.code))}
        </Text>
        <Text selectable style={{ color: colors.muted, fontSize: 14, fontVariant: ["tabular-nums"], fontWeight: "500" }}>
          Available {formatCurrency(selectedAccount.available, getCurrencySymbol(selectedAccount.code))} · Portfolio {formatCurrency(summary.totalValue)}
        </Text>
      </View>

      <View style={{ gap: spacing.md }}>
        <View style={{ backgroundColor: "rgba(5,184,63,0.14)", borderRadius: radius.full, height: 12, overflow: "hidden" }}>
          <View style={{ backgroundColor: colors.brandAction, borderRadius: radius.full, height: "100%", width: `${selectedShare}%` }} />
        </View>

        <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.md }}>
          <View style={{ backgroundColor: colors.brandAction, borderRadius: radius.full, height: 28, width: 3 }} />
          <Text selectable style={{ color: colors.ink, fontSize: 24, fontVariant: ["tabular-nums"], fontWeight: "500" }}>
            {selectedShare}%
          </Text>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text selectable style={{ color: colors.ink, fontSize: 16, fontWeight: "500" }}>
              Cash allocation
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
