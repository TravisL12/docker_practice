export function currency(amount, options = {}) {
  const localeOptions = Object.assign(
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    },
    options
  );

  const localeAmount = options.rounded
    ? Math.round(amount / 100)
    : amount / 100;
  return localeAmount.toLocaleString("en-US", localeOptions);
}

export function currencyRounded(amount) {
  return currency(amount, {
    minimumFractionDigits: 0,
    rounded: true,
  });
}

export function localDateString(date, options) {
  options.timeZone = "UTC";
  return date.toLocaleDateString("en-US", options);
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const createElement = (tag, options) => {
  const el = document.createElement(tag);
  el.classList = options.classList;
  el.textContent = options.textContent;
  return el;
};

export const splitDate = (date) => {
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

export function sum(data) {
  return data.reduce((total, d) => {
    return total + d.amount;
  }, 0);
}

export const weekDaysEl = daysOfWeek.map((day) =>
  createElement("div", { classList: "day-name", textContent: day })
);
