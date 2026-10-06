import { SocialMediaData } from "@/data/layout/Footer";
import Link from "next/link";
import { FC } from "react";
import FooterLogo from "./FooterLogo";

const FooterSocial: FC<{ endPoint: number, details: string }> = ({ endPoint, details }) => {
  return (
    <>
      <div className="footer-brand-row">
        <FooterLogo />
        <ul className='dark-footer-social' aria-label="Social media">
          {SocialMediaData.slice(0, endPoint).map((item) => (
            <li key={item.label}>
              <Link href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                {item.icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <p>{details}</p>
    </>
  );
};

export default FooterSocial;
