import { currency } from './utilities.js';

function buildHeaderRow(values) {
  const row = document.createElement('tr');
  values.forEach((value) => {
    const col = document.createElement('th');
    col.textContent = value;
    row.appendChild(col);
  });

  return row;
}

function buildRow(values, headers) {
  const row = document.createElement('tr');
  headers.forEach((header) => {
    const col = document.createElement('td');
    col.textContent =
      header === 'amount' ? currency(values[header]) : values[header];
    row.appendChild(col);
  });
  return row;
}

export function buildTable(data = []) {
  if (data.length === 0) return;

  const table = document.getElementById('data-table');
  const thead = table.querySelector('thead');
  thead.innerHTML = '';
  const headers = Object.keys(data[0]);
  const headerRow = buildHeaderRow(headers);
  thead.appendChild(headerRow);

  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  data.splice(1).forEach((row) => {
    const el = buildRow(row, headers);
    tbody.appendChild(el);
  });
}
