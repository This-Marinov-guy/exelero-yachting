import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo: React.FC<{ part?: string }> = ({ part }) => {
  return (
    <Link href={RouteList.Home.CarDemo1} className='header-logo'>
      <Image height={100} width={100} src={`/assets/images/logo/1-transparent.png`} alt='logo' className='img-fluid' />
    </Link>
  );
};

export default Logo;
