import {
  localDateString,
  currencyRounded,
  createElement,
  splitDate,
  sum,
} from "./utilities.js";
const calendars = document.querySelector(".calendars");

function buildDay(dayData = [], dayValue, startDow) {
  const dayEl = createElement("div", { classList: "day" });
  if (dayValue - 1 === 0) {
    dayEl.style["gridColumnStart"] = startDow + 1;
  }

  const amount = dayData ? sum(dayData) : 0;

  let totalEl = amount
    ? `<div class="total">${currencyRounded(amount)}</div>`
    : "";
  if (dayData) {
    const queries = dayData.reduce((acc, transaction) => {
      if (!transaction.query) return acc;

      if (!acc[transaction.query]) {
        acc[transaction.query] = {
          transactions: [],
          total: 0,
          color: transaction.color,
        };
      }

      acc[transaction.query].transactions.push(transaction);
      acc[transaction.query].total += +transaction.amount;

      return acc;
    }, {});

    if (Object.keys(queries).length > 0) {
      totalEl = "";
      Object.keys(queries).forEach((query) => {
        const { color, total, transactions } = queries[query];
        totalEl += `
          <li><span style="background: ${color};" class="query-accent"></span>${query} - ${currencyRounded(
          total
        )} (${transactions.length})</li>`;
      });
      totalEl = `<ul class="query-list">${totalEl}</ul>`;
    }
  }

  dayEl.innerHTML = `
    <div class="date">${dayValue}</div>
    ${totalEl}
    `;
  return dayEl;
}

function buildMonth(data) {
  const date = new Date(data.year, data.month);
  const startDow = date.getDay();
  const dayCount = new Date(data.year, data.month + 1, 0).getDate();
  const days = Array.from({ length: dayCount }, (v, k) => k + 1);
  const prettyMonth = localDateString(date, {
    month: "long",
  });

  const monthWrapperEl = createElement("div", {
    classList: `month-wrapper ${prettyMonth.toLowerCase()}`,
  });

  const monthEl = createElement("div", {
    classList: "month",
  });

  const titleEl = createElement("div", {
    classList: "month-title",
    textContent: `${prettyMonth} ${data.year}`,
  });

  for (let i = 0; i < days.length; i++) {
    const dayValue = days[i];
    const dayData = data.days[dayValue];
    const dayEl = buildDay(dayData, dayValue, startDow);
    monthEl.appendChild(dayEl);
  }

  monthWrapperEl.appendChild(titleEl);
  monthWrapperEl.appendChild(monthEl);
  calendars.appendChild(monthWrapperEl);
}

export function buildCalendarData(data) {
  calendars.innerHTML = "";
  const dates = {};
  data.forEach((trans) => {
    const { day, month, year } = splitDate(trans.date);
    dates[year] = dates[year] || {};
    dates[year][month] = dates[year][month] || {};
    dates[year][month][day] = dates[year][month][day] || [];
    dates[year][month][day].push(trans);
  });
  console.log(dates);

  const calendarMap = Object.keys(dates).reduce((acc, year) => {
    const yearData = dates[year];
    const monthsData = Object.keys(yearData).map((month) => {
      return { year: +year, month: +month, days: yearData[month] };
    });
    return acc.concat(monthsData);
  }, []);

  for (let i = 0; i < calendarMap.length; i++) {
    buildMonth(calendarMap[i]);
  }
}
