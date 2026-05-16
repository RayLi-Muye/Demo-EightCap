export type EquityAsset = {
  symbol: string;
  name: string;
  assetClass?: "stock" | "crypto";
  price: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  logoLabel: string;
  logoBackground: string;
  logoColor: string;
  sparkline: number[];
};

export type HomeChartRange = "hourly" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
export type InstrumentChartRange = "1D" | "1W" | "1M" | "3M" | "1Y";

export type AssetMetrics = {
  peRatio: number | null;
  marketCap: number | null;
  week52High: number;
  week52Low: number;
  averageVolume: number | null;
  yieldPercent: number | null;
  beta: number | null;
  eps: number | null;
};

export type Holding = EquityAsset & {
  dateLabel: string;
  pnl: number;
  value: number;
  units: number;
};

export type WalletAccount = {
  code: string;
  name: string;
  balance: number;
  available: number;
  accent: string;
};

export const homeCurve = [38, 41, 45, 52, 56, 57, 57, 57, 56.5, 58, 58.4, 55.2, 56.8, 56.8, 56.9, 58.1, 58.9, 59.3, 57.6, 59.7, 59.7, 59.8, 61.1, 60.8, 61.4, 63.6, 63.2, 63.2, 63.2, 62.4];

export const homeRangeDeltas: Record<HomeChartRange, number[]> = {
  hourly: [-8.42, -7.9, -8.1, -6.3, -5.8, -6.6, -4.2, -3.9, -3.1, -2.8, -1.7, -2.4, -1.2, -0.8, -0.2, 0],
  daily: [11.97, 10.4, 8.9, 9.8, 7.3, 6.2, 4.8, 6.5, 3.9, 2.2, 4.5, 1.6, 0.8, -1.4, 0.6, -2.1, -3.7, -2.8, -5.4, -4.1, -6.8, -5.7, -8.5, -7.2, -9.9, -8.6, -6.4, -4.2, -2.8, 0],
  weekly: [324.8, 286.6, 301.2, 248.3, 221.7, 238.9, 180.4, 154.2, 171.8, 122.6, 96.4, 114.1, 62.8, 38.5, 55.2, 21.7, -12.4, 8.8, -38.1, -64.7, -42.5, -88.2, -112.8, -76.4, -104.9, -52.3, -31.6, -18.2, -7.4, 0],
  monthly: [-852.3, -816.4, -774.8, -792.6, -708.2, -662.9, -686.1, -604.5, -551.8, -579.4, -493.3, -462.8, -398.5, -426.2, -341.4, -302.9, -328.7, -242.5, -198.6, -217.4, -132.8, -96.4, -118.7, -54.2, -28.9, -42.1, -18.6, -7.4, -3.2, 0],
  quarterly: [-1618.4, -1542.7, -1488.2, -1514.9, -1396.4, -1328.5, -1262.3, -1299.1, -1164.8, -1086.2, -1018.9, -1048.7, -914.6, -846.4, -785.2, -812.5, -676.8, -604.4, -532.9, -564.3, -418.7, -346.2, -289.8, -318.6, -204.1, -142.9, -88.6, -112.4, -36.8, 0],
  yearly: [-3892.7, -3718.4, -3544.6, -3628.9, -3284.3, -3076.8, -2898.2, -3022.6, -2644.4, -2386.7, -2168.8, -2278.1, -1874.6, -1612.5, -1438.9, -1517.3, -1116.8, -846.2, -704.7, -792.1, -518.4, -348.6, -402.8, -218.6, -118.2, -156.4, -68.8, -92.1, -24.6, 0],
};

export const instrumentRangeProfiles: Record<InstrumentChartRange, { crypto: number[]; stock: number[] }> = {
  "1D": {
    stock: [-0.34, -0.22, -0.27, -0.08, 0.04, -0.05, 0.12, 0.18, 0.09, 0.22, 0.28, 0.2, 0.31, 0.36, 0.3, 0.38],
    crypto: [-1.15, -0.82, -1.02, -0.36, 0.18, -0.08, 0.42, 0.68, 0.36, 0.92, 1.08, 0.84, 1.24, 1.36, 1.12, 1.48],
  },
  "1W": {
    stock: [1.92, 1.72, 1.46, 1.58, 1.12, 0.94, 1.08, 0.62, 0.38, 0.52, 0.18, -0.08, 0.12, -0.22, -0.08, 0],
    crypto: [3.62, 3.18, 2.74, 3.05, 2.18, 1.66, 1.94, 0.88, 0.22, 0.68, -0.18, -0.96, -0.36, -1.28, -0.62, 0],
  },
  "1M": {
    stock: [-4.2, -3.86, -3.42, -3.6, -2.92, -2.48, -2.66, -1.92, -1.42, -1.58, -0.84, -0.36, -0.52, 0.18, 0.42, 0],
    crypto: [-11.4, -10.2, -8.8, -9.6, -7.2, -5.8, -6.5, -4.1, -2.6, -3.2, -1.1, 0.2, -0.4, 1.8, 2.7, 3.4],
  },
  "3M": {
    stock: [-8.5, -7.9, -7.2, -7.55, -6.4, -5.62, -5.92, -4.68, -3.8, -4.16, -2.84, -1.96, -2.28, -0.94, -0.42, 0],
    crypto: [-24.2, -22.1, -19.8, -21.3, -16.9, -14.2, -15.8, -10.6, -7.4, -8.9, -4.1, -1.2, -2.5, 2.8, 5.1, 6.2],
  },
  "1Y": {
    stock: [-18.6, -17.1, -15.8, -16.4, -13.2, -11.4, -12.1, -8.8, -6.2, -7.3, -3.8, -1.6, -2.4, 0.8, 1.9, 2.6],
    crypto: [-58.4, -52.8, -48.1, -51.6, -40.2, -34.8, -37.4, -24.6, -16.2, -19.8, -8.4, -1.6, -4.2, 8.8, 14.2, 18.6],
  },
};

export const marketIndexes = [
  { symbol: "SPX500", value: 7456.91, changePercent: 0.07 },
  { symbol: "NAS100", value: 21482.37, changePercent: 0.18 },
  { symbol: "BTC", value: 79623.15, changePercent: 0.36 },
  { symbol: "DJ30", value: 49798.55, changePercent: 0.01 },
  { symbol: "SHCOMP", value: 3418.42, changePercent: -0.12 },
  { symbol: "HK50", value: 19724.83, changePercent: 0.22 },
  { symbol: "GER40", value: 18642.51, changePercent: -0.04 },
  { symbol: "FTSE100", value: 8264.17, changePercent: 0.09 },
  { symbol: "XAUUSD", value: 2341.62, changePercent: -0.16 },
];

export const movers = [
  {
    symbol: "FLR",
    name: "Fluor Corp",
    value: 1.18,
    logoLabel: "F",
    logoBackground: "#ef2f7b",
    logoColor: "#ffffff",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    value: 1.1,
    logoLabel: "N",
    logoBackground: "#b7ef00",
    logoColor: "#ffffff",
  },
  {
    symbol: "CASH",
    name: "USD idle",
    value: 0.42,
    logoLabel: "$",
    logoBackground: "#eff2f7",
    logoColor: "#98a2b3",
  },
];

export const watchlistAssets: EquityAsset[] = [
  {
    symbol: "SNDK",
    name: "Sandisk",
    price: 1446.81,
    change: -4.8,
    changePercent: -0.33,
    bid: 1446.52,
    ask: 1447,
    logoLabel: "S",
    logoBackground: "#ffffff",
    logoColor: "#f04438",
    sparkline: [52, 51.2, 51.5, 50.8, 50.1, 50.6, 49.9, 49.2],
  },
  {
    symbol: "ORCL",
    name: "Oracle",
    price: 190.31,
    change: 0.49,
    changePercent: 0.26,
    bid: 190.25,
    ask: 190.38,
    logoLabel: "ORCL",
    logoBackground: "#f22f2b",
    logoColor: "#ffffff",
    sparkline: [31, 31.2, 31.6, 31.5, 31.9, 32.1, 32.4, 32.3],
  },
  {
    symbol: "INTC",
    name: "Intel",
    price: 119.34,
    change: -0.98,
    changePercent: -0.81,
    bid: 119.31,
    ask: 119.37,
    logoLabel: "intel",
    logoBackground: "#2b82c9",
    logoColor: "#ffffff",
    sparkline: [24, 23.8, 23.1, 23.4, 22.8, 22.3, 22.5, 21.9],
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 616.99,
    change: 40.04,
    changePercent: 6.94,
    bid: 616.91,
    ask: 617.07,
    logoLabel: "M",
    logoBackground: "#ffffff",
    logoColor: "#2674d9",
    sparkline: [42, 42.8, 43.6, 44.9, 46.2, 47.7, 49.6, 51.9],
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    price: 446.19,
    change: 0.54,
    changePercent: 0.12,
    bid: 446.04,
    ask: 446.34,
    logoLabel: "AMD",
    logoBackground: "#303236",
    logoColor: "#ffffff",
    sparkline: [33, 33.4, 33.1, 33.6, 33.5, 33.7, 33.9, 34],
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: 403.88,
    change: -1.38,
    changePercent: -0.34,
    bid: 403.83,
    ask: 403.92,
    logoLabel: "MS",
    logoBackground: "#ffffff",
    logoColor: "#f5a623",
    sparkline: [44, 43.9, 43.5, 43.8, 43.2, 42.9, 43, 42.6],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    price: 228.34,
    change: 25.34,
    changePercent: 12.48,
    bid: 228.31,
    ask: 228.34,
    logoLabel: "N",
    logoBackground: "#b7ef00",
    logoColor: "#ffffff",
    sparkline: [28, 28.9, 30.4, 31.8, 33.7, 35.1, 37.8, 40.6],
  },
  {
    symbol: "FLR",
    name: "Fluor Corp",
    price: 0.0087,
    change: 0.0001,
    changePercent: 1.18,
    bid: 0.0086,
    ask: 0.0087,
    logoLabel: "F",
    logoBackground: "#ef2f7b",
    logoColor: "#ffffff",
    sparkline: [8, 8.1, 8.3, 8.2, 8.5, 8.8, 8.7, 9.1],
  },
  {
    symbol: "NFLX",
    name: "Netflix",
    assetClass: "stock",
    price: 1092.42,
    change: -140.84,
    changePercent: -11.42,
    bid: 1092.18,
    ask: 1092.66,
    logoLabel: "N",
    logoBackground: "#111827",
    logoColor: "#e50914",
    sparkline: [72, 70.4, 68.9, 67.1, 65.6, 63.2, 61.8, 59.4],
  },
  {
    symbol: "SOL",
    name: "Solana",
    assetClass: "crypto",
    price: 178.24,
    change: 23.01,
    changePercent: 14.82,
    bid: 178.18,
    ask: 178.31,
    logoLabel: "SOL",
    logoBackground: "#171923",
    logoColor: "#14f195",
    sparkline: [148, 151.8, 156.4, 160.2, 165.9, 164.8, 169.6, 174.4, 176.8, 181.1, 184.4, 188.9],
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    assetClass: "crypto",
    price: 79623.15,
    change: 286.73,
    changePercent: 0.36,
    bid: 79614.2,
    ask: 79632.1,
    logoLabel: "₿",
    logoBackground: "#f7931a",
    logoColor: "#ffffff",
    sparkline: [74, 74.4, 73.9, 74.8, 75.1, 75.6, 75.2, 76.3, 76.8, 77.1, 77.4, 77.2],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    assetClass: "crypto",
    price: 4198.42,
    change: -18.36,
    changePercent: -0.44,
    bid: 4197.9,
    ask: 4199.05,
    logoLabel: "ETH",
    logoBackground: "#627eea",
    logoColor: "#ffffff",
    sparkline: [58, 57.7, 57.9, 57.4, 57.1, 56.8, 56.9, 56.4, 56.1, 56.3, 55.9, 56],
  },
];

export const holdings: Holding[] = [
  {
    ...watchlistAssets[5],
    dateLabel: "24/5",
    pnl: -2809.35,
    value: 9208.46,
    units: 22.8,
  },
  {
    symbol: "AAPL",
    name: "Apple",
    price: 298.68,
    change: -0.18,
    changePercent: -0.06,
    bid: 298.62,
    ask: 298.74,
    dateLabel: "24/5",
    logoLabel: "A",
    logoBackground: "#667085",
    logoColor: "#ffffff",
    pnl: 391.58,
    value: 1463.53,
    units: 4.9,
    sparkline: [42, 42.2, 41.9, 41.7, 41.6, 41.8, 41.5, 41.4],
  },
  {
    symbol: "TTWO",
    name: "Take-Two",
    price: 227.33,
    change: 0.34,
    changePercent: 0.15,
    bid: 227.29,
    ask: 227.38,
    dateLabel: "24/5",
    logoLabel: "T2",
    logoBackground: "#ffffff",
    logoColor: "#111827",
    pnl: -247.93,
    value: 4614.8,
    units: 20.3,
    sparkline: [21, 21.2, 21.1, 21.4, 21.3, 21.5, 21.7, 21.8],
  },
  {
    symbol: "GOOG",
    name: "Alphabet",
    price: 400.1,
    change: 1.08,
    changePercent: 0.27,
    bid: 400.02,
    ask: 400.17,
    dateLabel: "24/5",
    logoLabel: "G",
    logoBackground: "#3aa0ff",
    logoColor: "#ffffff",
    pnl: 663.22,
    value: 3120.78,
    units: 7.8,
    sparkline: [31, 31.2, 31.1, 31.5, 31.8, 32, 32.2, 32.4],
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    price: 446.59,
    change: 1.34,
    changePercent: 0.3,
    bid: 446.49,
    ask: 446.68,
    dateLabel: "24/5",
    logoLabel: "TESLA",
    logoBackground: "#ff2839",
    logoColor: "#ffffff",
    pnl: 31.23,
    value: 1116.48,
    units: 2.5,
    sparkline: [46, 46.2, 46.1, 46.5, 46.7, 47.1, 47.2, 47.5],
  },
];

export const walletAccounts: WalletAccount[] = [
  {
    code: "USD",
    name: "USD Account",
    balance: 3660.39,
    available: 3660.39,
    accent: "#05b83f",
  },
  {
    code: "AUD",
    name: "AUD Account",
    balance: 0,
    available: 0,
    accent: "#0f4a73",
  },
  {
    code: "GBP",
    name: "GBP Account",
    balance: 0,
    available: 0,
    accent: "#243b70",
  },
];

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

const availableCash = roundCurrency(walletAccounts.reduce((total, account) => total + account.available, 0));
const investmentValue = roundCurrency(holdings.reduce((total, holding) => total + holding.value, 0));
const totalValue = roundCurrency(availableCash + investmentValue);
const totalChange = -11.97;

export const accountSummary = {
  totalValue,
  totalChange,
  totalChangePercent: roundCurrency((totalChange / totalValue) * 100),
  lastUpdated: "10:31, 14/05/2026",
  availableCash,
  buyingPower: roundCurrency(availableCash * 2),
  investmentValue,
};

export const assetMetrics: Record<string, AssetMetrics> = {
  AAPL: {
    peRatio: 30.8,
    marketCap: 4_560_000_000_000,
    week52High: 312.4,
    week52Low: 186.1,
    averageVolume: 61_400_000,
    yieldPercent: 0.48,
    beta: 1.18,
    eps: 9.69,
  },
  AMD: {
    peRatio: 52.6,
    marketCap: 722_000_000_000,
    week52High: 468.2,
    week52Low: 142.6,
    averageVolume: 48_800_000,
    yieldPercent: null,
    beta: 1.74,
    eps: 8.49,
  },
  BTC: {
    peRatio: null,
    marketCap: 1_570_000_000_000,
    week52High: 83542.2,
    week52Low: 52210.4,
    averageVolume: 38_200_000_000,
    yieldPercent: null,
    beta: null,
    eps: null,
  },
  ETH: {
    peRatio: null,
    marketCap: 505_000_000_000,
    week52High: 4878.6,
    week52Low: 2862.1,
    averageVolume: 18_700_000_000,
    yieldPercent: null,
    beta: null,
    eps: null,
  },
  FLR: {
    peRatio: 19.4,
    marketCap: 3_160_000_000,
    week52High: 0.0124,
    week52Low: 0.0058,
    averageVolume: 8_900_000,
    yieldPercent: 1.12,
    beta: 1.41,
    eps: 0.0004,
  },
  GOOG: {
    peRatio: 28.2,
    marketCap: 4_910_000_000_000,
    week52High: 421.3,
    week52Low: 248.7,
    averageVolume: 24_600_000,
    yieldPercent: null,
    beta: 1.05,
    eps: 14.19,
  },
  INTC: {
    peRatio: 34.9,
    marketCap: 514_000_000_000,
    week52High: 132.4,
    week52Low: 68.8,
    averageVolume: 52_100_000,
    yieldPercent: 0.89,
    beta: 1.22,
    eps: 3.42,
  },
  META: {
    peRatio: 27.4,
    marketCap: 1_580_000_000_000,
    week52High: 642.8,
    week52Low: 423.6,
    averageVolume: 15_300_000,
    yieldPercent: 0.31,
    beta: 1.16,
    eps: 22.52,
  },
  MSFT: {
    peRatio: 35.7,
    marketCap: 3_000_000_000_000,
    week52High: 468.9,
    week52Low: 354.2,
    averageVolume: 21_800_000,
    yieldPercent: 0.75,
    beta: 0.91,
    eps: 11.31,
  },
  NFLX: {
    peRatio: 47.8,
    marketCap: 472_000_000_000,
    week52High: 1178.5,
    week52Low: 612.8,
    averageVolume: 4_900_000,
    yieldPercent: null,
    beta: 1.29,
    eps: 22.85,
  },
  NVDA: {
    peRatio: 42.9,
    marketCap: 5_610_000_000_000,
    week52High: 238.4,
    week52Low: 96.1,
    averageVolume: 216_000_000,
    yieldPercent: 0.03,
    beta: 1.96,
    eps: 5.32,
  },
  ORCL: {
    peRatio: 29.1,
    marketCap: 532_000_000_000,
    week52High: 204.8,
    week52Low: 112.4,
    averageVolume: 10_700_000,
    yieldPercent: 0.84,
    beta: 1.02,
    eps: 6.54,
  },
  SNDK: {
    peRatio: 24.6,
    marketCap: 48_300_000_000,
    week52High: 1532.2,
    week52Low: 934.6,
    averageVolume: 2_400_000,
    yieldPercent: null,
    beta: 1.38,
    eps: 58.81,
  },
  SOL: {
    peRatio: null,
    marketCap: 83_800_000_000,
    week52High: 212.8,
    week52Low: 93.4,
    averageVolume: 4_200_000_000,
    yieldPercent: null,
    beta: null,
    eps: null,
  },
  TSLA: {
    peRatio: 118.5,
    marketCap: 1_420_000_000_000,
    week52High: 488.7,
    week52Low: 178.3,
    averageVolume: 88_200_000,
    yieldPercent: null,
    beta: 2.08,
    eps: 3.77,
  },
  TTWO: {
    peRatio: 39.3,
    marketCap: 39_700_000_000,
    week52High: 241.6,
    week52Low: 144.9,
    averageVolume: 1_700_000,
    yieldPercent: null,
    beta: 0.74,
    eps: 5.79,
  },
};

export function getAssetMetrics(symbol: string) {
  return assetMetrics[symbol.toUpperCase()];
}

export function getInstrumentSymbols() {
  const symbols = new Set<string>();

  for (const asset of [...watchlistAssets, ...holdings]) {
    symbols.add(asset.symbol.toUpperCase());
  }

  return Array.from(symbols);
}

export function getAssetBySymbol(symbol: string) {
  return [...watchlistAssets, ...holdings].find((asset) => asset.symbol.toLowerCase() === symbol.toLowerCase());
}
