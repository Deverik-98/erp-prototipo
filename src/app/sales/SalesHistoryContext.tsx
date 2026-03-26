import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { NewSaleInput, SaleRecord } from "./sales.types";

type SalesHistoryContextValue = {
  sales: SaleRecord[];
  registerSale: (input: NewSaleInput) => SaleRecord;
};

const SalesHistoryContext = createContext<SalesHistoryContextValue | null>(
  null
);

export function SalesHistoryProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const receiptSeqRef = useRef(1);

  const registerSale = useCallback((input: NewSaleInput): SaleRecord => {
    const receiptNumber = String(receiptSeqRef.current++).padStart(8, "0");
    const sale: SaleRecord = {
      ...input,
      id: `V-${Date.now()}`,
      issuedAt: Date.now(),
      receiptNumber,
    };
    setSales((prev) => [sale, ...prev]);
    return sale;
  }, []);

  const value = useMemo(
    () => ({ sales, registerSale }),
    [sales, registerSale]
  );

  return (
    <SalesHistoryContext.Provider value={value}>
      {children}
    </SalesHistoryContext.Provider>
  );
}

export function useSalesHistory() {
  const ctx = useContext(SalesHistoryContext);
  if (!ctx) {
    throw new Error("useSalesHistory debe usarse dentro de SalesHistoryProvider");
  }
  return ctx;
}
