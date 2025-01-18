import React from "react";
import styled from "styled-components";

import Day from "./Day";
import { daysOfWeek } from "../utilities";
import { useSelector } from "react-redux";
import {
  getDayTransactionsSelector,
  transactionsSelector,
} from "../state/selectors";

const dayGridWidth = "120px";
const dayGridHeight = "110px";
export const DayNames = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 6px 0;

  span {
    width: ${dayGridWidth};
    text-align: center;
    font-size: 12px;
  }
`;

const StyledCalendar = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-columns: repeat(7, ${dayGridWidth});
  grid-template-rows: repeat(6, ${dayGridHeight});
`;

const Calendar = ({ days, selectedDay, setSelectedDay }) => {
  const { queries, selectedMonth } = useSelector(transactionsSelector);
  const transactions = useSelector(getDayTransactionsSelector);
  const { year, month } = selectedMonth;
  const date = new Date(year, month);

  return (
    <div>
      <DayNames>
        {daysOfWeek.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </DayNames>
      <StyledCalendar>
        {days.map((dayNumber, idx) => {
          return (
            <Day
              key={idx}
              dayTransactions={transactions[dayNumber]}
              queries={queries}
              dayNumber={dayNumber}
              startDow={date.getDay()}
              setSelectedDay={setSelectedDay}
              isViewed={selectedDay === dayNumber}
            />
          );
        })}
      </StyledCalendar>
    </div>
  );
};

export default Calendar;
