import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getParams } from "../utilities";

export const useQueryStrings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const addQueryString = useCallback(
    async (query) => {
      const queriesParams = getParams("query", searchParams);
      queriesParams.push(query);
      await setSearchParams({ query: queriesParams });
    },
    [searchParams, setSearchParams]
  );

  const deleteQueryString = useCallback(
    (query) => {
      const queriesParams = getParams("query", searchParams);
      const updateQueries = queriesParams.filter((q) => q !== query);
      setSearchParams({ query: updateQueries });
    },
    [searchParams, setSearchParams]
  );

  return { addQueryString, deleteQueryString };
};
