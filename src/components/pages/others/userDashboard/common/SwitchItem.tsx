import { SwitchItemProps } from "@/types/Other";
import { FC } from "react";

const SwitchItem: FC<SwitchItemProps> = ({ title, description, checked }) => (
  <div className='switch-flex'>
    <div className='privacy-content'>
      <h6>{title}</h6>
      <p>{description}</p>
    </div>
    <div className='privacy-switch'>
      <input type='checkbox' className='input-switch' defaultChecked={checked} />
      <div className='switch-state' />
    </div>
  </div>
);

export default SwitchItem;
