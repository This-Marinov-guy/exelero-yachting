import { Href, Language } from "@/constants";
import { LanguagesData } from "@/data/layout/Header";
import { LanguageCircle } from "iconsax-react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSection: React.FC<{ part?: string }> = ({ part }) => {
  const { i18n } = useTranslation(); 
  return (
    <div>
      {!part?.includes("property") && (
        <div className='login-flex onhover-dropdown'>
          <Link scroll={false} href={Href} className='login-icon'>
            <LanguageCircle />
            <span>{Language}</span>
            <i className='ri-arrow-down-wide-line' />
          </Link>
          <ul className='active-list onhover-list'>
            {LanguagesData.map((item, index) => (
              <li className='active-item' key={index} onClick={() => i18n.changeLanguage(item.data)}>
                <Link scroll={false} href={Href}>{item.language}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSection;
