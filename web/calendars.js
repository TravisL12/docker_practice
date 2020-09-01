const splitDate = (date) => {
  date = new Date(date.replace("Z", ""));
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return {
    date: new Date(year, month, day),
    day,
    month,
    year,
  };
};

function sum(data) {
  return data.reduce((total, d) => {
    return total + d.amount;
  }, 0);
}

const calendars = document.querySelector(".calendars");
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

function buildMonth(data) {
  const startDow = new Date(data.year, data.month, 1).getDay();
  const dayCount = new Date(data.year, data.month + 1, 0).getDate();
  const days = Array.from({ length: dayCount }, (v, k) => k + 1);
  const monthEl = document.createElement("div");
  monthEl.classList = "month";

  for (let i = 0; i < days.length; i++) {
    const dayValue = days[i];
    const dayData = data.days[dayValue];
    const dayEl = document.createElement("div");
    dayEl.classList = "day";
    dayEl.innerHTML = `
        <div>${+data.month + 1}-${dayValue}-${data.year}</div>
        <div>${dayData ? sum(dayData) / 100 : 0}</div>`;
    if (i === 0) {
      dayEl.style["gridColumnStart"] = startDow + 1;
    }
    monthEl.appendChild(dayEl);
  }
  calendars.appendChild(monthEl);
}
