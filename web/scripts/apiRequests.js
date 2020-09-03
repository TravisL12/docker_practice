import { buildTable } from "./table.js";
import { buildCalendarData } from "./calendars.js";

export async function getData(query = "") {
  await fetch(`http://0.0.0.0:5005/?likeQuery=${query}`)
    .then((resp) => resp.json())
    .then(({ data }) => {
      // buildTable([...data]);
      buildCalendarData(data);
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
