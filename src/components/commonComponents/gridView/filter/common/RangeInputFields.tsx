import { getTrackBackground, Range } from "react-range";
import { FC, useEffect, useRef, useState } from "react";
import { RangeInputFieldsType } from "@/types/Product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { MERGE_THRESHOLD, STEP, THUMB_SIZE } from "@/constants";
import { setBudgetStatus, setKmsDriven, setPriceStatus, setSalaryStatus } from "@/redux/reducers/FilterSlice";
import { usePublicLocale } from "@/app/i18n/i18n-context";
import { usePublicText } from "@/lib/usePublicText";
import { useBoatFilters } from "@/components/pages/boats/BoatFiltersContext";

const RangeInputFields: FC<RangeInputFieldsType> = ({ type }) => {
  const locale = usePublicLocale();
  const tr = usePublicText();
  const dispatch = useAppDispatch();
  const boatQuery = useBoatFilters();
  const { minAndMaxPrice, priceStatus } = useAppSelector((state) => state.filter);
  const [rangePrice, setRangePrice] = useState<number[]>(() => type === "boat" && boatQuery ? boatQuery.filters.priceStatus : priceStatus);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getAction = () => {
    switch (type) {
      case "car": return setBudgetStatus;
      case "job": return setSalaryStatus;
      case "KMS": return setKmsDriven;
      default: return setPriceStatus;
    }
  };

  const handlePriceChange = (values: number[]) => {
    // Update local state immediately for smooth UI
    setRangePrice(values);
    if (type === "boat" && boatQuery) return;
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer to dispatch after 0.8 seconds
    debounceTimerRef.current = setTimeout(() => {
      dispatch(getAction()(values));
    }, 500);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setRangePrice(type === "boat" && boatQuery ? boatQuery.filters.priceStatus : priceStatus);
  }, [type, boatQuery?.filters.priceStatus, priceStatus, minAndMaxPrice]);

  // react-range requires min < max (not equal). Ensure bounds are always valid.
  const step = type === "job" ? 1 : STEP;
  const minBound = 0;
  const maxBound = type === "boat" ? Math.max(1000000, rangePrice[1]) : 1000000;

  return (
    <Range
      values={rangePrice}
      step={step}
      min={minBound}
      max={maxBound}
      onChange={(values) => handlePriceChange(values)}
      onFinalChange={(values) => {
        if (type === "boat") boatQuery?.setRange("price", values);
      }}
      renderTrack={({ props, children }) => (
        <div onTouchStart={props.onTouchStart} onMouseDown={props.onMouseDown} style={{
          ...props.style, height: "36px", display: "flex", width: "100%", padding: `0 10px`,
 }}>
          <div
            ref={props.ref}
            style={{
              height: "5px",
              width: "100%",
              borderRadius: "4px",
              background: getTrackBackground({
                values: rangePrice,
                colors: ["#ccc", "rgba(var(--theme-color), 1)", "#ccc"],
                min: minBound,
                max: maxBound,
              }),
              alignSelf: "center",
              
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ index, props }) => {
        const { key, ...thumbProps } = props;
        return <div
          key={key}
          {...thumbProps}
          aria-label={tr(index === 0 ? "Price minimum" : "Price maximum")}
          style={{
            ...props.style,
            height: `${THUMB_SIZE}px`,
            width: `${THUMB_SIZE}px`,
            backgroundColor: "rgba(var(--theme-color), 1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-30px",
              background: "rgba(var(--theme-color), 1)",
              color: "#fff",
              padding: "4px",
              fontSize: "12px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
            }}
          >
            {new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : locale).format(rangePrice[index])}
            {type === "job" ? "K" : ""}
          </div>
        </div>
      }}
    />
  );
};

export default RangeInputFields;
