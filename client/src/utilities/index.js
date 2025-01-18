import { colors } from "./colors";

export const getParams = (keyName, searchParams) => {
  const queriesParams = [];
  searchParams.forEach(function (value, key) {
    if (key === keyName) {
      queriesParams.push(value);
    }
  });
  return queriesParams;
};

export const generateDatesObject = (item, year, month, day) => {
  // year
  if (!item[year]) {
    item[year] = {};
  }

  // month
  if (!item[year][month]) {
    item[year][month] = {};
  }

  // day
  if (!item[year][month][day]) {
    item[year][month][day] = {
      transactions: [],
    };
  }
};

export const findColor = (queries) => {
  const currentColors = Object.keys(queries).map(
    (query) => queries[query].color
  );
  return colors.find((color) => !currentColors.includes(color));
};

export function buildNumberArray(num) {
  return [...Array(num).keys()].map((x) => x + 1);
}

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

export function localDateString(date, options = {}) {
  options.timeZone = "UTC";
  return date.toLocaleDateString("en-US", options);
}

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

export const buildData = (row, header) => {
  return header.reduce((acc, colName, idx) => {
    if (!row[idx]) return acc;
    const headerName = colName === "Master Category" ? "Category" : colName;
    acc[headerName.toLowerCase().trim()] = row[idx].trim();
    return acc;
  }, {});
};
