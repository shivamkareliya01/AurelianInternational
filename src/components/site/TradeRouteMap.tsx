// src/components/site/TradeRouteMap.tsx
// Unified Trade Route Map Component delegating to WorldMap with live script
import React, { useEffect } from "react";
import { WorldMap } from "./WorldMap";

declare global {
  interface Window {
    __tradeMapLive?: {
      destroy: () => void;
      reinit: () => void;
      config: any;
    };
  }
}

export function TradeRouteMap() {
  useEffect(() => {
    // Dynamically load trade-map-live on the Markets page only
    import("@/lib/trade-map-live").then(() => {
      if (typeof window !== "undefined" && window.__tradeMapLive) {
        window.__tradeMapLive.reinit();
      }
    });

    return () => {
      if (typeof window !== "undefined" && window.__tradeMapLive) {
        window.__tradeMapLive.destroy();
      }
    };
  }, []);

  return <WorldMap isMarketsLive />;
}

export default TradeRouteMap;
