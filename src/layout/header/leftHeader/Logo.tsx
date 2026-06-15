import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo: React.FC<{ part?: string }> = ({ part }) => {
  return (
    <Link href={RouteList.Home.CarDemo1} className='header-logo' aria-label="Exelero Yachting home">
      <Image height={96} width={96} src={`/assets/images/logo/1.png`} alt='Exelero Yachting' className='img-fluid' priority />
      {/* <span className='header-toggle__brand-text'>Exelero Yachting</span> */}
    </Link>
  );
};

export default Logo;
