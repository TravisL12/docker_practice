import React, { useState } from "react";

import Graphs from "./Graphs";
import QuerySpendingTable from "./QuerySpendingTable";
import CategorySpendingTable from "./CategorySpendingTable";
import { buildNumberArray, localDateString } from "../utilities/index.js";
import Calendar from "./Calendar";
import MonthSpendingTable from "./MonthSpendingTable";

import { MonthWrapper, DisplayContainer } from "./SpendingDisplay.styles.js";
import { useSelector } from "react-redux";
import {
  getSelectedMonthTransactionsSelector,
  selectedMonthSelector,
} from "../state/selectors";
import { Routes, Route } from "react-router-dom";
import { CALENDAR_ROUTE, GRAPHS_ROUTE } from "../utilities/routes";
import { SpendingDisplayContainer } from "../styles";
import MonthSidebar from "../MonthSidebar";

const SpendingDisplay = () => {
  const [selectedDay, setSelectedDay] = useState();
  const getMonthTransactions = useSelector(
    getSelectedMonthTransactionsSelector
  );
  const selectedMonth = useSelector(selectedMonthSelector);

  if (!selectedMonth) {
    return null;
  }

  const { year, month } = selectedMonth;

  const date = new Date(year, month);
  const days = buildNumberArray(new Date(year, month + 1, 0).getDate());
  const prettyMonth = localDateString(date, {
    month: "long",
  });

  return (
    <>
      <MonthSidebar />
      <SpendingDisplayContainer>
        <MonthWrapper>
          <div className="month-options">
            <div className="title">{`${prettyMonth} ${year}`}</div>
          </div>

          <DisplayContainer>
            <Routes>
              <Route
                path={CALENDAR_ROUTE}
                element={
                  <Calendar
                    days={days}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                  />
                }
              />
              <Route
                path={GRAPHS_ROUTE}
                element={<Graphs chartData={getMonthTransactions} />}
              />
            </Routes>
          </DisplayContainer>

          <div className="monthly-item-tables">
            <div className="item-tables">
              <CategorySpendingTable />
              <QuerySpendingTable />
            </div>
            <MonthSpendingTable selectedDay={selectedDay} />
          </div>
        </MonthWrapper>
      </SpendingDisplayContainer>
    </>
  );
};

export default SpendingDisplay;
