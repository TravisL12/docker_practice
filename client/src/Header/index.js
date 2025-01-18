import React from "react";

import CsvUploadForm from "./CsvUploadForm";
import { HeaderContainer, LogoContainer } from "./styles";
import SearchInput from "./SearchInput";
import { SFlex } from "../styles";
import {
  ALL_TRANSACTIONS_ROUTE,
  CALENDAR_ROUTE,
  GRAPHS_ROUTE,
  SEARCH_ROUTE,
  SPENDING_ROUTE,
} from "../utilities/routes";
import LinkWithQuery from "../LinkWithQuery";

function Header() {
  return (
    <>
      <LogoContainer>
        <span>Aqua</span>
      </LogoContainer>
      <HeaderContainer>
        <SFlex style={{ gap: "10px" }}>
          <LinkWithQuery to={`/${SPENDING_ROUTE}/${CALENDAR_ROUTE}`}>
            Calendar
          </LinkWithQuery>
          <LinkWithQuery to={`/${SPENDING_ROUTE}/${GRAPHS_ROUTE}`}>
            Categories
          </LinkWithQuery>
          <LinkWithQuery to={`/${SEARCH_ROUTE}`}>Search</LinkWithQuery>
          <LinkWithQuery to={`/${ALL_TRANSACTIONS_ROUTE}`}>
            Show All
          </LinkWithQuery>
        </SFlex>
        <SearchInput />
        <CsvUploadForm />
      </HeaderContainer>
    </>
  );
}

export default Header;
