import React, { useCallback, useEffect, useState } from "react";
import { keys } from "lodash";

import { useDispatch, useSelector } from "react-redux";
import { queriesSelector } from "../state/selectors";
import {
  searchTransactions,
  transactionsSlice,
} from "../state/TransactionsSlice";
import { StyledSearchInput } from "./styles";
import { useQueryStrings } from "../hooks/useQueryStrings";

function SearchInput() {
  const dispatch = useDispatch();
  const { addQueryString, deleteQueryString } = useQueryStrings();
  const queries = useSelector(queriesSelector);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue("");
  }, [queries]);

  const fetchData = useCallback(
    (query) => {
      addQueryString(query);
      dispatch(searchTransactions({ query }));
    },
    [dispatch, addQueryString]
  );

  return (
    <StyledSearchInput>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData(searchValue);
        }}
      >
        <input
          type="text"
          id="search-input"
          placeholder="search query"
          value={searchValue || ""}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="query-list">
        {keys(queries)
          .sort()
          .map((query) => (
            <span
              key={query}
              style={{ background: queries[query].color }}
              onClick={() => {
                deleteQueryString(query);
                dispatch(transactionsSlice.actions.deleteQuery(query));
              }}
            >
              {query}
            </span>
          ))}
      </div>
    </StyledSearchInput>
  );
}

export default SearchInput;
