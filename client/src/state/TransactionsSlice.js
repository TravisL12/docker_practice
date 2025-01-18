import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { keys, last } from "lodash";
import { findColor, splitDate, generateDatesObject } from "../utilities";
import { getData, searchData } from "../utilities/apiRequests";
import { colors } from "../utilities/colors";

export const fetchTransactions = createAsyncThunk(
  "fetchTransactions",
  async (_, { dispatch }) => {
    const data = await getData();
    dispatch(
      transactionsSlice.actions.updateSpendingData({
        data,
      })
    );
  }
);

export const searchTransactions = createAsyncThunk(
  "searchTransactions",
  async ({ query }, { dispatch }) => {
    const data = await searchData(query);
    dispatch(
      transactionsSlice.actions.updateSpendingData({
        data,
        query,
      })
    );
  }
);

export const transactionsSlice = createSlice({
  name: "transactionsSlice",
  initialState: {
    spendingData: null,
    selectedMonth: null,
    queries: {},
    categories: {},
    transactions: [],
  },
  reducers: {
    deleteQuery: (state, action) => {
      const query = action.payload;
      const queriesTemp = { ...state.queries };
      if (queriesTemp[query]) {
        delete queriesTemp[query];
      }

      state.queries = queriesTemp;
    },
    toggleCategory: (state, action) => {
      const category = action.payload;
      state.categories[category].visible = !state.categories[category].visible;
    },
    toggleAllCategories: (state, action) => {
      const isOn = action.payload;
      keys(state.categories).forEach((name) => {
        state.categories[name].visible = isOn;
      });
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    updateSpendingData: (state, action) => {
      const { data, query } = action.payload;
      const spending = { ...state.spendingData };
      const categories = { ...state.categories };
      const queries = { ...state.queries };
      const ids = state.transactions.map(({ id }) => id);

      for (let i = 0; i < data.length; i++) {
        const trans = data[i];
        const dates = splitDate(trans.date);
        const { day, month, year } = dates;

        if (!ids.includes(trans.id)) {
          state.transactions.push(trans);

          if (!categories[trans.category]) {
            categories[trans.category] = {
              visible: true,
              color: colors[keys(categories).length],
              subcategories: {},
            };
          }

          if (!categories[trans.category].subcategories[trans.subcategory]) {
            categories[trans.category].subcategories[trans.subcategory] = {
              visible: true,
            };
          }
          generateDatesObject(spending, year, month, day);
          spending[year][month][day].transactions.push(trans);
        }

        if (query) {
          if (!queries[query]) {
            queries[query] = {
              query,
              visible: true,
              dates: {},
              color: findColor(queries),
              transactions: [],
            };
          }

          const queryIds = queries[query].transactions.map(({ id }) => id);
          if (!queryIds.includes(trans.id)) {
            generateDatesObject(queries[query].dates, year, month, day);
            queries[query].dates[year][month][day].transactions.push(trans);
            queries[query].transactions.push(trans);
          }
        }
      }

      if (!state.selectedMonth) {
        const firstYear = last(Object.keys(spending));
        const firstMonth = last(Object.keys(spending[firstYear]));
        state.selectedMonth = {
          month: +firstMonth,
          year: +firstYear,
        };
      }

      state.queries = queries;
      state.categories = categories;
      state.spendingData = spending;
    },
  },
});
