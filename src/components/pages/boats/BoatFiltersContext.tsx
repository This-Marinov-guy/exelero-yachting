"use client";

import { BOAT_LIST_PARAMS, BOAT_RANGE_PARAMS, BoatFilters, BoatListParam, BoatRangeParam, parseBoatFilters, writeBoatList, writeBoatRange } from "@/lib/boatFilterQuery";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";

type BoatFiltersContextValue = {
  filters: BoatFilters;
  setList: (key: BoatListParam, values: string[]) => void;
  setRange: (key: BoatRangeParam, values: number[]) => void;
  setSort: (sort: string | null) => void;
  setPage: (page: number, replace?: boolean) => void;
};

const BoatFiltersContext = createContext<BoatFiltersContextValue | null>(null);

export const useBoatFilters = () => useContext(BoatFiltersContext);

export const BoatFiltersProvider = ({ children }: { children: ReactNode }) => {
  const searchParams = useSearchParams();
  const query = searchParams?.toString() ?? "";
  const filters = useMemo(() => parseBoatFilters(new URLSearchParams(query)), [query]);

  const update = useCallback((change: (params: URLSearchParams) => void, replace = false, resetPage = true) => {
    // Read the live URL so two quick changes never overwrite each other.
    const params = new URLSearchParams(window.location.search);
    change(params);
    if (resetPage) params.delete("page");
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history[replace ? "replaceState" : "pushState"](null, "", next);
    }
  }, []);

  const setList = useCallback((key: BoatListParam, values: string[]) => {
    if (key in BOAT_LIST_PARAMS) update(params => writeBoatList(params, key, values));
  }, [update]);

  const setRange = useCallback((key: BoatRangeParam, values: number[]) => {
    if (key in BOAT_RANGE_PARAMS) update(params => writeBoatRange(params, key, values), true);
  }, [update]);

  const setSort = useCallback((sort: string | null) => {
    update(params => {
      if (sort) params.set("sort", sort);
      else params.delete("sort");
      params.delete("popular");
      if (sort === "Most Popular") params.set("popular", sort);
    });
  }, [update]);

  const setPage = useCallback((page: number, replace = false) => {
    update(params => {
      if (page > 1) params.set("page", String(page));
      else params.delete("page");
    }, replace, false);
  }, [update]);

  return <BoatFiltersContext.Provider value={{ filters, setList, setRange, setSort, setPage }}>{children}</BoatFiltersContext.Provider>;
};
