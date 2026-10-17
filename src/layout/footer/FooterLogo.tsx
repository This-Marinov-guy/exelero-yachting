import { ImagePath } from "@/constants";
import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "@/components/commonComponents/LocalizedLink";
import React from "react";
import { usePublicText } from "@/lib/usePublicText";

const FooterLogo = () => {
  const tr = usePublicText();
  return (
    <Link href={RouteList.Home.CarDemo1} className='footer-logo' aria-label={tr("Exelero Yachting home")}>
      <Image src={`${ImagePath}/logo/1-transparent.png`} alt='' className='img-fluid' height={100} width={100} />
    </Link>
  );
};

export default FooterLogo;
