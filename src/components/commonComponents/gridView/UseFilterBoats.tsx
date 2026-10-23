import { useBoatFilters } from "@/components/pages/boats/BoatFiltersContext";
import { BoatFilters } from "@/lib/boatFilterQuery";
import { FilterProductsType, ProductType } from "@/types/Product";
import { useMemo } from "react";

export const filterBoats = (value: ProductType[], filters: BoatFilters) => {
  const { sortBy, popular, priceStatus, yearBuiltStatus, squareFeetStatus, boatType, boatCondition, boatManufacturer, boatLocation, boatBeamStatus, boatDraftStatus, boatDisplacementStatus, boatEnginePowerStatus, boatVatIncluded } = filters;

  return value
    .filter(product => {
      const inRange = (number: number | undefined, range: number[]) => number === undefined || (range[0] <= number && number <= range[1]);
      const filterBoatType = boatType.length > 0 && (boatType.length === 4 || Boolean(product.boatType && boatType.includes(product.boatType)));
      const filterCondition = boatCondition.length === 0 || Boolean(product.condition && boatCondition.includes(product.condition));
      const filterManufacturer = boatManufacturer.length === 0 || (Array.isArray(product.category) ? product.category.some(cat => boatManufacturer.includes(cat)) : boatManufacturer.includes(product.category || ""));
      const filterLocation = boatLocation.length === 0 || Boolean(product.location && boatLocation.includes(product.location));

      return inRange(product.price, priceStatus)
        && inRange(product.year, yearBuiltStatus)
        && inRange(product.squareFeet, squareFeetStatus)
        && inRange(product.beam, boatBeamStatus)
        && inRange(product.draft, boatDraftStatus)
        && inRange(product.displacement, boatDisplacementStatus)
        && inRange(product.enginePower, boatEnginePowerStatus)
        && filterBoatType && filterCondition && filterManufacturer && filterLocation
        && (boatVatIncluded === null || product.vatIncluded === boatVatIncluded)
        && (!popular || product.productState === popular);
    })
    .sort((a, b) => {
      if (sortBy === "Price (High to Low)") return (b.price ?? 0) - (a.price ?? 0);
      if (sortBy === "Price (Low to High)") return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === "Alphabetical A-Z") return a.title.localeCompare(b.title);
      if (sortBy === "Alphabetical Z-A") return b.title.localeCompare(a.title);
      if (sortBy === "Year (Newest First)") return (b.year ?? 0) - (a.year ?? 0);
      if (sortBy === "Year (Oldest First)") return (a.year ?? 0) - (b.year ?? 0);
      return 0;
    });
};

const UseFilterBoats = ({ value }: FilterProductsType) => {
  const boatFilters = useBoatFilters();
  if (!boatFilters) throw new Error("Boat filters require BoatFiltersProvider");
  const { filters } = boatFilters;
  return useMemo(() => filterBoats(value, filters), [value, filters]);
};

export default UseFilterBoats;
