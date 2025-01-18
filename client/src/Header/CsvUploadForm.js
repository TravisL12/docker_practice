import React, { useState } from "react";
import Papa from "papaparse";
import { buildData } from "../utilities/";
import { addData } from "../utilities/apiRequests.js";
import { useDispatch } from "react-redux";
import { transactionsSlice } from "../state/TransactionsSlice";

const CsvUploadForm = () => {
  const dispatch = useDispatch();
  const handleUpdate = ({ data }) => {
    dispatch(transactionsSlice.actions.updateSpendingData({ data }));
  };

  const [csvUploadData, setCsvUploadData] = useState([]);

  const submitCsvInput = (event) => {
    event.preventDefault();
    const step = 100;
    for (let i = 0; i < csvUploadData.length / step; i++) {
      const min = i * step;
      const max = i * step + step;
      addData(csvUploadData.slice(min, max)).then((d) => {
        handleUpdate(d);
      });
    }
  };

  const onChangeFileInput = (event) => {
    const files = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(files);
    reader.onload = function (e) {
      const rows = Papa.parse(e.target.result).data;
      const header = rows[0];
      setCsvUploadData(
        rows.slice(1).map((row) => {
          return buildData(row, header);
        })
      );
    };
  };

  return (
    <form onSubmit={submitCsvInput}>
      <div>
        <label htmlFor="file-input">Upload CSV</label>
      </div>
      <input type="file" onChange={onChangeFileInput} id="file-input" />
      <button type="submit">Upload</button>
    </form>
  );
};

export default CsvUploadForm;
