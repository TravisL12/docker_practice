import styled from "styled-components";
import { waveGradient, WHITE_BG } from "../utilities/colors";

export const LogoContainer = styled.div`
  position: relative;
  grid-column: 1;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: 60px;
    font-weight: bold;
    text-transform: uppercase;
    background: linear-gradient(
      0deg,
      ${waveGradient[1]} 0%,
      ${waveGradient[0]} 100%
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }
`;

export const StyledSearchInput = styled.div`
  display: flex;

  .query-list {
    margin-left: 10px;

    span {
      display: inline-block;
      margin-right: 10px;
      padding: 4px 10px;
    }
  }
`;

export const HeaderContainer = styled.div`
  grid-column: 2 / 3;
  grid-row: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: ${WHITE_BG};
  border-radius: 3px;
`;

export const Dropdown = styled.div`
  position: relative;
`;

export const DropdownContainer = styled.div`
  position: absolute;
  background: white;
  display: flex;
  flex-direction: column;

  span {
    white-space: nowrap;
  }

  .inactive {
    color: lightgray;
  }
`;

export const DropdownItem = styled.span`
  display: block;
  padding: 4px 8px;
  cursor: pointer;
  background: ${(props) => props.backgroundColor};

  &:hover {
    background: lightgray;
  }
`;
