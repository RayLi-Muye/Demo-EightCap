# Interview Polish Roadmap

This roadmap tracks the remaining work needed to make the EightCap prototype presentation-ready for an interview review link.

## Current Recommendation

Use Manrope for web display headings and keep native platforms on system fallback unless local font files are added. Manrope gives the app a more editorial financial-product feel without making the interface look decorative. It is now wired through the shared page title style and loaded in the static web HTML.

## Heading Font Options

| Option | Best Use | Tradeoff |
| --- | --- | --- |
| Manrope | Primary recommendation for page titles and section headers | Polished, neutral, slightly premium; needs web font loading or bundled files for native parity |
| Geist | Strong fallback for a modern tech/product feel | More developer-product than trading app; useful if the UI moves toward Vercel-style sharpness |
| Satoshi | Strong display look for portfolio and discover headings | More distinctive, but needs bundled font files for reliable licensing and deployment |
| Inter | Safest all-purpose option | Very readable, but less differentiated |
| Avenir Next | Good iOS-native feel | Less predictable across Android and web unless carefully configured |

## Next Implementation Passes

1. **Title System**
   - Replace remaining major one-off heading styles with shared typography tokens.
   - Keep page titles black, lighter than the old `900` weight, and avoid decorative letter spacing.
   - Audit mobile widths so long titles do not collide with header/search actions.

2. **Discover Depth**
   - Keep Top Movers in realistic high-volatility ranges where appropriate.
   - Add stronger differentiation between article cards and market cards.
   - Consider article filtering by Markets, Business, Digital Assets, and Strategy.

3. **Trade Flow**
   - First pass complete: the Instrument Detail Trade panel now supports Buy/Sell, Market/Limit, quantity stepping, estimated value, available cash, and confirmation feedback.
   - Sell stays disabled when the asset is not held.
   - Buy/Sell now updates the demo USD wallet balance as well as portfolio positions.

4. **Wallet Operations**
   - First pass complete: Deposit, Withdraw, Transfer, and Fund actions now update the demo wallet state instead of acting as placeholders.
   - Deposit/Fund increase the selected currency account, Withdraw decreases it when funds are available, and Transfer moves a fixed demo amount from the selected account to the next currency account.
   - Remaining improvement: replace fixed demo amounts with a small amount-entry sheet if the presentation needs a deeper wallet flow.

5. **Market Data Consistency**
   - Continue growing `npm run check:market-data` to cover Discover movers, Watch List rows, Portfolio holdings, chart direction, and account totals.
   - Keep Home Cash and Holding equal to Wallet cash plus Portfolio investment value.

6. **Vercel Delivery**
   - Use `npm run export:web` as the Vercel build command and `dist` as the output directory.
   - Verify `/`, `/discover`, `/portfolio`, `/watchlist`, `/wallet`, and several `/instrument/:symbol` routes after deployment.
   - Final email should link to the deployed app and describe it as an interactive EightCap-inspired market and portfolio prototype by Ray Li.

## Current Verification Gates

```bash
npm run typecheck
npm run check:market-data
npm run export:web
npm run verify:web-demo
```

`verify:web-demo` serves the static `dist` output locally, opens headless Chrome, and checks the interview-critical path: launch splash, Home, Discover, Wallet operations, Trade buy/sell constraints, Portfolio, Watch List, and Wallet return.
