import styled from "styled-components";
import { BLACK, waveGradient } from "./utilities/colors";

const APP_PADDING = "10px";
export const AppContainer = styled.div`
  color: ${BLACK};
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 60px 1fr;
  gap: ${APP_PADDING};
  padding: ${APP_PADDING};
  box-sizing: border-box;
  height: 100vh;
  background: ${waveGradient[0]};
  background: linear-gradient(
    336deg,
    ${waveGradient[0]} 0%,
    ${waveGradient[1]} 44%,
    ${waveGradient[2]} 100%
  );
`;

export const SpendingDisplayContainer = styled.div`
  grid-column: 2 / 3;
  grid-row: 2;
  overflow: auto;
`;

export const SearchDisplayContainer = styled.div`
  grid-column: 1 / 3;
  grid-row: 2;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

export const AllTransDisplayContainer = styled.div`
  grid-column: 1 / 3;
  grid-row: 2;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

export const SFlex = styled.div`
  display: flex;
`;
