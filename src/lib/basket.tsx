import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type BasketItem = {
  key: string;
  name: string;
  category: string;
  origin?: string;
  image?: string;
};

type Ctx = {
  items: BasketItem[];
  add: (i: BasketItem) => void;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
  isOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
  toggleBasket: () => void;
};

const BasketContext = createContext<Ctx | null>(null);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("enquiry-basket");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Ignore corrupted localStorage data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("enquiry-basket", JSON.stringify(items));
  }, [items]);

  const value: Ctx = {
    items,
    isOpen,
    openBasket: () => setIsOpen(true),
    closeBasket: () => setIsOpen(false),
    toggleBasket: () => setIsOpen((o) => !o),
    add: (i) => {
      setItems((s) => (s.some((x) => x.key === i.key) ? s : [...s, i]));
      setIsOpen(true);
    },
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
