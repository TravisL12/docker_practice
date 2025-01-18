import { createSelector } from "@reduxjs/toolkit";
import { get, keys } from "lodash";

const stateData = (state) => state;

export const transactionsSelector = createSelector(
  stateData,
  (data) => data.transactions
);

export const allTransactionsDataSelector = createSelector(
  transactionsSelector,
  (transactions) => {
    const t = [...transactions?.transactions];
    return t.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
);

export const spendingDataSelector = createSelector(
  transactionsSelector,
  (transactions) => transactions.spendingData
);

export const selectedMonthSelector = createSelector(
  transactionsSelector,
  (transactions) => transactions.selectedMonth
);

export const categoriesSelector = createSelector(
  transactionsSelector,
  (transactions) => transactions.categories
);

export const queriesSelector = createSelector(
  transactionsSelector,
  (transactions) => transactions.queries
);

export const getSelectedMonthTransactionsSelector = createSelector(
  spendingDataSelector,
  selectedMonthSelector,
  (spendingData, selectedMonth) => {
    if (!selectedMonth) return [];
    const trans = spendingData[selectedMonth.year][selectedMonth.month];
    return keys(trans)
      .map((day) => trans[day].transactions)
      .flat();
  }
);

export const getDayTransactionsSelector = createSelector(
  spendingDataSelector,
  selectedMonthSelector,
  categoriesSelector,
  (spendingData, selectedMonth, categories) => {
    const trans = spendingData[selectedMonth.year][selectedMonth.month];
    return keys(trans).reduce((acc, day) => {
      acc[day] = trans[day].transactions.filter(
        (t) => categories[t.category].visible
      );
      return acc;
    }, {});
  }
);

export const getMonthTransactionsSelector = createSelector(
  spendingDataSelector,
  categoriesSelector,
  (spendingData, categories) => {
    return ({ month, year }) => {
      const trans = spendingData[year][month];
      return keys(trans)
        .map((day) => trans[day].transactions)
        .flat()
        .filter((t) => categories[t.category].visible);
    };
  }
);

export const getQueriesSelector = createSelector(
  transactionsSelector,
  selectedMonthSelector,
  (data, selectedMonth) => {
    return ({
      query,
      month = selectedMonth.month,
      year = selectedMonth.year,
      day = null,
    }) => {
      const { queries } = data;
      const getPath = [query, `dates`, year, month];
      if (day) getPath.push(day);
      const trans = get(queries, getPath);

      return !!trans
        ? keys(trans)
            .map((day) => trans[day].transactions)
            .flat()
        : null;
    };
  }
);
