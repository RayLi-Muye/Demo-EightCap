import { useEffect, useMemo, useRef, useState } from "react";

import type { EquityAsset, Holding } from "@/data/portfolio";

export type PricePulse = {
  direction: "up" | "down";
  sequence: number;
};

type IndexQuote = {
  symbol: string;
  value: number;
  changePercent: number;
};

type LiveAssetsState<T extends EquityAsset> = {
  assets: T[];
  pulses: Record<string, PricePulse>;
  sourceKey: string;
};

function nudge(symbol: string, tick: number, scale: number) {
  const seed = [...symbol].reduce((total, char) => total + char.charCodeAt(0), 0);
  return Math.sin((tick + seed) * 1.37) * scale;
}

function pickIndexes(length: number, count: number, tick: number) {
  return Array.from({ length: Math.min(count, length) }, (_, index) => (tick * 2 + index * 3) % length);
}

function getAssetsKey(assets: EquityAsset[]) {
  return assets
    .map((asset) =>
      [
        asset.symbol,
        asset.price,
        asset.bid,
        asset.ask,
        asset.change,
        asset.changePercent,
        asset.sparkline.join(","),
      ].join(":"),
    )
    .join("|");
}

export function useLiveAssets<T extends EquityAsset>(
  sourceAssets: T[],
  options: { count?: number; intervalMs?: number; scale?: number } = {},
) {
  const { count = 2, intervalMs = 2200, scale = 0.0018 } = options;
  const sourceKey = useMemo(() => getAssetsKey(sourceAssets), [sourceAssets]);
  const sourceAssetsRef = useRef(sourceAssets);
  const sourceKeyRef = useRef(sourceKey);
  const [liveState, setLiveState] = useState<LiveAssetsState<T>>(() => ({
    assets: sourceAssets,
    pulses: {},
    sourceKey,
  }));
  const tickRef = useRef(0);
  const sequenceRef = useRef(0);

  useEffect(() => {
    sourceAssetsRef.current = sourceAssets;
    sourceKeyRef.current = sourceKey;
  }, [sourceAssets, sourceKey]);

  useEffect(() => {
    const timer = setInterval(() => {
      tickRef.current += 1;
      const activeSourceAssets = sourceAssetsRef.current;
      const activeSourceKey = sourceKeyRef.current;
      const activeIndexes = new Set(pickIndexes(activeSourceAssets.length, count, tickRef.current));

      setLiveState((currentState) => {
        const currentAssets = currentState.sourceKey === activeSourceKey ? currentState.assets : activeSourceAssets;
        const nextPulses = currentState.sourceKey === activeSourceKey ? { ...currentState.pulses } : {};
        const nextAssets = currentAssets.map((asset, index) => {
          if (!activeIndexes.has(index)) {
            return asset;
          }

          const delta = nudge(asset.symbol, tickRef.current, Math.max(asset.price * scale, asset.price < 1 ? 0.0001 : 0.03));
          const nextPrice = Math.max(asset.price + delta, asset.price < 1 ? 0.0001 : 0.01);
          const nextChange = asset.change + delta;
          const nextChangePercent = asset.changePercent + (delta / Math.max(asset.price, 0.01)) * 100;
          const direction = delta >= 0 ? "up" : "down";
          sequenceRef.current += 1;
          nextPulses[asset.symbol] = { direction, sequence: sequenceRef.current };

          return {
            ...asset,
            ask: nextPrice + Math.max(asset.ask - asset.price, 0.01),
            bid: Math.max(nextPrice - Math.max(asset.price - asset.bid, 0.01), 0.0001),
            change: nextChange,
            changePercent: nextChangePercent,
            price: nextPrice,
            sparkline: [...asset.sparkline.slice(1), asset.sparkline[asset.sparkline.length - 1] + delta],
          };
        });

        return {
          assets: nextAssets,
          pulses: nextPulses,
          sourceKey: activeSourceKey,
        };
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [count, intervalMs, scale]);

  if (liveState.sourceKey !== sourceKey) {
    return { assets: sourceAssets, pulses: {} };
  }

  return { assets: liveState.assets, pulses: liveState.pulses };
}

export function useLiveHoldings(sourceHoldings: Holding[]) {
  const { assets, pulses } = useLiveAssets(sourceHoldings, { count: 2, intervalMs: 4200, scale: 0.0012 });

  const holdings = useMemo(
    () =>
      assets.map((holding) => {
        const source = sourceHoldings.find((item) => item.symbol === holding.symbol) ?? holding;
        const priceDelta = holding.price - source.price;
        return {
          ...holding,
          pnl: source.pnl + priceDelta * source.units,
          value: source.value + priceDelta * source.units,
        };
      }),
    [assets, sourceHoldings],
  );

  return { holdings, pulses };
}

export function useLiveIndexes(sourceIndexes: IndexQuote[]) {
  const [indexes, setIndexes] = useState(sourceIndexes);
  const tickRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      tickRef.current += 1;
      setIndexes((currentIndexes) =>
        currentIndexes.map((index, itemIndex) => {
          const delta = nudge(index.symbol, tickRef.current + itemIndex, Math.max(index.value * 0.00008, 0.01));
          return {
            ...index,
            changePercent: index.changePercent + (delta / index.value) * 100,
            value: Math.max(index.value + delta, 0.01),
          };
        }),
      );
    }, 2600);

    return () => clearInterval(timer);
  }, []);

  return indexes;
}
