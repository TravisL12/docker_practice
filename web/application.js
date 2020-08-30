const csvForm = document.getElementById("csv-input");
const fileInput = document.getElementById("file-input");

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

async function getData() {
  await fetch("http://0.0.0.0:5005/")
    .then((resp) => resp.json())
    .then(({ data }) => {
      console.log(data, "from the server");
    });
}

getData();
