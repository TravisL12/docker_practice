import { getData, postData } from './apiRequests.js';

const buildData = (row, header) => {
  return header.reduce((acc, colName, idx) => {
    if (!row[idx]) return acc;
    const headerName = colName === 'Master Category' ? 'Category' : colName;
    acc[headerName.toLowerCase().trim()] = row[idx].trim();
    return acc;
  }, {});
};

const csvForm = document.getElementById('csv-input');
csvForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const step = 100;
  for (let i = 0; i < data.length / step; i++) {
    const min = i * step;
    const max = i * step + step;
    postData(data.slice(min, max));
  }
});

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchForm.querySelector('input').value;
  getData(query);
});

let data;
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (event) => {
  event.preventDefault();
  const files = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(files);
  reader.onload = function (e) {
    const rows = Papa.parse(e.target.result).data;
    const header = rows[0];
    data = rows.slice(1).map((row) => {
      return buildData(row, header);
    });
  };
});
