import React, { useEffect } from "react";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";

import SpendingDisplay from "./SpendingDisplay";
import Header from "./Header";

import { AppContainer } from "./styles";
import { useDispatch } from "react-redux";
import {
  fetchTransactions,
  searchTransactions,
} from "./state/TransactionsSlice";
import {
  ALL_TRANSACTIONS_ROUTE,
  CALENDAR_ROUTE,
  SEARCH_ROUTE,
  SPENDING_ROUTE,
} from "./utilities/routes";
import SearchDisplay from "./SearchDisplay";
import AllTransactions from "./AllTransactions";
import { getParams } from "./utilities";

function App() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  useEffect(() => {
    const query = getParams("query", searchParams);
    if (query) {
      query.forEach((q) => {
        dispatch(searchTransactions({ query: q }));
      });
    }
  }, [dispatch, searchParams]);

  return (
    <AppContainer>
      <Header />

      <Routes>
        <Route path={`/${SEARCH_ROUTE}`} element={<SearchDisplay />} />
        <Route path={`/${SPENDING_ROUTE}/*`} element={<SpendingDisplay />} />
        <Route
          path={`/${ALL_TRANSACTIONS_ROUTE}`}
          element={<AllTransactions />}
        />
        <Route
          path="/"
          element={
            <Navigate to={`/${SPENDING_ROUTE}/${CALENDAR_ROUTE}`} replace />
          }
        />
      </Routes>
    </AppContainer>
  );
}

export default App;
