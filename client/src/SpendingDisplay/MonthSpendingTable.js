import React, { useEffect } from "react";
import { sumBy, startCase, camelCase } from "lodash";

import { splitDate, localDateString, currency } from "../utilities";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  getSelectedMonthTransactionsSelector,
} from "../state/selectors";
import {
  MonthlySpendingContainer,
  TableContainer,
} from "./SpendingDisplay.styles";

const MonthSpendingTable = ({ selectedDay }) => {
  const transactions = useSelector(getSelectedMonthTransactionsSelector);
  const categories = useSelector(categoriesSelector);
  const total = sumBy(transactions, "amount");

  const scrollToRefs = Array.from({ length: transactions.length }, () =>
    React.createRef()
  );

  useEffect(() => {
    const id = transactions.findIndex((trans) => {
      const date = splitDate(trans.date);
      return selectedDay === date.day;
    });

    if (id > -1) {
      scrollToRefs[id].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedDay, scrollToRefs, transactions]);

  return (
    <MonthlySpendingContainer>
      <TableContainer>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trans, idx) => {
            const date = splitDate(trans.date);

            return (
              <tr
                key={`${trans.description}-${idx}`}
                className={selectedDay === date.day ? "isViewed" : ""}
                ref={scrollToRefs[idx]}
              >
                <td className="date">{localDateString(date.date)}</td>
                <td className="description">
                  {startCase(camelCase(trans.payee || trans.description))}
                </td>
                <td
                  className="category"
                  style={{
                    backgroundColor: categories[trans.category].color,
                  }}
                >
                  {trans.category}
                </td>
                <td className="amount">{currency(trans.amount)}</td>
              </tr>
            );
          })}
          <tr className="total-row">
            <td colSpan="4" className="total">
              <strong>{currency(total)}</strong>
            </td>
          </tr>
        </tbody>
      </TableContainer>
    </MonthlySpendingContainer>
  );
};

export default MonthSpendingTable;
