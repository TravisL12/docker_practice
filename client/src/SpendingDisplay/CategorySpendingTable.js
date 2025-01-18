import React from "react";
import { keys } from "lodash";

import { currencyRounded } from "../utilities";
import { TableListContainer } from "./SpendingDisplay.styles.js";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedMonthTransactionsSelector,
  transactionsSelector,
} from "../state/selectors";
import { transactionsSlice } from "../state/TransactionsSlice";

const CategorySpendingTable = () => {
  const dispatch = useDispatch();
  const getMonthTransactions = useSelector(
    getSelectedMonthTransactionsSelector
  );
  const { categories } = useSelector(transactionsSelector);

  const categoryTotals = getMonthTransactions.reduce((acc, trans) => {
    acc[trans.category] = acc[trans.category] || 0;
    acc[trans.category] += trans.amount;
    return acc;
  }, {});

  const sortedCategories = keys(categoryTotals)
    .reduce(
      (acc, category) => [
        ...acc,
        { category, total: categoryTotals[category] },
      ],
      []
    )
    .sort((a, b) => (b.total > a.total ? 1 : -1)); // desc sort

  return (
    <TableListContainer>
      <div className="title">
        <h3>Category Totals</h3>
        <button
          className="category-toggle"
          onClick={() =>
            dispatch(transactionsSlice.actions.toggleAllCategories(true))
          }
        >
          On
        </button>
        <button
          className="category-toggle"
          onClick={() =>
            dispatch(transactionsSlice.actions.toggleAllCategories(false))
          }
        >
          Off
        </button>
      </div>
      {sortedCategories.map(({ category, total }) => (
        <div
          key={category}
          className={`month-items ${
            !categories[category]?.visible && "inactive"
          }`}
          style={{
            backgroundColor:
              categories[category]?.visible && categories[category]?.color,
          }}
          onClick={() =>
            dispatch(transactionsSlice.actions.toggleCategory(category))
          }
        >
          <div className="amount">{currencyRounded(total)}</div>
          <div className="description-category">
            <div className="description">{category}</div>
          </div>
        </div>
      ))}
    </TableListContainer>
  );
};

export default CategorySpendingTable;
