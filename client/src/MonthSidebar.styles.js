import styled from "styled-components";
import { WHITE_BG } from "./utilities/colors";

export const SidebarContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 2;
  overflow: auto;
  background: ${WHITE_BG};
  border-radius: 3px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SidebarYear = styled.div``;

export const SidebarMonth = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 4px;
  background: ${(props) => (props.isSelected ? "lightgray" : "inherit")};

  .month-total {
    font-size: 12px;
  }
`;

export const QueryIndicators = styled.div`
  position: absolute;
  bottom: -3px;
  left: 8px;

  .indicator {
    display: inline-block;
    height: 5px;
    width: 15px;
    border-radius: 1px;
    margin-left: 2px;
  }
`;
