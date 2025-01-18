import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  allTransactionsDataSelector,
  categoriesSelector,
} from "../state/selectors";
import { AllTransDisplayContainer, SFlex } from "../styles";
import { currency, localDateString } from "../utilities";
import styled from "styled-components";
import { waveGradient } from "../utilities/colors";
import { TableContainer } from "../SpendingDisplay/SpendingDisplay.styles";

const SPageButton = styled.button`
  background-color: ${(props) => (props.isSelected ? waveGradient[0] : null)};
`;

const PAGE_SIZE = 1000;
const AllTransactions = () => {
  const [page, setPage] = useState(0);
  const transactions = useSelector(allTransactionsDataSelector);
  const categories = useSelector(categoriesSelector);

  const totalPages = useMemo(
    () => Math.ceil(transactions.length / PAGE_SIZE),
    [transactions.length]
  );
  const pagesIterator = [...Array(totalPages).keys()];
  const data = transactions?.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <AllTransDisplayContainer>
      <SFlex
        style={{ gap: "20px", paddingBottom: "10px", justifyContent: "center" }}
      >
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <SFlex style={{ gap: "5px" }}>
          {pagesIterator.map((num) => {
            return (
              <SPageButton
                isSelected={num === page}
                onClick={() => setPage(num)}
              >
                {num + 1}
              </SPageButton>
            );
          })}
        </SFlex>
        <button
          disabled={page + 1 === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
        <span>Total: {transactions.length}</span>
      </SFlex>
      <div style={{ flex: 1, overflow: "auto" }}>
        <TableContainer style={{ fontSize: "12px" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>description</th>
              <th>Payee</th>
              <th>Amount</th>
              <th>Category</th>
              <th>SubCategory</th>
            </tr>
          </thead>
          <tbody>
            {data.map((trans, idx) => {
              const categoryColor = categories[trans.category].color;
              return (
                <tr key={`${idx}`}>
                  <td className="date">
                    {localDateString(new Date(trans.date))}
                  </td>
                  <td>{trans.description}</td>
                  <td className="description">{trans.payee}</td>
                  <td className="amount">{currency(trans.amount)}</td>
                  <td
                    className="description"
                    style={{ background: categoryColor }}
                  >
                    {trans.category}
                  </td>
                  <td className="description">{trans.subcategory}</td>
                </tr>
              );
            })}
          </tbody>
        </TableContainer>
      </div>
    </AllTransDisplayContainer>
  );
};

export default AllTransactions;
