import styled from "styled-components";
import { DAY_HIGHLIGHT, DAY_BG } from "../utilities/colors.js";

export const DayContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.isViewed ? DAY_HIGHLIGHT : DAY_BG)};
  box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  grid-column-start: ${(props) => (props.startDay ? props.startDay : "auto")};

  .query-list {
    position: absolute;
    top: 2px;
    left: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 12px;
    height: 100%;

    .query-items {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
  }
`;

export const DayHeader = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .date {
    font-size: 18px;
    font-weight: bold;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .total {
    font-size: 12px;
  }
`;
