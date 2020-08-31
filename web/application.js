const csvForm = document.getElementById("csv-input");
const searchForm = document.getElementById("search-form");
const fileInput = document.getElementById("file-input");
const table = document.getElementById("data-table");

const buildData = (row, header) => {
  return header.reduce((acc, colName, idx) => {
    acc[colName.trim()] = row[idx].trim();
    return acc;
  }, {});
};

let data;
fileInput.addEventListener("change", (event) => {
  event.preventDefault();
  const files = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(files);
  reader.onload = function (e) {
    const rows = e.target.result.split("\n");
    const header = rows[0].split(",");
    data = rows.slice(1).map((row) => {
      return buildData(row.split(","), header);
    });
  };
});

csvForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const step = 100;
  for (let i = 0; i < data.length / step; i++) {
    const min = i * step;
    const max = i * step + step;
    postData(data.slice(min, max));
  }
});

function postData(rows) {
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

function buildRow(values, isHeader = false) {
  const row = document.createElement("tr");
  values.forEach((value) => {
    const col = document.createElement(isHeader ? "th" : "td");
    col.textContent = value;
    row.appendChild(col);
  });

  return row;
}

function buildTable(data = []) {
  if (data.length === 0) return;

  const headerRow = table.querySelector("thead tr");
  if (!headerRow) {
    const row = buildRow(Object.keys(data[0]), true);
    table.querySelector("thead").appendChild(row);
  }

  data.splice(1).forEach((row) => {
    const el = buildRow(Object.values(row));
    table.querySelector("tbody").appendChild(el);
  });
}

async function getData(query = "") {
  await fetch(`http://0.0.0.0:5005/?likeQuery=${query}`)
    .then((resp) => resp.json())
    .then(({ data }) => {
      buildTable(data);
    });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchForm.querySelector("input").value;
  getData(query);
});
