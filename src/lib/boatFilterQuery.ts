export const BOAT_FILTER_DEFAULTS = {
  priceStatus: [0, 1000000],
  yearBuiltStatus: [1900, 2030],
  squareFeetStatus: [0, 100000],
  boatBeamStatus: [0, 100],
  boatDraftStatus: [0, 50],
  boatDisplacementStatus: [0, 1000000],
  boatEnginePowerStatus: [0, 10000],
} as const;

export const BOAT_TYPES = ["racer", "sport-cruiser", "cruiser", "power-boat"] as const;

export const BOAT_RANGE_PARAMS = {
  price: "priceStatus",
  year: "yearBuiltStatus",
  length: "squareFeetStatus",
  beam: "boatBeamStatus",
  draft: "boatDraftStatus",
  displacement: "boatDisplacementStatus",
  power: "boatEnginePowerStatus",
} as const;

export const BOAT_LIST_PARAMS = {
  type: "boatType",
  condition: "boatCondition",
  manufacturer: "boatManufacturer",
  location: "boatLocation",
} as const;

export type BoatRangeParam = keyof typeof BOAT_RANGE_PARAMS;
export type BoatListParam = keyof typeof BOAT_LIST_PARAMS;

export type BoatFilters = {
  priceStatus: number[];
  yearBuiltStatus: number[];
  squareFeetStatus: number[];
  boatBeamStatus: number[];
  boatDraftStatus: number[];
  boatDisplacementStatus: number[];
  boatEnginePowerStatus: number[];
  boatType: string[];
  boatCondition: string[];
  boatManufacturer: string[];
  boatLocation: string[];
  boatVatIncluded: boolean | null;
  sortBy: string | null;
  popular: string | null;
  page: number;
};

const parseRange = (params: URLSearchParams, key: BoatRangeParam): number[] => {
  const fallback = BOAT_FILTER_DEFAULTS[BOAT_RANGE_PARAMS[key]];
  const match = params.get(key)?.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!match) return [...fallback];
  const min = Number(match[1]);
  const max = Number(match[2]);
  return Number.isFinite(min) && Number.isFinite(max) && (key !== "price" || min <= max) ? [min, max] : [...fallback];
};

const parseList = (params: URLSearchParams, key: BoatListParam): string[] => {
  const values = params.getAll(key).flatMap(value =>
    (key === "manufacturer" || key === "location") && value.startsWith("~")
      ? [value.slice(1)]
      : value.split(",")
  );
  return [...new Set(values.map(value => value.trim()).filter(Boolean))];
};

export const parseBoatFilters = (params: URLSearchParams): BoatFilters => {
  const rawPage = params.get("page");
  const page = rawPage && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1;
  const condition = parseList(params, "condition").map(value => {
    const normalized = value.toLowerCase();
    return ["pre_owned", "preowned", "used"].includes(normalized) ? "pre-owned" : normalized;
  });
  const selectedTypes = parseList(params, "type");

  return {
    priceStatus: parseRange(params, "price"),
    yearBuiltStatus: parseRange(params, "year"),
    squareFeetStatus: parseRange(params, "length"),
    boatBeamStatus: parseRange(params, "beam"),
    boatDraftStatus: parseRange(params, "draft"),
    boatDisplacementStatus: parseRange(params, "displacement"),
    boatEnginePowerStatus: parseRange(params, "power"),
    boatType: params.has("type") ? selectedTypes.filter(value => BOAT_TYPES.some(type => type === value)) : [...BOAT_TYPES],
    boatCondition: [...new Set(condition.filter(value => value === "new" || value === "pre-owned"))],
    boatManufacturer: parseList(params, "manufacturer"),
    boatLocation: parseList(params, "location"),
    boatVatIncluded: params.get("vat") === "true" ? true : params.get("vat") === "false" ? false : null,
    sortBy: params.get("sort") || null,
    popular: params.get("popular") || null,
    page: Number.isSafeInteger(page) ? page : 1,
  };
};

export const writeBoatList = (params: URLSearchParams, key: BoatListParam, values: string[]) => {
  params.delete(key);
  if (key === "type") {
    if (values.length === BOAT_TYPES.length) return;
    params.set(key, values.length ? values.join(",") : "none");
  } else if (key === "manufacturer" || key === "location") {
    values.forEach(value => params.append(key, `~${value}`));
  } else if (values.length) {
    params.set(key, values.join(","));
  }
};

export const writeBoatRange = (params: URLSearchParams, key: BoatRangeParam, range: number[]) => {
  const fallback = BOAT_FILTER_DEFAULTS[BOAT_RANGE_PARAMS[key]];
  if (range[0] === fallback[0] && range[1] === fallback[1]) params.delete(key);
  else params.set(key, `${range[0]}-${range[1]}`);
};
