import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { BLACK } from "./utilities/colors";

export const SNavLink = styled(NavLink)`
  color: ${BLACK};
  cursor: pointer;
  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
`;

const LinkWithQuery = ({ children, to, ...props }) => {
  const { search } = useLocation();

  return (
    <SNavLink to={to + search} {...props}>
      {children}
    </SNavLink>
  );
};

export default LinkWithQuery;
