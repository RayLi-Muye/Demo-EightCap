const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src/data/portfolio.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const sandbox = { console, exports: {}, require };

vm.runInNewContext(output, sandbox, { filename: sourcePath });

const { accountSummary, holdings, walletAccounts, watchlistAssets } = sandbox.exports;
const errors = [];

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function expectClose(label, actual, expected, tolerance = 0.01) {
  if (Math.abs(actual - expected) > tolerance) {
    errors.push(`${label}: expected ${expected.toFixed(2)}, got ${actual.toFixed(2)}`);
  }
}

function direction(value) {
  return value > 0 ? 1 : value < 0 ? -1 : 0;
}

const availableCash = roundCurrency(walletAccounts.reduce((total, account) => total + account.available, 0));
const investmentValue = roundCurrency(holdings.reduce((total, holding) => total + holding.value, 0));
const totalValue = roundCurrency(availableCash + investmentValue);

expectClose("accountSummary.availableCash", accountSummary.availableCash, availableCash);
expectClose("accountSummary.investmentValue", accountSummary.investmentValue, investmentValue);
expectClose("accountSummary.totalValue", accountSummary.totalValue, totalValue);
expectClose("accountSummary.buyingPower", accountSummary.buyingPower, roundCurrency(availableCash * 2));

for (const holding of holdings) {
  expectClose(`${holding.symbol}.value`, holding.value, roundCurrency(holding.price * holding.units), 0.02);
}

const assetsBySymbol = new Map();
for (const asset of [...watchlistAssets, ...holdings]) {
  assetsBySymbol.set(asset.symbol, asset);
}

for (const asset of assetsBySymbol.values()) {
  if (asset.bid > asset.ask) {
    errors.push(`${asset.symbol}.bidAsk: bid ${asset.bid} is greater than ask ${asset.ask}`);
  }

  const previousPrice = asset.price - asset.change;
  if (previousPrice > 0) {
    const computedPercent = (asset.change / previousPrice) * 100;
    expectClose(`${asset.symbol}.changePercent`, asset.changePercent, computedPercent, 0.08);
  }

  const firstPoint = asset.sparkline[0];
  const lastPoint = asset.sparkline[asset.sparkline.length - 1];
  const sparkDirection = direction(lastPoint - firstPoint);
  const changeDirection = direction(asset.changePercent);

  if (sparkDirection !== 0 && changeDirection !== 0 && sparkDirection !== changeDirection) {
    errors.push(`${asset.symbol}.sparkline: sparkline direction does not match changePercent`);
  }
}

if (errors.length > 0) {
  console.error("Market data consistency check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Market data consistency check passed.");
