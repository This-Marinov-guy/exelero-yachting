import { RouteList } from "@/utils/RouteList";
import Image from "next/image";
import Link from "@/components/commonComponents/LocalizedLink";
import React from "react";
import { usePublicText } from "@/lib/usePublicText";

const Logo: React.FC<{ part?: string }> = ({ part }) => {
  const tr = usePublicText();
  return (
    <Link href={RouteList.Home.CarDemo1} className='header-logo' aria-label={tr("Exelero Yachting home")}>
      <Image height={96} width={96} src={`/assets/images/logo/1.png`} alt='Exelero Yachting' className='img-fluid' priority />
      {/* <span className='header-toggle__brand-text'>Exelero Yachting</span> */}
    </Link>
  );
};

export default Logo;
