import styled from "styled-components";
import { WHITE_BG } from "../utilities/colors";

export const MonthWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(400px, 575px);
  grid-template-rows: auto 1fr;
  gap: 10px;
  overflow: auto;
  height: 100%;
  box-sizing: border-box;

  .month-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    grid-column: 1;
    grid-row: 1;

    .title {
      font-size: 24px;
    }

    .options {
      width: 200px;
      display: flex;
      justify-content: space-between;
    }
  }

  .display-wrapper {
    height: 100%;
    padding: 10px 0 10px 10px;
    box-sizing: border-box;
  }

  .monthly-item-tables {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    overflow: auto;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: ${WHITE_BG};
    border-radius: 3px;

    .item-tables {
      display: flex;
    }
  }
`;

export const DisplayContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 2;
`;

export const TableListContainer = styled.div`
  flex: 1;
  font-size: 12px;

  & + & {
    margin-left: 10px;
  }

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    h3 {
      margin: 0;
    }

    .category-toggle {
      background: none;
      border: none;
      padding: 0 10px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .month-items {
    display: flex;
    padding: 5px 3px;
    background: white;
    margin-bottom: 3px;
    cursor: pointer;

    &.inactive {
      color: lightgray;
    }

    .amount {
      flex: 1;
      padding-right: 10px;
      text-align: right;
    }

    .description-category {
      width: 75%;

      .category {
        color: gray;
        font-size: 13px;
      }
    }
  }
`;

export const MonthlySpendingContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 2;
  font-size: 12px;
  flex: 1;
  overflow: auto;
`;

export const TableContainer = styled.table`
  width: 100%;
  border-spacing: 0;

  tbody td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 2px 5px;
  }

  .description,
  .category {
    max-width: 230px;
  }

  .amount,
  .date {
    text-align: right;
  }

  .isViewed {
    td {
      background: lightgray;
    }
    .date {
      background: #6ee4ff;
    }
  }

  .total-row td {
    position: sticky;
    bottom: 0;
    background: white;
    text-align: right;
  }
`;
