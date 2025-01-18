import React from "react";
import { keys } from "lodash";
import { currency } from "../utilities/index.js";
import { TableListContainer } from "./SpendingDisplay.styles.js";
import { useSelector } from "react-redux";
import { getQueriesSelector, queriesSelector } from "../state/selectors.js";

const QuerySpendingTable = () => {
  const queries = useSelector(queriesSelector);
  const getQueriesTransactions = useSelector(getQueriesSelector);

  return (
    <TableListContainer>
      <h3 className="title">Search Totals</h3>
      {keys(queries).map((query, idx) => {
        const queryAmount = getQueriesTransactions({ query })?.reduce(
          (total, d) => total + d.amount,
          0
        );

        return (
          queryAmount > 0 && (
            <div
              key={idx}
              className="month-items"
              style={{ background: queries[query].color }}
            >
              <div className="amount">{currency(queryAmount)}</div>
              <div className="description-category">
                <div className="description">{query}</div>
              </div>
            </div>
          )
        );
      })}
    </TableListContainer>
  );
};

export default QuerySpendingTable;
