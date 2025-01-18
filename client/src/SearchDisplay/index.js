import React, { useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

import { queriesSelector } from "../state/selectors";
import { SearchDisplayContainer, SFlex } from "../styles";
import { currency, currencyRounded, localDateString } from "../utilities";
import SearchGraph from "../SpendingDisplay/Graphs/SearchGraph";
import { TableContainer } from "../SpendingDisplay/SpendingDisplay.styles";
import SearchBarGraph from "../SpendingDisplay/Graphs/SearchBarGraph";

const defaultCutoffDate = "2018-1-1";
const SearchDisplay = () => {
  const [cutoffDate, setCutoffDate] = useState(new Date(defaultCutoffDate));
  const queries = useSelector(queriesSelector);
  const data = Object.values(queries).map((query) => {
    const trans = query.transactions.filter((t) => {
      return new Date(t.date) > cutoffDate;
    });
    const total = trans.reduce((acc, { amount }) => {
      acc += amount;
      return acc;
    }, 0);
    return {
      ...query,
      transactions: trans,
      totalLabel: currencyRounded(total),
      total: total / 100,
    };
  });

  return (
    <>
      <SearchDisplayContainer>
        <div>Search</div>
        <div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const newDate = event.target["cutoff-date"].value;
              setCutoffDate(new Date(newDate));
            }}
          >
            <label>Cutoff Date</label>
            <input name="cutoff-date" type="text" placeholder="Cutoff date" />
            <button type="button">Set</button>
          </form>
        </div>
        {!isEmpty(queries) && (
          <SFlex style={{ justifyContent: "space-between", flex: 1 }}>
            <SearchGraph queries={queries} data={data} />
            <SearchBarGraph data={data} />
          </SFlex>
        )}
        <SFlex style={{ gap: "20px", flex: 1, overflow: "hidden" }}>
          {Object.keys(queries)
            .sort()
            .map((key) => {
              return (
                <div key={key} style={{ overflow: "auto" }}>
                  <div>{key}</div>
                  <TableContainer style={{ fontSize: "12px" }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Payee</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queries[key].transactions?.map((trans, idx) => {
                        if (!(new Date(trans.date) > cutoffDate)) return;

                        return (
                          <tr key={`${key}-${idx}`}>
                            <td className="date">
                              {localDateString(new Date(trans.date))}
                            </td>
                            <td
                              className="description"
                              title={trans.description}
                            >
                              {trans.description}
                            </td>
                            <td className="amount">{currency(trans.amount)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </TableContainer>
                </div>
              );
            })}
        </SFlex>
      </SearchDisplayContainer>
    </>
  );
};

export default SearchDisplay;
