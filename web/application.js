const csvForm = document.getElementById("csv-input");
const fileInput = document.getElementById("file-input");

const buildData = (row, header) => {
  return header.reduce((acc, colName, idx) => {
    acc[colName] = row[idx];
    return acc;
  }, {});
};

let files;
fileInput.addEventListener("change", (event) => {
  event.preventDefault();
  files = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(files);
  reader.onload = function (e) {
    const rows = e.target.result.split("\n");
    const header = rows[0].split(",");
    const data = rows.slice(rows.length - 100).map((row) => {
      return buildData(row.split(","), header);
    });
    console.log(data);
  };
});

csvForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const body = new FormData();
  body.append("file", files);
  for (let value of body.values()) {
    console.log(value);
  }
  // fetchData(body);
});

function fetchData(data) {
  fetch("http://0.0.0.0:5005/seed", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: data,
  })
    .then((resp) => resp.json())
    .then(({ data }) => {
      console.log(data, "from the server");
    });
}
