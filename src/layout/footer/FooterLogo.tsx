import { ImagePath } from "@/constants";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const FooterLogo = () => {
  return (
    <Link href={RouteList.Home.CarDemo1} className='footer-logo'>
      <Image src={`${ImagePath}/logo/footer-logo.png`} alt='footer-logo' className='img-fluid' height={100} width={100} />
    </Link>
  );
};

export default FooterLogo;
