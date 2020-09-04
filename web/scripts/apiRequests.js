import { buildTable } from "./table.js";
import { buildCalendarData } from "./calendars.js";

const colors = [
  "hsl(120, 50%, 80%)",
  "hsl(10, 38%, 80%)",
  "hsl(175, 75%, 80%)",
  "hsl(61, 60%, 80%)",
  "hsl(278, 32%, 80%)",
  "hsl(51, 34%, 80%)",
];
const searches = {};

export async function getData(query = "") {
  await fetch(`http://0.0.0.0:5005/?likeQuery=${query}`)
    .then((resp) => resp.json())
    .then(({ data }) => {
      // buildTable([...data]);
      if (query) {
        searches[query] = data.map((d) => ({
          ...d,
          query,
          color: colors[Object.keys(searches).length],
        }));
        buildCalendarData(Object.values(searches).flat());
      } else {
        buildCalendarData(data);
      }
    });
}

export function postData(rows) {
  return fetch("http://0.0.0.0:5005/seed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rows),
  })
    .then((resp) => resp.json())
    .then(({ data }) => {
      console.log(data, "from the server");
    });
}
