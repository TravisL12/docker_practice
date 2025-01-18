import React from "react";
import { keys } from "lodash";

import { currencyRounded, localDateString } from "./utilities";
import {
  SidebarContainer,
  SidebarYear,
  SidebarMonth,
  QueryIndicators,
} from "./MonthSidebar.styles";
import { useDispatch, useSelector } from "react-redux";
import {
  getMonthTransactionsSelector,
  transactionsSelector,
  getQueriesSelector,
} from "./state/selectors";
import { transactionsSlice } from "./state/TransactionsSlice";

const MonthSidebar = () => {
  const dispatch = useDispatch();
  const { spendingData, queries, selectedMonth } =
    useSelector(transactionsSelector);
  const getMonthTransactions = useSelector(getMonthTransactionsSelector);
  const getQueryData = useSelector(getQueriesSelector);

  const updateSelectedMonth = (params) => {
    dispatch(transactionsSlice.actions.setSelectedMonth(params));
  };

  const availableDates = keys(spendingData).reduce((acc, year) => {
    return acc.concat(
      keys(spendingData[year]).map((month) => ({ year: +year, month: +month }))
    );
  }, []);

  const selectedIndex = availableDates.findIndex(
    ({ year, month }) =>
      year === selectedMonth.year && month === selectedMonth.month
  );

  const handleKeyUp = (event) => {
    event.preventDefault(); // stops keyboard scrolling

    if (selectedMonth) {
      let nextIndex;
      switch (event.key) {
        case "ArrowUp":
          nextIndex = selectedIndex + 1;
          break;
        case "ArrowDown":
          nextIndex = selectedIndex - 1;
          break;
        default:
      }

      if (availableDates[nextIndex]) {
        updateSelectedMonth({
          month: availableDates[nextIndex].month,
          year: availableDates[nextIndex].year,
        });
      }
    }
  };

  const monthTotal = ({ year, month }) => {
    return getMonthTransactions({ year, month })?.reduce((acc, trans) => {
      acc += trans.amount;
      return acc;
    }, 0);
  };

  return (
    <SidebarContainer tabIndex={"0"} onKeyDown={handleKeyUp}>
      {keys(spendingData)
        .reverse()
        .map((year) => {
          const months = spendingData[year];

          return (
            <SidebarYear key={year}>
              <div>{year}</div>
              {keys(months)
                .reverse()
                .map((month) => {
                  const prettyDate = localDateString(new Date(year, month), {
                    month: "long",
                  });
                  const isMonthSelected =
                    selectedMonth?.month === +month &&
                    selectedMonth?.year === +year;

                  return (
                    <SidebarMonth
                      key={`${year}-${month}`}
                      isSelected={isMonthSelected}
                      onClick={() =>
                        updateSelectedMonth({ year: +year, month: +month })
                      }
                    >
                      <span>{prettyDate}</span>
                      <span className="month-total">
                        {currencyRounded(monthTotal({ year, month }))}
                      </span>
                      <QueryIndicators>
                        {keys(queries).map(
                          (query) =>
                            getQueryData({ query, year, month }) && (
                              <div
                                key={query}
                                className="indicator"
                                style={{
                                  background: queries[query].color,
                                }}
                              ></div>
                            )
                        )}
                      </QueryIndicators>
                    </SidebarMonth>
                  );
                })}
            </SidebarYear>
          );
        })}
    </SidebarContainer>
  );
};

export default MonthSidebar;
