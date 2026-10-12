import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Item = { key: string; name: string; category: string };
type Ctx = {
  items: Item[];
  add: (i: Item) => void;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
};

const BasketContext = createContext<Ctx | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("enquiry-basket");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("enquiry-basket", JSON.stringify(items));
  }, [items]);

  const value: Ctx = {
    items,
    add: (i) => setItems((s) => (s.some((x) => x.key === i.key) ? s : [...s, i])),
    remove: (key) => setItems((s) => s.filter((x) => x.key !== key)),
    clear: () => setItems([]),
    has: (key) => items.some((x) => x.key === key),
  };
  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const c = useContext(BasketContext);
  if (!c) throw new Error("useBasket must be used within BasketProvider");
  return c;
}
