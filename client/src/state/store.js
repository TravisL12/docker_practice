import { configureStore } from "@reduxjs/toolkit";
import { transactionsSlice } from "./TransactionsSlice";

export const store = configureStore({
  reducer: { transactions: transactionsSlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
