import { Href } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { setCartData } from "@/redux/reducers/LayoutSlice";
import { LeftHeaderProps } from "@/types/Layout";
import Link from "next/link";
import React from "react";
import Logo from "./Logo";
import PropertyDropDown from "./PropertyDropdown";

const LeftHeader: React.FC<LeftHeaderProps> = ({ sidebarOpen, part, isJobOrProperty }) => {
  const dispatch = useAppDispatch();
  return (
    <div className='left-side-header'>
      <Link scroll={false} href={Href} className={`toggle ${sidebarOpen ? "open" : ""}`} onClick={() => dispatch(setCartData())}>
        <i className='ri-menu-line' />
      </Link>
      <Logo part={part} />
      <PropertyDropDown part={part} isJobOrProperty={isJobOrProperty} />
    </div>
  );
};

export default LeftHeader;
