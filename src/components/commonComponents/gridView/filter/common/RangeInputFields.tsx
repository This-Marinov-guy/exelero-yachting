import { getTrackBackground, Range } from "react-range";
import { FC, useEffect, useState } from "react";
import { RangeInputFieldsType } from "@/types/Product";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { MERGE_THRESHOLD, STEP, THUMB_SIZE } from "@/constants";
import { setBudgetStatus, setKmsDriven, setPriceStatus, setSalaryStatus } from "@/redux/reducers/FilterSlice";
import { formatPrice } from "@/utils";

const RangeInputFields: FC<RangeInputFieldsType> = ({ type }) => {
  const dispatch = useAppDispatch();
  const { minAndMaxPrice, budgetStatus, priceStatus, kmsDriven, minAndMaxKilometers, minAndMaxSalary, salaryStatus } = useAppSelector((state) => state.filter);
  const [rangePrice, setRangePrice] = useState<number[]>([40000, 500000]);
  const [value, setValue] = useState<number[]>(minAndMaxPrice || minAndMaxKilometers || minAndMaxSalary);

  const getAction = () => {
    switch (type) {
      case "car": return setBudgetStatus;
      case "job": return setSalaryStatus;
      case "KMS": return setKmsDriven;
      default: return setPriceStatus;
    }
  };

  const handlePriceChange = (values: number[]) => {
    dispatch(getAction()(values));
  };

  useEffect(() => {
    setRangePrice(type === "car" ? budgetStatus : type === "job" ? salaryStatus : type === "KMS" ? kmsDriven : priceStatus);
    setValue(type === "KMS" ? minAndMaxKilometers : type === "job" ? minAndMaxSalary : minAndMaxPrice);
  }, [budgetStatus, priceStatus, type, minAndMaxPrice, kmsDriven, minAndMaxKilometers, salaryStatus, minAndMaxSalary]);

  return (
    <Range
      values={rangePrice}
      step={type === "job" ? 1 : STEP}
      min={value[0] || 10} 
      max={value[1] || 1000000}
      onChange={(values) => handlePriceChange(values)}
      renderTrack={({ props, children }) => (
        <div onTouchStart={props.onTouchStart} onMouseDown={props.onMouseDown} style={{ ...props.style, height: "36px", display: "flex", width: "100%" }}>
          <div
            ref={props.ref}
            style={{
              height: "5px",
              width: "100%",
              borderRadius: "4px",
              background: getTrackBackground({
                values: rangePrice,
                colors: ["#ccc", "rgba(var(--theme-color), 1)", "#ccc"],
                min: value[0] || 10,
                max: value[1] || 1000000,
              }),
              alignSelf: "center",
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ index, props }) => {
        const isSameValue = rangePrice[0] === rangePrice[1];
        const isMerged = Math.abs(rangePrice[1] - rangePrice[0]) <= MERGE_THRESHOLD;
        return (
          <div {...props} key={index} style={{ ...props.style, height: `${THUMB_SIZE}px`, width: `${THUMB_SIZE}px`, top: "15px", borderRadius: "4px", backgroundColor: "rgba(var(--theme-color), 1)", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0px 2px 6px #AAA", zIndex: isMerged ? 2 : 1, }}>
            {isMerged && index === 0 ? (
              <div style={{ position: "absolute", top: "-30px", left: "50%", transform: "translateX(-50%)", color: "#fff", fontWeight: "bold", fontSize: "12px", fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif", padding: "4px", borderRadius: "4px", backgroundColor: "rgba(var(--theme-color), 1)", whiteSpace: "nowrap", }}>
               {isSameValue
                  ? formatPrice(rangePrice[0]) // Show single value if identical
                  : `${formatPrice(rangePrice[0])} - ${formatPrice(rangePrice[1])}`} {/* Show merged */}
                {type === "job" ? "K" : ""}
              </div>
            ) : !isMerged ? (
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
                  padding: "4px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(var(--theme-color), 1)",
                }}
              >
                {formatPrice(rangePrice[index])}
                {type === "job" ? "K" : ""}
              </div>
            ) : null}
          </div>
        )
      }}
    />
  );
};

export default RangeInputFields;
