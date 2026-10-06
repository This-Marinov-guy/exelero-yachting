import { InputBoxType } from "@/types/CommonComponents";
import React, { FC, useId } from "react";

const CommonInput: FC<InputBoxType> = ({
  inputType,
  label,
  placeholder,
  mainClass,
  ColClass,
  inputClass,
  name,
  id,
  value,
  defaultValue,
  onChange,
  autoComplete,
  required,
  disabled,
  rightText,
  leftText,
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  return (
    <div className={ColClass}>
      <div className={`${mainClass ? mainClass : ""}form-input`}>
        {label && <label htmlFor={inputId}>{label}</label>}
        <div className={`select-button arrow-none ${rightText || leftText ? "input-group" : ""}`}>
          {leftText && <span className="input-group-text">{leftText}</span>}
          <input
            id={inputId}
            name={name}
            type={inputType}
            className={`form-control ${inputClass ?? ""}`}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            autoComplete={autoComplete}
            required={required}
            disabled={disabled}
          />
          {rightText && <span className="input-group-text">{rightText}</span>}
        </div>
      </div>
    </div>
  );
};

export default CommonInput;
