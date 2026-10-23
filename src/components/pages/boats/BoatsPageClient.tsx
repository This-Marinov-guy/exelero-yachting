"use client";

import GridView from "@/components/commonComponents/gridView";
import TopFilter from "@/components/commonComponents/TopFilter";
import { ProductType } from "@/types/Product";
import { usePublicText } from "@/lib/usePublicText";
import { BoatFiltersProvider } from "./BoatFiltersContext";

type BoatsPageClientProps = {
  boats: ProductType[];
};

const BoatsPageClient = ({ boats }: BoatsPageClientProps) => {
  const tr = usePublicText();
  return (
    <>
      <TopFilter
        title={tr("Yachts for Sale")}
        description={tr("Preowned Yachts for Sale")}
      />
      <BoatFiltersProvider>
        <GridView type={"boat"} gridSize={4} cardShow={12} initialProducts={boats} />
      </BoatFiltersProvider>
    </>
  );
};

export default BoatsPageClient;
