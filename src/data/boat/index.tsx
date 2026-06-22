// Boat filter data

export const BoatConditionData = [
  { id: "condition-new", label: "New", type: "new" },
  { id: "condition-pre-owned", label: "Pre-owned", type: "pre-owned" },
];

export const BoatKeelTypeData = [
  { id: "keel-fin", label: "Fin Keel", type: "Fin Keel" },
  { id: "keel-bulb", label: "Bulb Keel", type: "Bulb Keel" },
  { id: "keel-winged", label: "Winged keel", type: "Winged keel" },
  { id: "keel-long", label: "Long keel", type: "Long keel" },
  { id: "keel-bilge", label: "Bilge Keel", type: "Bilge Keel" },
  { id: "keel-sword", label: "Keel Sword", type: "Keel Sword" },
  { id: "keel-canting", label: "Canting Keel", type: "Canting Keel" },
  { id: "keel-swiveling", label: "Swiveling Keel", type: "Swiveling Keel" },
  { id: "keel-lifting", label: "Lifting Keel", type: "Lifting Keel" },
];

export const BoatCeDesignCategoryData = [
  { id: "ce-a-ocean", label: "A - Ocean", type: "A - Ocean" },
  { id: "ce-b-offshore", label: "B - Offshore", type: "B - Offshore" },
  { id: "ce-c-inshore", label: "C - Inshore", type: "C - Inshore" },
  { id: "ce-d-sheltered", label: "D - Sheltered Waters", type: "D - Sheltered Waters" },
];

export const BoatMaterialData = [
  { id: "material-grp", label: "GRP", type: "GRP" },
  { id: "material-wood", label: "Wood", type: "Wood" },
  { id: "material-aluminium", label: "Aluminium", type: "Aluminium" },
  { id: "material-steel", label: "Steel", type: "Steel" },
  { id: "material-polyethylene", label: "Polyethylene", type: "Polyethylene" },
  { id: "material-ferro-cement", label: "Ferro Cement", type: "Ferro Cement" },
  { id: "material-carbon-fiber", label: "Carbon Fiber", type: "Carbon Fiber" },
];

export const VatIncludedData = [
  { id: "vat-yes", label: "VAT Included", type: "vat_included", value: "true" },
  { id: "vat-no", label: "VAT Not Included", type: "vat_included", value: "false" },
];

// These will be populated dynamically from actual boat data
export const BoatManufacturerData: { id: string; label: string; type: string }[] = [];
export const BoatLocationData: { id: string; label: string; type: string }[] = [];
