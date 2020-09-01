function buildRow(values, isHeader = false) {
  const row = document.createElement("tr");
  values.forEach((value) => {
    const col = document.createElement(isHeader ? "th" : "td");
    col.textContent = value;
    row.appendChild(col);
  });

  return row;
}

export function buildTable(data = []) {
  if (data.length === 0) return;

  const table = document.getElementById("data-table");
  const thead = table.querySelector("thead");
  thead.innerHTML = "";
  const row = buildRow(Object.keys(data[0]), true);
  thead.appendChild(row);

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  data.splice(1).forEach((row) => {
    const el = buildRow(Object.values(row));
    tbody.appendChild(el);
  });
}
