import { InputBoxType } from "@/types/CommonComponents";
import React, { FC } from "react";

const CommonInput: FC<InputBoxType> = ({ inputType, label, placeholder, mainClass, ColClass }) => {
  return (
    <div className={ColClass}>
      <div className={`${mainClass ? mainClass : ""}form-input`}>
        <label>{label}</label>
        <div className={`select-button arrow-none`}>
          <input type={inputType} className='form-control' placeholder={placeholder} />
        </div>
      </div>
    </div>
  );
};

export default CommonInput;
