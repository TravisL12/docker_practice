import React from "react";
import { keys, isEmpty } from "lodash";

import { currencyRounded } from "../utilities/index.js";
import DayPieChart from "./Graphs/DayPieChart.js";
import { DayContainer, DayHeader } from "./Day.styles";
import { useSelector } from "react-redux";
import { getQueriesSelector } from "../state/selectors.js";

export default function Day({
  queries,
  dayTransactions = [],
  dayNumber,
  startDow,
  setSelectedDay,
  isViewed,
}) {
  const getQueryData = useSelector(getQueriesSelector);
  const amount = dayTransactions.reduce((total, d) => total + d.amount, 0);

  const buildQueryItems = () => (
    <ul className="query-list">
      {keys(queries).map((query, idx) => {
        const queryTransactions = getQueryData({
          query,
          day: dayNumber,
        });

        if (isEmpty(queryTransactions)) {
          return null;
        }

        return (
          <li
            key={idx}
            className="query-items"
            style={{ background: queries[query].color }}
          ></li>
        );
      })}
    </ul>
  );

  const isFirstDay = dayNumber - 1 === 0;

  return (
    <DayContainer
      isViewed={isViewed}
      firstDay={isFirstDay}
      startDay={isFirstDay ? startDow + 1 : null}
      onClick={() => {
        if (dayTransactions) setSelectedDay(dayNumber);
      }}
    >
      {buildQueryItems()}
      <DayHeader>
        <div className="date">{dayNumber}</div>
        <div className="total">{currencyRounded(amount)}</div>
      </DayHeader>
      <div style={{ flex: 1 }}>
        <DayPieChart
          data={dayTransactions}
          dayNumber={dayNumber}
          total={amount}
        />
      </div>
    </DayContainer>
  );
}
