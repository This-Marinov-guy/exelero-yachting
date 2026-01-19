import { Href, MyActive, SignOut } from "@/constants";
import { AccountData } from "@/data/layout/Header";
import { RouteList } from "@/utils/RouteList";
import { ProfileCircle } from "iconsax-react";
import Link from "next/link";
import React from "react";
import { Label } from "reactstrap";

const AccountSection = () => {
  return (
    <div className='login-flex onhover-dropdown'>
      <Link scroll={false} href={Href} className='login-icon'>
        <ProfileCircle />
        <span>Account</span>
        <i className='ri-arrow-down-wide-line' />
      </Link>
      <ul className='login-list onhover-list'>
        <li className='active-item'>
          <span>{MyActive}</span>
        </li>
        {AccountData.map((item, index) => (
          <li key={index} className='active-item'>
            <Link href={RouteList.Pages.Other.UserDashboard}>{item}</Link>
            {item === "Searches" && <Label>New</Label>}
          </li>
        ))}
        <li className='active-item'>
          <Link href={RouteList.Pages.Other.Login1} className='btn-solid'>
            {SignOut}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AccountSection;
